import { test, expect } from '@playwright/test';
import { config } from '../config/environment';
import { getUser } from '../utils/fixture-loader';

test.describe('Configuration Test', () => {
  test('should load environment configuration', async () => {
    expect(config.apiBaseUrl).toBe('https://bgshop.work.gd');
    expect(config.frontendBaseUrl).toBe('https://team-challange-front.vercel.app');
    console.log('✅ Configuration loaded successfully');
  });

  test('should load user fixtures', async () => {
    const user = getUser('standard_user');
    expect(user.email).toBe('john.doe@nicedice.test');
    expect(user.firstName).toBe('John');
    console.log('✅ Fixtures loaded successfully');
  });

  test('should navigate to frontend', async ({ page }) => {
    await page.goto(config.frontendBaseUrl);
    await expect(page).toHaveURL(config.frontendBaseUrl);
    console.log('✅ Frontend accessible');
  });
});
