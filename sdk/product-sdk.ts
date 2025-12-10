import { IProduct, ProductDetails, ReviewData } from '../interfaces/product.interface';
import { ProductApiAdapter, ProductWebAdapter } from '../adapters';

export class ProductSDK implements IProduct {
  private adapter: ProductApiAdapter | ProductWebAdapter;

  constructor(adapter: ProductApiAdapter | ProductWebAdapter) {
    this.adapter = adapter;
  }

  async viewProduct(productId: string): Promise<void> {
    await this.adapter.viewProduct(productId);
  }

  async getProductDetails(productId: string): Promise<ProductDetails> {
    return this.adapter.getProductDetails(productId);
  }

  async getProducts(filter?: any): Promise<ProductDetails[]> {
    return this.adapter.getProducts(filter);
  }

  async addReview(productId: string, data: ReviewData): Promise<void> {
    await this.adapter.addReview(productId, data);
  }

  async getReviews(productId: string): Promise<ReviewData[]> {
    return this.adapter.getReviews(productId);
  }

  async switchImage(index: number): Promise<void> {
    await this.adapter.switchImage(index);
  }
}