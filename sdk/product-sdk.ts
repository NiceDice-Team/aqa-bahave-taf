import { Page } from '@playwright/test';
import { BaseSDK } from './base-sdk';
import { WebProductAdapter, ProductDetails, ReviewData } from '../adapters/WebProductAdapter';

export class ProductSDK extends BaseSDK {
  private webAdapter: WebProductAdapter;

  constructor(page: Page) {
    super(page);
    this.webAdapter = new WebProductAdapter(this.page);
  }

  async viewProduct(productId: string): Promise<void> {
    await this.webAdapter.viewProduct(productId);
  }

  async getProductDetails(productId: string): Promise<ProductDetails> {
    return this.webAdapter.getProductDetails(productId);
  }

  async addReview(productId: string, data: ReviewData): Promise<void> {
    await this.webAdapter.addReview(productId, data);
  }

  async getReviews(productId: string): Promise<ReviewData[]> {
    return this.webAdapter.getReviews(productId);
  }

  async switchImage(index: number): Promise<void> {
    await this.webAdapter.switchImage(index);
  }
}