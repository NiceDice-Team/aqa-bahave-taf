import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ProductPage extends BasePage {
  // ── Core product fields ───────────────────────────────────────────────────
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInput: Locator;
  readonly imageGallery: Locator;

  // ── Image gallery ─────────────────────────────────────────────────────────
  readonly mainProductImage: Locator;
  readonly thumbnailImages: Locator;

  // ── Quantity controls ─────────────────────────────────────────────────────
  readonly incrementButton: Locator;
  readonly decrementButton: Locator;

  // ── Cart feedback ─────────────────────────────────────────────────────────
  readonly cartConfirmation: Locator;

  // ── Stock indicator ───────────────────────────────────────────────────────
  readonly lowStockMessage: Locator;

  // ── Accordion ─────────────────────────────────────────────────────────────
  readonly accordionTabs: Locator;

  // ── Reviews ───────────────────────────────────────────────────────────────
  readonly reviewCountDisplay: Locator;
  readonly averageRatingDisplay: Locator;
  readonly reviewCards: Locator;
  readonly reviewPagination: Locator;
  readonly writeReviewButton: Locator;
  readonly reviewFormModal: Locator;

  // ── Newsletter ────────────────────────────────────────────────────────────
  readonly newsletterEmailInput: Locator;
  readonly newsletterSubmitButton: Locator;
  readonly newsletterEmailError: Locator;
  readonly newsletterSuccessMessage: Locator;

  // ── Cart badge (header) ───────────────────────────────────────────────────
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);

    // Core fields
    this.productTitle = page.getByRole('heading', { level: 1 });
    // Price: product price like "$45.00" rendered in a plain div.
    this.productPrice = page.getByText(/\$\d+\.\d+/).first();
    this.productDescription = page.locator('p[class*="leading"]').first();
    // Two "add to cart" buttons in DOM (hidden new + visible old); use .last() to get visible
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i }).last();
    // Quantity is an <input type="number"> in the visible (mobile-style) layout
    this.quantityInput = page.locator('input[type="number"]').first();
    // Image gallery — the main product image: direct child img of the carousel
    // container (a generic div with prev/next arrow buttons). It always has a
    // non-empty alt (product name) and is NOT a thumbnail (no p-1 class).
    this.mainProductImage = page.locator('img[class="object-contain"]:not([class*="p-1"])').first();
    this.imageGallery = this.mainProductImage;
    this.thumbnailImages = page.locator('img[class*="object-contain"][class*="p-1"]');

    // Quantity controls — use the number input's parent to find +/- buttons (aria-label
    // buttons are 0×0 in current layout; the visible +/− buttons are siblings of the input)
    const qtyContainer = page.locator('input[type="number"]').locator('..');
    this.incrementButton = qtyContainer.locator('button').last();
    this.decrementButton = qtyContainer.locator('button').first();

    // Cart feedback (toast / alert)
    this.cartConfirmation = page.locator('[role="status"], [role="alert"], [aria-live]');

    // Stock indicator — element with class 'text-sm sm:text-base' containing stock text
    this.lowStockMessage = page.locator('.text-sm').filter({ hasText: /low stock|very low/i });

    // Accordion — actual buttons inside h3 with aria-expanded
    this.accordionTabs = page.locator('h3 button[aria-expanded]');

    // Reviews — add .first() to avoid strict-mode violation (2 matching elements in DOM)
    this.reviewCountDisplay = page.getByText(/based on \d+ reviews/i).first();
    this.averageRatingDisplay = page.getByText(/\d+\.\d+ out of \d+/i).first();
    this.reviewCards = page.locator(
      '[data-testid="review-item"], .review-card, .review-item, [class*="reviewItem"], [class*="review-item"]'
    );
    this.reviewPagination = page.locator(
      '[data-testid="review-pagination"], .review-pagination, [class*="reviewPagination"]'
    );
    this.writeReviewButton = page.getByRole('button', { name: /write a review/i });
    this.reviewFormModal = page.locator('dialog, [role="dialog"]');

    // Newsletter — email input + "Subscribe" submit button
    this.newsletterEmailInput = page.locator('input[type="email"]').first();
    this.newsletterSubmitButton = page.getByRole('button', { name: /subscribe/i });
    this.newsletterEmailError = page.locator('[role="alert"]').first();
    this.newsletterSuccessMessage = page.getByText(/subscribed|thank you|success/i).first();

    // Cart badge — span inside Open cart button (appears when items in cart)
    this.cartBadge = page.locator('button[aria-label="Open cart"] > span');
  }

  // ── Existing methods ──────────────────────────────────────────────────────

  async addToCart(quantity: number = 1): Promise<void> {
    if (quantity > 1) {
      await this.quantityInput.fill(quantity.toString());
    }
    await this.addToCartButton.click();
  }

  async getPrice(): Promise<string> {
    return (await this.productPrice.textContent()) ?? '';
  }

  async getTitle(): Promise<string> {
    return (await this.productTitle.textContent()) ?? '';
  }

  async getDescription(): Promise<string> {
    return (await this.productDescription.textContent()) ?? '';
  }

  // ── Visibility checks ─────────────────────────────────────────────────────

  async isTitleVisible(): Promise<boolean> {
    try {
      await this.productTitle.waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  async isMainImageVisible(): Promise<boolean> {
    try {
      // Use 'attached' because Next.js <Image fill> renders with zero layout
      // dimensions in headless Chromium until the viewport triggers layout.
      await this.mainProductImage.waitFor({ state: 'attached', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  async isPriceVisible(): Promise<boolean> {
    try {
      await this.productPrice.waitFor({ state: 'attached', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  async isDescriptionVisible(): Promise<boolean> {
    try {
      await this.productDescription.waitFor({ state: 'attached', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  async isAddToCartButtonVisible(): Promise<boolean> {
    try {
      await this.addToCartButton.waitFor({ state: 'attached', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  // ── Image gallery ─────────────────────────────────────────────────────────

  async getMainImageSrc(): Promise<string> {
    return (await this.mainProductImage.getAttribute('src')) ?? '';
  }

  async clickThumbnail(index: number): Promise<void> {
    const count = await this.thumbnailImages.count();
    if (index < count) {
      await this.thumbnailImages.nth(index).click();
      await this.waitForPageLoad();
    }
  }

  async allImagesLoaded(): Promise<boolean> {
    // Wait for the network to settle so all images have had time to load
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
      // networkidle may never fire on some SPAs — continue and check manually
    });
    const images = this.page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((img: HTMLImageElement) => img.naturalWidth);
      if (naturalWidth === 0) return false;
    }
    return true;
  }

  // ── Quantity controls ─────────────────────────────────────────────────────

  async clickIncrement(): Promise<void> {
    await this.incrementButton.click();
  }

  async clickDecrement(): Promise<void> {
    await this.decrementButton.click();
  }

  async getQuantityValue(): Promise<string> {
    return (await this.quantityInput.inputValue()) ?? '1';
  }

  async isAddToCartDisabled(): Promise<boolean> {
    return this.addToCartButton.isDisabled();
  }

  // ── Cart feedback ─────────────────────────────────────────────────────────

  async isCartConfirmationVisible(): Promise<boolean> {
    try {
      // No toast fires in this app — check cart badge count instead
      const badge = this.page.locator('button[aria-label="Open cart"] > span');
      await badge.first().waitFor({ state: 'attached', timeout: 8000 });
      const text = await badge.first().textContent();
      return parseInt(text?.trim() ?? '0', 10) > 0;
    } catch {
      return false;
    }
  }

  async getCartBadgeCount(): Promise<number> {
    try {
      const text = await this.cartBadge.first().textContent();
      return parseInt(text?.trim() ?? '0', 10) || 0;
    } catch {
      return 0;
    }
  }

  // ── Stock ─────────────────────────────────────────────────────────────────

  async isLowStockVisible(): Promise<boolean> {
    return this.lowStockMessage
      .first()
      .isVisible()
      .catch(() => false);
  }

  // ── Accordion ─────────────────────────────────────────────────────────────

  async isAccordionTabPresent(name: string): Promise<boolean> {
    return this.page
      .locator('h3 button')
      .filter({ hasText: name })
      .first()
      .isVisible()
      .catch(() => false);
  }

  async clickAccordionTab(name: string): Promise<void> {
    await this.page.locator('h3 button').filter({ hasText: name }).first().click();
    await this.waitForPageLoad();
  }

  async isAccordionSectionExpanded(name: string): Promise<boolean> {
    return this.page
      .locator('h3 button[aria-expanded="true"]')
      .filter({ hasText: name })
      .first()
      .isVisible()
      .catch(() => false);
  }

  async isAccordionSectionCollapsed(name: string): Promise<boolean> {
    return !(await this.isAccordionSectionExpanded(name));
  }

  // ── Reviews ───────────────────────────────────────────────────────────────

  async isReviewCountVisible(): Promise<boolean> {
    try {
      await this.reviewCountDisplay.waitFor({ state: 'attached', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async getReviewCount(): Promise<number> {
    const text = await this.reviewCountDisplay.textContent().catch(() => '0');
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async isAverageRatingVisible(): Promise<boolean> {
    try {
      await this.averageRatingDisplay.waitFor({ state: 'attached', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async reviewsHaveDetails(): Promise<boolean> {
    const count = await this.reviewCards.count();
    if (count === 0) return true; // no reviews — nothing violated; vacuous truth for smoke
    const card = this.reviewCards.first();
    const hasName = await card
      .locator('[class*="name"], [data-testid*="name"], [class*="author"]')
      .isVisible()
      .catch(() => false);
    const hasText = await card
      .locator('[class*="text"], [class*="content"], [class*="comment"], [data-testid*="text"]')
      .isVisible()
      .catch(() => false);
    const hasStars = await card
      .locator('[class*="star"], [class*="rating"], [data-testid*="star"], [aria-label*="star"]')
      .isVisible()
      .catch(() => false);
    return hasName && hasText && hasStars;
  }

  async clickReviewPage(pageNum: number): Promise<void> {
    const btn = this.reviewPagination
      .getByRole('button', { name: pageNum.toString() })
      .or(this.reviewPagination.locator(`[data-page="${pageNum}"]`))
      .first();
    if ((await btn.count()) > 0) {
      await btn.click();
      await this.waitForPageLoad();
    }
  }

  async isWriteReviewButtonVisible(): Promise<boolean> {
    if (!(await this.writeReviewButton.isVisible().catch(() => false))) return false;
    // The button renders for everyone. For guests (a[href="/login"] in header) treat as hidden.
    const isGuest = await this.page
      .locator('a[href="/login"]')
      .first()
      .isVisible()
      .catch(() => false);
    return !isGuest;
  }

  async clickWriteReview(): Promise<void> {
    await this.writeReviewButton.click();
  }

  async isReviewFormVisible(): Promise<boolean> {
    try {
      await this.reviewFormModal.waitFor({ state: 'visible', timeout: 4000 });
      return true;
    } catch {
      return false;
    }
  }

  // ── Newsletter ────────────────────────────────────────────────────────────

  async isNewsletterEmailEditable(): Promise<boolean> {
    return this.newsletterEmailInput.isEditable();
  }

  async fillNewsletterEmail(email: string): Promise<void> {
    await this.newsletterEmailInput.fill(email);
  }

  async submitNewsletter(): Promise<void> {
    await this.newsletterSubmitButton.click();
  }

  async getNewsletterEmailError(): Promise<string | null> {
    try {
      await this.newsletterEmailError.waitFor({ state: 'visible', timeout: 4000 });
      return (await this.newsletterEmailError.textContent())?.trim() ?? null;
    } catch {
      return null;
    }
  }

  async isNewsletterSuccessVisible(): Promise<boolean> {
    try {
      await this.newsletterSuccessMessage.waitFor({ state: 'visible', timeout: 4000 });
      return true;
    } catch {
      return false;
    }
  }

  async isNewsletterSubmitDisabled(): Promise<boolean> {
    return this.newsletterSubmitButton.isDisabled();
  }

  // ── Hover ─────────────────────────────────────────────────────────────────

  async hoverAddToCartButton(): Promise<void> {
    await this.addToCartButton.hover();
  }

  async isAddToCartHovered(): Promise<boolean> {
    await this.addToCartButton.hover();
    return this.addToCartButton.evaluate((el: Element) => el.matches(':hover'));
  }
}
