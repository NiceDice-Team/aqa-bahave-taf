export interface ProductDetails {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'popularity';
  page?: number;
  perPage?: number;
}

export interface ReviewData {
  rating: number;
  comment: string;
}

export interface IProduct {
  viewProduct(productId: string): Promise<void>;
  getProductDetails(productId: string): Promise<ProductDetails>;
  getProducts(filter?: ProductFilter): Promise<ProductDetails[]>;
  addReview(productId: string, data: ReviewData): Promise<void>;
  getReviews(productId: string): Promise<ReviewData[]>;
  switchImage(index: number): Promise<void>;
}