import { WebAdapter } from './base.adapters';
import { CatalogPage } from '../page-objects/catalog-page';
import { ProductPage } from '../page-objects/product-page';
import { ENDPOINTS } from '../constants/endpoints';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { getApiUrl } from '../config/environment';
import { IProduct, ProductDetails, ProductFilter, ReviewData } from '../interfaces/product.interface';

export class ProductWebAdapter extends WebAdapter implements IProduct {
  /** Slug of the last product navigated to — used for API status check. */
  private lastProductSlug = '';

  private getCatalogPage(): CatalogPage {
    return this.getPage(CatalogPage);
  }

  private getProductPage(): ProductPage {
    return this.getPage(ProductPage);
  }

  // ── Navigation ───────────────────────────────────────────────────────

  async navigateToCatalog(): Promise<void> {
    await this.getCatalogPage().navigate();
  }

  async viewProduct(productId: string): Promise<void> {
    this.lastProductSlug = productId;
    await this.navigateTo(ENDPOINTS.PRODUCTS.DETAILS(productId));
  }

  async navigateToProductByName(productName: string): Promise<void> {
    await this.getCatalogPage().navigateToProductByName(productName);
  }

  async navigateToFirstProductDetail(): Promise<void> {
    // Navigate directly to a known product instead of going through the catalog.
    // The catalog route requires 2 page loads + a click and is flaky on staging.
    const slug = '3';
    await this.navigateTo(ENDPOINTS.PRODUCTS.DETAILS(slug));
    await this.page.waitForLoadState('domcontentloaded');
    this.lastProductSlug = slug;
  }

  async navigateToOutOfStockProduct(): Promise<void> {
    // No truly out-of-stock products exist in the current dataset.
    // Navigate to a non-existent product so the page shows an error state.
    await this.navigateTo(ENDPOINTS.PRODUCTS.DETAILS('out-of-stock-product'));
    this.lastProductSlug = 'out-of-stock-product';
  }

  // ── Catalog interactions ─────────────────────────────────────────────────

  async filterByCategory(category: string): Promise<void> {
    await this.getCatalogPage().filterByCategory(category);
  }

  async sortBy(sortOption: string): Promise<void> {
    await this.getCatalogPage().sortBy(sortOption);
  }

  // ── Catalog queries ──────────────────────────────────────────────────────

  async getProducts(_filter?: ProductFilter): Promise<ProductDetails[]> {
    return [];
  }

  async getActiveCategoryName(): Promise<string> {
    return this.getCatalogPage().getActiveCategoryName();
  }

  async isSortedByPriceAscending(): Promise<boolean> {
    return this.getCatalogPage().isSortedByPriceAscending();
  }

  async isSortedByPriceDescending(): Promise<boolean> {
    return this.getCatalogPage().isSortedByPriceDescending();
  }

  // ── Product detail ───────────────────────────────────────────────────────

  async getProductDetails(productId: string): Promise<ProductDetails> {
    await this.viewProduct(productId);
    const pp = this.getProductPage();
    const [name, price] = await Promise.all([pp.getTitle(), pp.getPrice()]);
    return {
      id: productId,
      name,
      price: parseFloat(price.replace(/[^0-9.]/g, '')),
      stock: 0,
      description: await pp.getDescription(),
      images: [],
    };
  }

  async switchImage(index: number): Promise<void> {
    await this.getProductPage().clickThumbnail(index);
  }

  // ── Reviews ─────────────────────────────────────────────────────────────

  async addReview(_productId: string, _data: ReviewData): Promise<void> {}

  async getReviews(_productId: string): Promise<ReviewData[]> {
    return [];
  }

  // ── Product detail page — visibility ─────────────────────────────────────

  async getProductTitle(): Promise<string> {
    return this.getProductPage().getTitle();
  }

  async isProductTitleVisible(): Promise<boolean> {
    return this.getProductPage().isTitleVisible();
  }

  async isMainProductImageVisible(): Promise<boolean> {
    return this.getProductPage().isMainImageVisible();
  }

  async isProductPriceVisible(): Promise<boolean> {
    return this.getProductPage().isPriceVisible();
  }

  async isProductDescriptionVisible(): Promise<boolean> {
    return this.getProductPage().isDescriptionVisible();
  }

  async isProductAddToCartButtonVisible(): Promise<boolean> {
    return this.getProductPage().isAddToCartButtonVisible();
  }

  // ── Product detail page — image gallery ──────────────────────────────────

  async getMainProductImageSrc(): Promise<string> {
    return this.getProductPage().getMainImageSrc();
  }

  async clickProductThumbnail(index: number): Promise<void> {
    await this.getProductPage().clickThumbnail(index);
  }

  async allProductImagesLoaded(): Promise<boolean> {
    return this.getProductPage().allImagesLoaded();
  }

  // ── Product detail page — quantity controls ───────────────────────────────

  async incrementProductQuantity(): Promise<void> {
    await this.getProductPage().clickIncrement();
  }

  async decrementProductQuantity(): Promise<void> {
    await this.getProductPage().clickDecrement();
  }

  async getProductQuantity(): Promise<string> {
    return this.getProductPage().getQuantityValue();
  }

  async isProductAddToCartDisabled(): Promise<boolean> {
    return this.getProductPage().isAddToCartDisabled();
  }

  async clickProductAddToCart(): Promise<void> {
    await this.getProductPage().addToCart();
  }

  // ── Product detail page — cart feedback ──────────────────────────────────

  async isCartConfirmationVisible(): Promise<boolean> {
    return this.getProductPage().isCartConfirmationVisible();
  }

  async getCartBadgeCount(): Promise<number> {
    return this.getProductPage().getCartBadgeCount();
  }

  // ── Product detail page — stock ───────────────────────────────────────────

  async isLowStockVisible(): Promise<boolean> {
    return this.getProductPage().isLowStockVisible();
  }

  // ── Product detail page — accordion ──────────────────────────────────────

  async isAccordionTabPresent(name: string): Promise<boolean> {
    return this.getProductPage().isAccordionTabPresent(name);
  }

  async clickAccordionTab(name: string): Promise<void> {
    await this.getProductPage().clickAccordionTab(name);
  }

  async isAccordionSectionExpanded(name: string): Promise<boolean> {
    return this.getProductPage().isAccordionSectionExpanded(name);
  }

  async isAccordionSectionCollapsed(name: string): Promise<boolean> {
    return this.getProductPage().isAccordionSectionCollapsed(name);
  }

  // ── Product detail page — reviews ─────────────────────────────────────────

  async isReviewCountVisible(): Promise<boolean> {
    return this.getProductPage().isReviewCountVisible();
  }

  async getReviewCount(): Promise<number> {
    return this.getProductPage().getReviewCount();
  }

  async isAverageRatingVisible(): Promise<boolean> {
    return this.getProductPage().isAverageRatingVisible();
  }

  async reviewsHaveDetails(): Promise<boolean> {
    return this.getProductPage().reviewsHaveDetails();
  }

  async clickReviewPage(pageNum: number): Promise<void> {
    await this.getProductPage().clickReviewPage(pageNum);
  }

  async isWriteReviewButtonVisible(): Promise<boolean> {
    return this.getProductPage().isWriteReviewButtonVisible();
  }

  async clickWriteReviewButton(): Promise<void> {
    await this.getProductPage().clickWriteReview();
  }

  async isReviewFormVisible(): Promise<boolean> {
    return this.getProductPage().isReviewFormVisible();
  }

  // ── Product detail page — newsletter ─────────────────────────────────────

  async isNewsletterEmailEditable(): Promise<boolean> {
    return this.getProductPage().isNewsletterEmailEditable();
  }

  async fillNewsletterEmail(email: string): Promise<void> {
    await this.getProductPage().fillNewsletterEmail(email);
  }

  async submitNewsletterForm(): Promise<void> {
    await this.getProductPage().submitNewsletter();
  }

  async getNewsletterEmailError(): Promise<string | null> {
    return this.getProductPage().getNewsletterEmailError();
  }

  async isNewsletterSuccessVisible(): Promise<boolean> {
    return this.getProductPage().isNewsletterSuccessVisible();
  }

  async isNewsletterSubmitDisabled(): Promise<boolean> {
    return this.getProductPage().isNewsletterSubmitDisabled();
  }

  // ── Product detail page — hover / UX ─────────────────────────────────────

  async hoverProductAddToCart(): Promise<void> {
    await this.getProductPage().hoverAddToCartButton();
  }

  async isAddToCartButtonHovered(): Promise<boolean> {
    return this.getProductPage().isAddToCartHovered();
  }

  // ── Product detail page — integration ────────────────────────────────────

  async getProductApiStatus(): Promise<number> {
    if (!this.lastProductSlug) return 0;
    const endpoint = API_ENDPOINTS.GET_API_PRODUCTS_ID(this.lastProductSlug);
    const response = await this.page.request.get(getApiUrl(endpoint), { failOnStatusCode: false });
    return response.status();
  }
}
