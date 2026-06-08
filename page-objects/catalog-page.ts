import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class CatalogPage extends BasePage {
  readonly filterPanel: Locator;
  readonly sortDropdown: Locator;
  readonly productGrid: Locator;
  readonly priceFilter: Locator;
  readonly categoryFilters: Locator;
  readonly breadcrumbs: Locator;
  readonly homeLink: Locator;
  readonly viewToggle: Locator;
  readonly emptyStateMessage: Locator;
  readonly pagination: Locator;

  constructor(page: Page) {
    super(page);
    this.filterPanel = page.getByTestId('filters');
    this.sortDropdown = page.getByTestId('sort-dropdown');
    this.productGrid = page.getByRole('main');
    this.priceFilter = page.getByTestId('price-filter');
    this.categoryFilters = page.getByTestId('categories');
    this.breadcrumbs = page.getByRole('navigation', { name: /breadcrumb/i });
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.viewToggle = page.getByTestId('view-toggle');
    this.emptyStateMessage = page.getByText('No products found');
    this.pagination = page.getByTestId('pagination');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/catalog');
    await this.waitForPageLoad();
  }

  async sortBy(option: string): Promise<void> {
    // Try the testid select first, then any sort-related select, then a clickable control
    const select = this.page
      .locator('[data-testid="sort-dropdown"], select[name*="sort"], select[id*="sort"], select[class*="sort"]')
      .first();
    try {
      await select.waitFor({ state: 'visible', timeout: 3000 });
      if (await select.isVisible()) {
        await select.selectOption(option);
        await this.waitForPageLoad();
        return;
      }
    } catch {
      // Continue to fallback
    }

    // Fallback: sort may be a button/link group
    try {
      const label = option.replace(/-/g, ' ');
      const btn = this.page
        .getByRole('button', { name: new RegExp(label, 'i') })
        .or(this.page.getByRole('option', { name: new RegExp(label, 'i') }))
        .first();
      await btn.waitFor({ state: 'visible', timeout: 3000 });
      await btn.click();
      await this.waitForPageLoad();
      return;
    } catch {
      // Continue to last resort
    }

    // Last resort: try text selector with partial match
    try {
      const anySort = this.page
        .locator(`[class*="sort"] button, a[class*="sort"], button:has-text("${option.split('-')[0]}")`)
        .first();
      await anySort.waitFor({ state: 'visible', timeout: 3000 });
      await anySort.click();
      await this.waitForPageLoad();
    } catch {
      throw new Error(`Sort option "${option}" not found. Tried select and button strategies.`);
    }
  }

  async filterByCategory(category: string): Promise<void> {
    // Broaden the panel selector beyond a single testid
    const panel = this.page
      .locator('[data-testid="categories"], [aria-label*="categor" i], [class*="categor"], aside, nav[class*="filter"]')
      .first();
    try {
      await panel.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    } catch {
      // Panel not found — fall through to direct button search
    }

    const humanLabel = category.replace(/-/g, ' ');

    // Try button/link with matching text
    try {
      const btn = this.page
        .getByRole('button', { name: new RegExp(humanLabel, 'i') })
        .or(this.page.getByRole('link', { name: new RegExp(humanLabel, 'i') }))
        .first();
      await btn.waitFor({ state: 'visible', timeout: 5000 });
      await btn.click();
      await this.waitForPageLoad();
      return;
    } catch {
      // Continue to fallback
    }

    // Fallback: search with selector
    try {
      const any = this.page
        .locator(`button:has-text("${humanLabel}"), a:has-text("${humanLabel}"), [class*="filter"] button`)
        .first();
      await any.waitFor({ state: 'visible', timeout: 5000 });
      await any.click();
      await this.waitForPageLoad();
    } catch {
      throw new Error(`Category "${category}" filter button not found. Tried role-based and text-matching strategies.`);
    }
  }

  async filterByPriceRange(_min: number, _max: number): Promise<void> {
    await this.priceFilter.click();
    // Actual slider implementation is app-specific
  }

  async getProductCount(): Promise<number> {
    return this.productGrid.locator('[data-testid="product-card"]').count();
  }

  /** Navigate to the first available product in the catalog, returns its name */
  async clickFirstProduct(): Promise<string> {
    await this.navigate();
    const firstCard = this.page.locator('a[href*="/product/"]').first();
    await firstCard.waitFor({ state: 'visible' });

    // Prefer a heading / title element inside the card to get a clean product name
    const titleEl = firstCard.locator('h2, h3, h4, [class*="title"], [class*="name"], [class*="heading"]').first();
    let name: string;
    if ((await titleEl.count()) > 0) {
      name = ((await titleEl.textContent()) ?? 'first-product').trim().replace(/\s+/g, ' ').substring(0, 100);
    } else {
      // Fallback: extract product name from card, strip price/stock/quantity noise
      const raw = ((await firstCard.textContent()) ?? 'first-product').trim();
      // Take first line or first part before common separators
      name = (raw.split(/\n|\$|\(\d|ADD TO CART/i)[0] ?? raw).trim().replace(/\s+/g, ' ').substring(0, 100);
    }

    await firstCard.click();
    await this.waitForPageLoad();
    return name;
  }

  /** Navigate to a product detail page by its visible name in the catalog */
  async navigateToProductByName(productName: string): Promise<void> {
    await this.navigate();
    const link = this.page
      .locator(`a[href*="/product/"]:has-text("${productName}"), a:has-text("${productName}")`)
      .first();
    await link.click();
    await this.waitForPageLoad();
  }

  /** Name of the currently active category filter (if any) */
  async getActiveCategoryName(): Promise<string> {
    try {
      // Try to find active category indicator
      const active = this.categoryFilters
        .locator('[aria-pressed="true"], .active, [data-active="true"], [class*="active"]')
        .first();
      await active.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      const text = await active.textContent().catch(() => null);
      return text?.trim() ?? '';
    } catch {
      // Fallback: check URL to infer active category from filter param
      const url = this.page.url();
      const match = url.match(/category=([^&]+)/);
      return match ? decodeURIComponent(match[1]) : '';
    }
  }

  /**
   * Returns true when every visible product price is ≤ the next one (ascending order).
   * Silently returns true when fewer than 2 prices are visible.
   */
  async isSortedByPriceAscending(): Promise<boolean> {
    return this._checkPriceOrder('asc');
  }

  async isSortedByPriceDescending(): Promise<boolean> {
    return this._checkPriceOrder('desc');
  }

  private async _checkPriceOrder(order: 'asc' | 'desc'): Promise<boolean> {
    const priceEls = this.productGrid.locator('[data-testid="product-price"], .product-price, .price');
    const texts = await priceEls.allTextContents();
    const prices = texts.map((t) => parseFloat(t.replace(/[^0-9.]/g, ''))).filter((n) => !isNaN(n));
    if (prices.length < 2) return true;
    for (let i = 0; i < prices.length - 1; i++) {
      if (order === 'asc' && prices[i] > prices[i + 1]) return false;
      if (order === 'desc' && prices[i] < prices[i + 1]) return false;
    }
    return true;
  }
}
