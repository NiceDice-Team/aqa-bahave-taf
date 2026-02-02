import { Page, APIRequestContext } from '@playwright/test';
import { BasePage } from '../page-objects/base-page';
import { Faker } from '@faker-js/faker';
import { getFrontendUrl, getApiUrl, config } from '../config/environment';

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

  /**
   * Resolves a relative URL to an absolute frontend URL
   * @param url - Relative URL path (e.g., '/login', '/catalog')
   * @returns Absolute URL with frontend base
   */
  protected resolveUrl(url: string): string {
    return getFrontendUrl(url);
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

  /**
   * Resolves a relative API endpoint to an absolute API URL
   * @param endpoint - Relative API endpoint (e.g., '/api/auth/login', '/api/products')
   * @returns Absolute URL with API base
   */
  protected resolveApiUrl(endpoint: string): string {
    return getApiUrl(endpoint);
  }

  protected async sendRequest(
    method: string, 
    endpoint: string, 
    headers?: Record<string, string>, 
    data?: any
  ): Promise<any> {
    const absoluteUrl = this.resolveApiUrl(endpoint);
    
    if (config.enableApiLogging) {
      console.log(`🌐 API Request: ${method} ${absoluteUrl}`);
      if (data) console.log(`   Payload:`, data);
    }

    const response = await this.request.fetch(absoluteUrl, {
      method,
      headers: headers || { 'Content-Type': 'application/json' },
      data: data ? JSON.stringify(data) : undefined,
    });

    if (config.enableApiLogging) {
      console.log(`✅ API Response: ${response.status()} ${response.statusText()}`);
    }

    if (response.headers()['content-type']?.includes('application/json')) {
      return await response.json();
    }
    return response;
  }
}