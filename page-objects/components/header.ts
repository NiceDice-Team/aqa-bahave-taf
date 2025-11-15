import { Locator, Page } from '@playwright/test';

export class Header {
  readonly page: Page;
  readonly profileLink: Locator;
  readonly cartButton: Locator;
  readonly catalogLink: Locator;
  readonly saleLink: Locator;
  readonly comingSoonLink: Locator;
  readonly reviewsLink: Locator;
  readonly aboutLink: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileLink = page.getByRole('link', { name: 'Profile' });
    this.cartButton = page.getByRole('button', { name: 'Cart' });
    this.catalogLink = page.getByRole('link', { name: 'board games', exact: true });
    this.saleLink = page.getByRole('link', { name: 'sale', exact: true });
    this.comingSoonLink = page.getByRole('link', { name: 'coming soon' });
    this.reviewsLink = page.getByRole('link', { name: 'reviews' });
    this.aboutLink = page.getByRole('link', { name: 'about', exact: true });
    this.searchInput = page.getByPlaceholder('Search');
  }

  async navigateToProfile() {
    await this.profileLink.click();
  }

  async openCart() {
    await this.cartButton.click();
  }

  async navigateToCatalog() {
    await this.catalogLink.click();
  }

  async navigateToSale() {
    await this.saleLink.click();
  }

  async navigateToComingSoon() {
    await this.comingSoonLink.click();
  }

  async navigateToReviews() {
    await this.reviewsLink.click();
  }

  async navigateToAbout() {
    await this.aboutLink.click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }
}