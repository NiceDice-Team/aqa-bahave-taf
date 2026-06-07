import { IProduct, ProductFilter, ReviewData } from '../interfaces/product.interface';

export class ProductSDK implements IProduct {
  constructor(private adapter: IProduct) {}

  // Navigation
  navigateToCatalog() {
    return this.adapter.navigateToCatalog();
  }
  viewProduct(id: string) {
    return this.adapter.viewProduct(id);
  }
  navigateToProductByName(name: string) {
    return this.adapter.navigateToProductByName(name);
  }
  navigateToFirstProductDetail() {
    return this.adapter.navigateToFirstProductDetail();
  }
  navigateToOutOfStockProduct() {
    return this.adapter.navigateToOutOfStockProduct();
  }

  // Catalog interactions
  filterByCategory(category: string) {
    return this.adapter.filterByCategory(category);
  }
  sortBy(option: string) {
    return this.adapter.sortBy(option);
  }

  // Catalog queries
  getProducts(filter?: ProductFilter) {
    return this.adapter.getProducts(filter);
  }
  getActiveCategoryName() {
    return this.adapter.getActiveCategoryName();
  }
  isSortedByPriceAscending() {
    return this.adapter.isSortedByPriceAscending();
  }
  isSortedByPriceDescending() {
    return this.adapter.isSortedByPriceDescending();
  }

  // Product detail
  getProductDetails(id: string) {
    return this.adapter.getProductDetails(id);
  }
  switchImage(index: number) {
    return this.adapter.switchImage(index);
  }

  // Reviews
  addReview(id: string, data: ReviewData) {
    return this.adapter.addReview(id, data);
  }
  getReviews(id: string) {
    return this.adapter.getReviews(id);
  }

  // Product detail page — visibility
  getProductTitle() {
    return this.adapter.getProductTitle();
  }
  isProductTitleVisible() {
    return this.adapter.isProductTitleVisible();
  }
  isMainProductImageVisible() {
    return this.adapter.isMainProductImageVisible();
  }
  isProductPriceVisible() {
    return this.adapter.isProductPriceVisible();
  }
  isProductDescriptionVisible() {
    return this.adapter.isProductDescriptionVisible();
  }
  isProductAddToCartButtonVisible() {
    return this.adapter.isProductAddToCartButtonVisible();
  }

  // Product detail page — image gallery
  getMainProductImageSrc() {
    return this.adapter.getMainProductImageSrc();
  }
  clickProductThumbnail(index: number) {
    return this.adapter.clickProductThumbnail(index);
  }
  allProductImagesLoaded() {
    return this.adapter.allProductImagesLoaded();
  }

  // Product detail page — quantity controls
  incrementProductQuantity() {
    return this.adapter.incrementProductQuantity();
  }
  decrementProductQuantity() {
    return this.adapter.decrementProductQuantity();
  }
  getProductQuantity() {
    return this.adapter.getProductQuantity();
  }
  isProductAddToCartDisabled() {
    return this.adapter.isProductAddToCartDisabled();
  }
  clickProductAddToCart() {
    return this.adapter.clickProductAddToCart();
  }

  // Product detail page — cart feedback
  isCartConfirmationVisible() {
    return this.adapter.isCartConfirmationVisible();
  }
  getCartBadgeCount() {
    return this.adapter.getCartBadgeCount();
  }

  // Product detail page — stock
  isLowStockVisible() {
    return this.adapter.isLowStockVisible();
  }

  // Product detail page — accordion
  isAccordionTabPresent(name: string) {
    return this.adapter.isAccordionTabPresent(name);
  }
  clickAccordionTab(name: string) {
    return this.adapter.clickAccordionTab(name);
  }
  isAccordionSectionExpanded(name: string) {
    return this.adapter.isAccordionSectionExpanded(name);
  }
  isAccordionSectionCollapsed(name: string) {
    return this.adapter.isAccordionSectionCollapsed(name);
  }

  // Product detail page — reviews
  isReviewCountVisible() {
    return this.adapter.isReviewCountVisible();
  }
  getReviewCount() {
    return this.adapter.getReviewCount();
  }
  isAverageRatingVisible() {
    return this.adapter.isAverageRatingVisible();
  }
  reviewsHaveDetails() {
    return this.adapter.reviewsHaveDetails();
  }
  clickReviewPage(page: number) {
    return this.adapter.clickReviewPage(page);
  }
  isWriteReviewButtonVisible() {
    return this.adapter.isWriteReviewButtonVisible();
  }
  clickWriteReviewButton() {
    return this.adapter.clickWriteReviewButton();
  }
  isReviewFormVisible() {
    return this.adapter.isReviewFormVisible();
  }

  // Product detail page — newsletter
  isNewsletterEmailEditable() {
    return this.adapter.isNewsletterEmailEditable();
  }
  fillNewsletterEmail(email: string) {
    return this.adapter.fillNewsletterEmail(email);
  }
  submitNewsletterForm() {
    return this.adapter.submitNewsletterForm();
  }
  getNewsletterEmailError() {
    return this.adapter.getNewsletterEmailError();
  }
  isNewsletterSuccessVisible() {
    return this.adapter.isNewsletterSuccessVisible();
  }
  isNewsletterSubmitDisabled() {
    return this.adapter.isNewsletterSubmitDisabled();
  }

  // Product detail page — hover / UX
  hoverProductAddToCart() {
    return this.adapter.hoverProductAddToCart();
  }
  isAddToCartButtonHovered() {
    return this.adapter.isAddToCartButtonHovered();
  }

  // Product detail page — integration
  getProductApiStatus() {
    return this.adapter.getProductApiStatus();
  }
}
