import { Page, APIRequestContext } from '@playwright/test';
import { BasePage } from '../page-objects/base-page';
import { getFrontendUrl, getApiUrl, config } from '../config/environment';

/**
 * Sanitizes a URL before writing to logs.
 *
 * Rule applied:
 *  1. Log only the URL origin (protocol + host), never path/query/fragment.
 *
 * This prevents CWE-312/CWE-532 (clear-text logging of sensitive data)
 * by ensuring endpoint names and identifiers are never emitted to logs.
 */
function sanitizeUrlForLogging(rawUrl: string): string {
  try {
    const u = new URL(rawUrl);
    return u.origin;
  } catch {
    // If URL parsing fails, avoid logging potentially sensitive raw path data.
    return '[REDACTED_URL]';
  }
}

export abstract class WebAdapter {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected async navigateTo(url: string): Promise<void> {
    await this.page.goto(this.resolveUrl(url));
    await this.page.waitForLoadState('networkidle');
  }

  protected resolveUrl(url: string): string {
    return getFrontendUrl(url);
  }

  protected getPage<T extends BasePage>(PageClass: new (page: Page) => T): T {
    return new PageClass(this.page);
  }
}

export abstract class ApiAdapter {
  protected readonly request: APIRequestContext;
  protected authToken?: string;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  protected resolveApiUrl(endpoint: string): string {
    return getApiUrl(endpoint);
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  protected async sendRequest<T = unknown>(
    method: string,
    endpoint: string,
    data?: unknown,
    extraHeaders?: Record<string, string>
  ): Promise<T> {
    const absoluteUrl = this.resolveApiUrl(endpoint);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    if (config.enableApiLogging) {
      const safeOriginForLog = sanitizeUrlForLogging(absoluteUrl);
      // eslint-disable-next-line no-console
      console.log(`API ${method.toUpperCase()} ${safeOriginForLog}`);
    }

    const response = await this.request.fetch(absoluteUrl, {
      method: method.toUpperCase(),
      headers,
      data: data !== undefined ? JSON.stringify(data) : undefined,
    });

    if (config.enableApiLogging) {
      // eslint-disable-next-line no-console
      console.log(`  → ${response.status()} ${response.statusText()}`);
    }

    if (response.headers()['content-type']?.includes('application/json')) {
      return response.json() as Promise<T>;
    }
    return response as unknown as T;
  }
}

// Re-export so existing imports of BaseAdapter still resolve
export { ApiAdapter as BaseAdapter };
