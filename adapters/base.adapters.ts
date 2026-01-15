import { Page, APIRequestContext } from '@playwright/test';
import { BasePage } from '../page-objects/base-page';
import { PlaywrightFetch } from '../utils/playwright-fetch';
import { th } from '@faker-js/faker/.';

export abstract class BaseAdapter {
    protected page: Page;
    protected request: APIRequestContext;
    protected faker = th;

  constructor(page: Page) {
    this.page = page;
    this.request = page.request;
    this.faker = th;
  }

  async waitForReady() {
    // Default implementation - override in specific adapters
    await this.page.waitForLoadState('networkidle');
  }

  protected getBaseUrl(): string {
    return (
      process.env.TEST_BASE_URL ||
      process.env.APP_BASE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000'
    );
  }

  protected resolveUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const normalizedBase = this.getBaseUrl().replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  }
}

export abstract class WebAdapter extends BaseAdapter {
  protected page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  protected async navigateTo(url: string): Promise<void> {
    await this.page.goto(this.resolveUrl(url));
  }

  resolveUrl(url: string): string {
    throw new Error('Method not implemented.');
  }

  protected getPage<T extends BasePage>(PageClass: new (page: Page) => T): T {
    return new PageClass(this.page);
  }

  protected async isVisible(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    return await element.isVisible();
  }

  protected async clickAndWait(selector: string): Promise<void> {
    await this.page.click(selector);
    await this.waitForReady();
  }
}

export abstract class ApiAdapter extends BaseAdapter {
  private fetch: PlaywrightFetch;

  constructor(page: Page) {
    super(page);
    this.fetch = new PlaywrightFetch(page);
  }

  protected async sendRequest<T>(method: string, url: string, data?: any): Promise<T> {
    const targetUrl = this.resolveUrl(url);
    return this.fetch.request<T>(method, targetUrl, data);
  }
}