import { ApiAdapter } from './base.adapters';
import { ENDPOINTS } from '../constants/endpoints';
import { 
  IProduct, 
  ProductDetails, 
  ProductFilter, 
  ReviewData 
} from '../interfaces/product.interface';

export class ProductApiAdapter extends ApiAdapter implements IProduct {
  async viewProduct(productId: string): Promise<void> {
    await this.sendRequest('GET', ENDPOINTS.PRODUCTS.DETAILS(productId));
  }

  async getProductDetails(productId: string): Promise<ProductDetails> {
    const response = await this.sendRequest<ProductDetails>('GET', ENDPOINTS.PRODUCTS.DETAILS(productId));
    return response;
  }

  async getProducts(filter?: ProductFilter): Promise<ProductDetails[]> {
    const response = await this.sendRequest<{ products: ProductDetails[] }>('GET', ENDPOINTS.PRODUCTS.CATALOG, filter);
    return response.products;
  }

  async addReview(productId: string, data: ReviewData): Promise<void> {
    await this.sendRequest('POST', `/api/products/${productId}/reviews`, data);
  }

  async getReviews(productId: string): Promise<ReviewData[]> {
    const response = await this.sendRequest<{ reviews: ReviewData[] }>('GET', `/api/products/${productId}/reviews`);
    return response.reviews;
  }

  async switchImage(index: number): Promise<void> {
    // Not implemented in API adapter
  }
}
