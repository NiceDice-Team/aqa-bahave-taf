import { ApiAdapter } from './base.adapters';
import { ENDPOINTS } from '../constants/endpoints';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { IProduct, ProductDetails, ProductFilter, ReviewData } from '../interfaces/product.interface';

export class ProductApiAdapter extends ApiAdapter implements IProduct {
  // Navigation (no-op for API)
  async navigateToCatalog(): Promise<void> {}
  async navigateToProductByName(_name: string): Promise<void> {}
  async navigateToFirstProductDetail(): Promise<void> {}
  async navigateToOutOfStockProduct(): Promise<void> {}

  // Catalog interactions (no-op for API)
  async filterByCategory(_category: string): Promise<void> {}
  async sortBy(_option: string): Promise<void> {}

  // Catalog queries (no-op for API)
  async getActiveCategoryName(): Promise<string> {
    return '';
  }
  async isSortedByPriceAscending(): Promise<boolean> {
    return false;
  }
  async isSortedByPriceDescending(): Promise<boolean> {
    return false;
  }

  // Product actions
  async viewProduct(productId: string): Promise<void> {
    await this.sendRequest('GET', ENDPOINTS.PRODUCTS.DETAILS(productId));
  }

  async getProductDetails(productId: string): Promise<ProductDetails> {
    return this.sendRequest<ProductDetails>('GET', API_ENDPOINTS.GET_API_PRODUCTS_ID(productId));
  }

  async getProducts(filter?: ProductFilter): Promise<ProductDetails[]> {
    const resp = await this.sendRequest<{ products: ProductDetails[] }>('GET', ENDPOINTS.PRODUCTS.CATALOG, filter);
    return resp.products ?? [];
  }

  async switchImage(_index: number): Promise<void> {}

  async addReview(productId: string, data: ReviewData): Promise<void> {
    await this.sendRequest('POST', API_ENDPOINTS.POST_API_PRODUCTS_PRODUCTS_PRODUCT_ID_REVIEWS(productId), data);
  }

  async getReviews(productId: string): Promise<ReviewData[]> {
    const resp = await this.sendRequest<{ reviews: ReviewData[] }>(
      'GET',
      API_ENDPOINTS.GET_API_PRODUCTS_PRODUCTS_PRODUCT_ID_REVIEWS(productId)
    );
    return resp.reviews ?? [];
  }

  // ── Product detail page — visibility (stubs) ──────────────────────────────
  async getProductTitle(): Promise<string> {
    return '';
  }
  async isProductTitleVisible(): Promise<boolean> {
    return false;
  }
  async isMainProductImageVisible(): Promise<boolean> {
    return false;
  }
  async isProductPriceVisible(): Promise<boolean> {
    return false;
  }
  async isProductDescriptionVisible(): Promise<boolean> {
    return false;
  }
  async isProductAddToCartButtonVisible(): Promise<boolean> {
    return false;
  }

  // ── Product detail page — image gallery (stubs) ───────────────────────────
  async getMainProductImageSrc(): Promise<string> {
    return '';
  }
  async clickProductThumbnail(_index: number): Promise<void> {}
  async allProductImagesLoaded(): Promise<boolean> {
    return true;
  }

  // ── Product detail page — quantity controls (stubs) ───────────────────────
  async incrementProductQuantity(): Promise<void> {}
  async decrementProductQuantity(): Promise<void> {}
  async getProductQuantity(): Promise<string> {
    return '1';
  }
  async isProductAddToCartDisabled(): Promise<boolean> {
    return false;
  }
  async clickProductAddToCart(): Promise<void> {}

  // ── Product detail page — cart feedback (stubs) ───────────────────────────
  async isCartConfirmationVisible(): Promise<boolean> {
    return false;
  }
  async getCartBadgeCount(): Promise<number> {
    return 0;
  }

  // ── Product detail page — stock (stubs) ───────────────────────────────────
  async isLowStockVisible(): Promise<boolean> {
    return false;
  }

  // ── Product detail page — accordion (stubs) ──────────────────────────────
  async isAccordionTabPresent(_name: string): Promise<boolean> {
    return false;
  }
  async clickAccordionTab(_name: string): Promise<void> {}
  async isAccordionSectionExpanded(_name: string): Promise<boolean> {
    return false;
  }
  async isAccordionSectionCollapsed(_name: string): Promise<boolean> {
    return true;
  }

  // ── Product detail page — reviews (stubs) ─────────────────────────────────
  async isReviewCountVisible(): Promise<boolean> {
    return false;
  }
  async getReviewCount(): Promise<number> {
    return 0;
  }
  async isAverageRatingVisible(): Promise<boolean> {
    return false;
  }
  async reviewsHaveDetails(): Promise<boolean> {
    return false;
  }
  async clickReviewPage(_page: number): Promise<void> {}
  async isWriteReviewButtonVisible(): Promise<boolean> {
    return false;
  }
  async clickWriteReviewButton(): Promise<void> {}
  async isReviewFormVisible(): Promise<boolean> {
    return false;
  }

  // ── Product detail page — newsletter (stubs) ─────────────────────────────
  async isNewsletterEmailEditable(): Promise<boolean> {
    return false;
  }
  async fillNewsletterEmail(_email: string): Promise<void> {}
  async submitNewsletterForm(): Promise<void> {}
  async getNewsletterEmailError(): Promise<string | null> {
    return null;
  }
  async isNewsletterSuccessVisible(): Promise<boolean> {
    return false;
  }
  async isNewsletterSubmitDisabled(): Promise<boolean> {
    return false;
  }

  // ── Product detail page — hover / UX (stubs) ─────────────────────────────
  async hoverProductAddToCart(): Promise<void> {}
  async isAddToCartButtonHovered(): Promise<boolean> {
    return false;
  }

  // ── Product detail page — integration ────────────────────────────────────
  async getProductApiStatus(): Promise<number> {
    const resp = await this.sendRequest<{ status: number }>('GET', API_ENDPOINTS.GET_API_PRODUCTS).catch(() => null);
    return resp ? 200 : 0;
  }
}
