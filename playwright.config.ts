import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

export default defineConfig({
  testDir: './tests',
  ...defineBddConfig({
    features: ['features/**/*.feature'],
    steps: ['steps/**/*.ts'],
  }),
});