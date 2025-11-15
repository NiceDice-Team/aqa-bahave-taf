import { Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { ProductCard } from './components/product-card';

export class HomePage extends BasePage {
  readonly newArrivalsHeading: Locator;
  readonly nextSlideButton: Locator;
  readonly buyNowButton: Locator;
  readonly bestsellersLink: Locator;
  readonly saleLink: Locator;
  readonly boardGamesLink: Locator;
  readonly firstProductCard: ProductCard;

  constructor(page) {
    super(page);
    this.newArrivalsHeading = page.getByRole('heading', { name: 'NEW ARRIVALS' });
    this.nextSlideButton = page.getByRole('button', { name: 'Next slide' });
    this.buyNowButton = page.getByRole('button', { name: 'BUY NOW' });
    this.bestsellersLink = page.getByRole('link', { name: 'BESTSELLERS Shop now →' });
    this.saleLink = page.getByRole('link', { name: 'SALE Shop now →' });
    this.boardGamesLink = page.getByRole('link', { name: 'BOARD GAMES Shop now →' });
    
    const firstCardContainer = page.locator('[data-testid="product-card"]').first();
    this.firstProductCard = new ProductCard(page, firstCardContainer);
  }

  async getProductCards(): Promise<ProductCard[]> {
    const containers = await this.page.locator('[data-testid="product-card"]').all();
    return containers.map(container => new ProductCard(this.page, container));
  }

  async navigateToBestsellers() {
    await this.bestsellersLink.click();
  }

  async navigateToSale() {
    await this.saleLink.click();
  }

  async navigateToBoardGames() {
    await this.boardGamesLink.click();
  }

  async goToNextSlide() {
    await this.nextSlideButton.click();
  }

  async clickBuyNow() {
    await this.buyNowButton.click();
  }
}