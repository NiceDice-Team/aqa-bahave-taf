import { WebAdapter } from './base.adapters';
import { IProduct, ProductDetails, ProductFilter, ReviewData } from '../interfaces/product.interface';

export class ProductWebAdapter extends WebAdapter implements IProduct {
  async viewProduct(productId: string): Promise<void> {
    // UI implementation or leave empty
  }

  async getProductDetails(productId: string): Promise<ProductDetails> {
    // UI implementation or leave empty
    return {
      id: '',
      name: '',
      price: 0,
      stock: 0,
      description: '',
      images: [],
    };
  }

  async getProducts(filter?: ProductFilter): Promise<ProductDetails[]> {
    // UI implementation or leave empty
    return [];
  }

  async addReview(productId: string, data: ReviewData): Promise<void> {
    // UI implementation or leave empty
  }

  async getReviews(productId: string): Promise<ReviewData[]> {
    // UI implementation or leave empty
    return [];
  }

  async switchImage(index: number): Promise<void> {
    // UI implementation or leave empty
  }
}
