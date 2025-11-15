import { IProductSDK } from './interfaces/index';

export class ProductSDK implements IProductSDK {
  async getProducts(filters?: any): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async getProduct(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async searchProducts(query: string): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async getCategories(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async getProductsByCategory(categoryId: string): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async getProductReviews(productId: string): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async addProductReview(productId: string, review: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
}