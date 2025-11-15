import { Page } from '@playwright/test';
import { BaseAdapter } from '../adapters/BaseAdapter';

export class BaseSDK {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}