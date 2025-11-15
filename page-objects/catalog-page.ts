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
    // Prefer test ids for stable E2E selectors; fallback to roles if test ids are not present in the DOM
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

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
    await this.waitForPageLoad();
  }

  async filterByCategory(category: string) {
    await this.categoryFilters.waitFor({ state: 'visible' });
    
    // Find and click the category button within the group
    const categoryButton = this.categoryFilters.getByRole('button', { name: category });
    await categoryButton.click();
    
    await this.waitForPageLoad();
  }

  async filterByPriceRange(min: number, max: number) {
    // Implementation depends on the actual slider component
    await this.priceFilter.click();
    // Add actual price range selection logic when component is implemented
  }

  async getProductCount(): Promise<number> {
    return this.productGrid.locator('[data-testid="product-card"]').count();
  }
}