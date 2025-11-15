import { Page } from '@playwright/test';

export class PlaywrightFetch {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async request<T>(method: string, url: string, data?: any): Promise<T> {
    const response = await this.page.request.fetch(url, {
      method,
      data: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok()) {
      throw new Error(`HTTP error! status: ${response.status()}`);
    }

    return response.json() as Promise<T>;
  }
}