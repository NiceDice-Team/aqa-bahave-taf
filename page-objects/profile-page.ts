import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ProfilePage extends BasePage {
  readonly personalInfoForm: Locator;
  readonly orderHistory: Locator;
  readonly savedAddresses: Locator;
  readonly wishlist: Locator;
  readonly editProfileButton: Locator;

  constructor(page: Page) {
    super(page);
    this.personalInfoForm = page.locator('[data-testid="personal-info-form"]');
    this.orderHistory = page.locator('[data-testid="order-history"]');
    this.savedAddresses = page.locator('[data-testid="saved-addresses"]');
    this.wishlist = page.locator('[data-testid="wishlist"]');
    this.editProfileButton = page.getByRole('button', { name: /edit profile/i });
  }

  async updatePersonalInfo(info: { name?: string; email?: string; phone?: string }) {
    await this.editProfileButton.click();
    if (info.name) {
      await this.personalInfoForm.getByLabel('Name').fill(info.name);
    }
    if (info.email) {
      await this.personalInfoForm.getByLabel('Email').fill(info.email);
    }
    if (info.phone) {
      await this.personalInfoForm.getByLabel('Phone').fill(info.phone);
    }
    await this.personalInfoForm.getByRole('button', { name: /save/i }).click();
  }

  async getOrderCount(): Promise<number> {
    return this.orderHistory.locator('[data-testid="order-item"]').count();
  }

  async getWishlistCount(): Promise<number> {
    return this.wishlist.locator('[data-testid="wishlist-item"]').count();
  }
}