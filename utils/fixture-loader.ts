import * as fs from 'fs';
import * as path from 'path';

export interface UserFixture {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  isActive: boolean;
  role: string;
  isPremium?: boolean;
}

export interface ProductFixture {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  description: string;
  imageUrl: string;
}

export interface PromoCodeFixture {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxUses: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

class FixtureLoader {
  private fixturesPath: string;
  private cache: Map<string, any> = new Map();

  constructor() {
    this.fixturesPath = path.resolve(__dirname, '../fixtures');
  }

  /**
   * Load a fixture file and cache it
   */
  private loadFixture<T>(filename: string): Record<string, T> {
    if (this.cache.has(filename)) {
      return this.cache.get(filename);
    }

    const filePath = path.join(this.fixturesPath, filename);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Fixture file not found: ${filePath}`);
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    this.cache.set(filename, data);
    return data;
  }

  /**
   * Get a specific user fixture by key
   */
  getUser(key: string): UserFixture {
    const users = this.loadFixture<UserFixture>('users.json');
    if (!users[key]) {
      throw new Error(`User fixture not found: ${key}`);
    }
    return users[key];
  }

  /**
   * Get all user fixtures
   */
  getAllUsers(): Record<string, UserFixture> {
    return this.loadFixture<UserFixture>('users.json');
  }

  /**
   * Get a specific product fixture by key
   */
  getProduct(key: string): ProductFixture {
    const products = this.loadFixture<ProductFixture>('products.json');
    if (!products[key]) {
      throw new Error(`Product fixture not found: ${key}`);
    }
    return products[key];
  }

  /**
   * Get all product fixtures
   */
  getAllProducts(): Record<string, ProductFixture> {
    return this.loadFixture<ProductFixture>('products.json');
  }

  /**
   * Get a specific promo code fixture by key
   */
  getPromoCode(key: string): PromoCodeFixture {
    const promoCodes = this.loadFixture<PromoCodeFixture>('promo-codes.json');
    if (!promoCodes[key]) {
      throw new Error(`Promo code fixture not found: ${key}`);
    }
    return promoCodes[key];
  }

  /**
   * Get all promo code fixtures
   */
  getAllPromoCodes(): Record<string, PromoCodeFixture> {
    return this.loadFixture<PromoCodeFixture>('promo-codes.json');
  }

  /**
   * Clear the fixture cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const fixtureLoader = new FixtureLoader();

// Export convenience functions
export const getUser = (key: string) => fixtureLoader.getUser(key);
export const getProduct = (key: string) => fixtureLoader.getProduct(key);
export const getPromoCode = (key: string) => fixtureLoader.getPromoCode(key);
