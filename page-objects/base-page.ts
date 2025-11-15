import { Page } from '@playwright/test';
import { Header } from './components/header';

export class BasePage {
  readonly page: Page;
  readonly header: Header;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
  }

  async goto(path: string = '') {
    // Add retry logic for dev server warmup
    let retries = 3;
    while (retries > 0) {
      try {
        await this.page.goto(path);
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retry
      }
    }
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}