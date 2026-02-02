import { Page, APIRequestContext } from '@playwright/test';
import { BasePage } from '../page-objects/base-page';
import { Faker } from '@faker-js/faker';

export abstract class WebAdapter {
  protected readonly page: Page;
  protected readonly faker: Faker;

  constructor(page: Page, faker: Faker) {
    this.page = page;
    this.faker = faker;
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
    await this.page.waitForLoadState('networkidle');
  }
}

export abstract class ApiAdapter {
  protected readonly request: APIRequestContext;
  protected readonly faker: Faker;

  constructor(request: APIRequestContext, faker: Faker) {
    this.request = request;
    this.faker = faker;
  }

  protected async sendRequest(method: string, url: string, headers?: Record<string, string>, data?: any): Promise<any> {
    const response = await this.request.fetch(url, {
      method,
      headers: headers || { 'Content-Type': 'application/json' },
      data: data ? JSON.stringify(data) : undefined,
    });
    if (response.headers()['content-type']?.includes('application/json')) {
      return await response.json();
    }
    return response;
  }
}