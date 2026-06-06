import { Page, APIRequestContext } from '@playwright/test';
import { BasePage } from '../page-objects/base-page';
import { getFrontendUrl, getApiUrl, config } from '../config/environment';

/**
 * Redacts sensitive segments from a URL before writing to logs.
 *
 * Rules applied in order:
 *  1. Query string is dropped entirely (may contain tokens/passwords).
 *  2. Path segments that look like tokens (UUID v4, long alphanumeric strings
 *     ≥ 20 chars, or base64url blobs) are replaced with [REDACTED].
 *
 * This prevents CWE-312/CWE-532 (clear-text logging of sensitive data).
 */
function sanitizeUrlForLogging(rawUrl: string): string {
  let sanitized: string;
  try {
    const u = new URL(rawUrl);
    // Drop query string and fragment – they can contain tokens/emails
    const pathOnly = u.pathname;
    // Redact individual path segments that look like tokens or UUIDs
    const cleanPath = pathOnly
      .split('/')
      .map((segment) => {
        // UUID v4 pattern
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(segment)) {
          return '[REDACTED]';
        }
        // Long opaque token (≥20 chars, purely alphanumeric/base64url)
        if (segment.length >= 20 && /^[A-Za-z0-9_\-]+$/.test(segment)) {
          return '[REDACTED]';
        }
        return segment;
      })
      .join('/');
    sanitized = `${u.protocol}//${u.host}${cleanPath}`;
  } catch {
    // If URL parsing fails fall back to stripping everything after '?'
    sanitized = rawUrl.split('?')[0];
  }
  return sanitized;
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
      // eslint-disable-next-line no-console
      console.log(`API ${method.toUpperCase()} [REDACTED_ENDPOINT]`);
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
