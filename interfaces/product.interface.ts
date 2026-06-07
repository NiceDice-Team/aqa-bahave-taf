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
  // ── Navigation ─────────────────────────────────────────────────────────────
  navigateToCatalog(): Promise<void>;
  viewProduct(productId: string): Promise<void>;
  navigateToProductByName(productName: string): Promise<void>;
  navigateToFirstProductDetail(): Promise<void>;
  navigateToOutOfStockProduct(): Promise<void>;

  // ── Catalog interactions ───────────────────────────────────────────────────
  filterByCategory(category: string): Promise<void>;
  sortBy(sortOption: string): Promise<void>;

  // ── Catalog queries ────────────────────────────────────────────────────────
  getProducts(filter?: ProductFilter): Promise<ProductDetails[]>;
  getActiveCategoryName(): Promise<string>;
  isSortedByPriceAscending(): Promise<boolean>;
  isSortedByPriceDescending(): Promise<boolean>;

  // ── Product detail ────────────────────────────────────────────────────────
  getProductDetails(productId: string): Promise<ProductDetails>;
  switchImage(index: number): Promise<void>;

  // ── Reviews ───────────────────────────────────────────────────────────────
  addReview(productId: string, data: ReviewData): Promise<void>;
  getReviews(productId: string): Promise<ReviewData[]>;

  // ── Product detail page — visibility ─────────────────────────────────────
  getProductTitle(): Promise<string>;
  isProductTitleVisible(): Promise<boolean>;
  isMainProductImageVisible(): Promise<boolean>;
  isProductPriceVisible(): Promise<boolean>;
  isProductDescriptionVisible(): Promise<boolean>;
  isProductAddToCartButtonVisible(): Promise<boolean>;

  // ── Product detail page — image gallery ──────────────────────────────────
  getMainProductImageSrc(): Promise<string>;
  clickProductThumbnail(index: number): Promise<void>;
  allProductImagesLoaded(): Promise<boolean>;

  // ── Product detail page — quantity controls ───────────────────────────────
  incrementProductQuantity(): Promise<void>;
  decrementProductQuantity(): Promise<void>;
  getProductQuantity(): Promise<string>;
  isProductAddToCartDisabled(): Promise<boolean>;
  clickProductAddToCart(): Promise<void>;

  // ── Product detail page — cart feedback ──────────────────────────────────
  isCartConfirmationVisible(): Promise<boolean>;
  getCartBadgeCount(): Promise<number>;

  // ── Product detail page — stock ───────────────────────────────────────────
  isLowStockVisible(): Promise<boolean>;

  // ── Product detail page — accordion ──────────────────────────────────────
  isAccordionTabPresent(name: string): Promise<boolean>;
  clickAccordionTab(name: string): Promise<void>;
  isAccordionSectionExpanded(name: string): Promise<boolean>;
  isAccordionSectionCollapsed(name: string): Promise<boolean>;

  // ── Product detail page — reviews ─────────────────────────────────────────
  isReviewCountVisible(): Promise<boolean>;
  getReviewCount(): Promise<number>;
  isAverageRatingVisible(): Promise<boolean>;
  reviewsHaveDetails(): Promise<boolean>;
  clickReviewPage(page: number): Promise<void>;
  isWriteReviewButtonVisible(): Promise<boolean>;
  clickWriteReviewButton(): Promise<void>;
  isReviewFormVisible(): Promise<boolean>;

  // ── Product detail page — newsletter ─────────────────────────────────────
  isNewsletterEmailEditable(): Promise<boolean>;
  fillNewsletterEmail(email: string): Promise<void>;
  submitNewsletterForm(): Promise<void>;
  getNewsletterEmailError(): Promise<string | null>;
  isNewsletterSuccessVisible(): Promise<boolean>;
  isNewsletterSubmitDisabled(): Promise<boolean>;

  // ── Product detail page — hover / UX ─────────────────────────────────────
  hoverProductAddToCart(): Promise<void>;
  isAddToCartButtonHovered(): Promise<boolean>;

  // ── Product detail page — integration ────────────────────────────────────
  getProductApiStatus(): Promise<number>;
}
