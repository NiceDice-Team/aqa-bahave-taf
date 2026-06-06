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
    await this.sortDropdown.selectOption(option);
    await this.waitForPageLoad();
  }

  async filterByCategory(category: string): Promise<void> {
    await this.categoryFilters.waitFor({ state: 'visible' });
    const btn = this.categoryFilters.getByRole('button', { name: category });
    await btn.click();
    await this.waitForPageLoad();
  }

  async filterByPriceRange(min: number, max: number): Promise<void> {
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
    const name = ((await firstCard.textContent()) ?? 'first-product').trim().substring(0, 50);
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
    const active = this.categoryFilters.locator('[aria-pressed="true"], .active, [data-active="true"]').first();
    return (await active.textContent()) ?? '';
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
