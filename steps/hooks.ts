import { chromium, Browser, Page } from '@playwright/test';
import { Before, After, setWorldConstructor, World } from '@cucumber/cucumber';

// Extend World to include Playwright types
export class CustomWorld extends World {
  private browser: Browser | undefined;
  private _page: Page | undefined;

  get page(): Page {
    if (!this._page) {
      throw new Error('Page not initialized. Call initBrowser() first');
    }
    return this._page;
  }

  async initBrowser() {
    this.browser = await chromium.launch();
    this._page = await this.browser.newPage();
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = undefined;
      this._page = undefined;
    }
  }
}

setWorldConstructor(CustomWorld);

// Hooks
Before(async function(this: CustomWorld) {
  await this.initBrowser();
});

After(async function(this: CustomWorld) {
  await this.closeBrowser();
});