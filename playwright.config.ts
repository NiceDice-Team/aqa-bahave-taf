import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { config } from './config/environment';

export default defineConfig({
  testDir: './.features-gen',

  ...(defineBddConfig({
    features: ['features/**/*.feature', '!features/_disabled/**'],
    steps: ['steps/**/*.ts'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any),

  // Global timeout for each test
  timeout: 60000,

  // Expect timeout for assertions — raised to handle slow remote staging server
  expect: {
    timeout: 15000,
  },

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Run tests within each file in parallel across workers
  fullyParallel: true,

  // Parallel execution
  workers: config.parallelWorkers,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: `${config.reportDir}/html`, open: 'never' }],
    ['json', { outputFile: `${config.reportDir}/results.json` }],
    ['list'],
  ],

  use: {
    // Base URL for page.goto() and page.route()
    baseURL: config.frontendBaseUrl,

    // Browser options
    headless: config.headless,

    // Slow down operations by specified milliseconds
    launchOptions: {
      slowMo: config.slowMo,
    },

    // Screenshot on failure
    screenshot: config.screenshotOnFailure ? 'only-on-failure' : 'off',

    // Video on failure
    video: config.videoOnFailure ? 'retain-on-failure' : 'off',

    // Trace on failure
    trace: 'retain-on-failure',

    // Navigation timeout
    navigationTimeout: config.frontendTimeout,

    // Action timeout — raised to handle slow remote staging server
    actionTimeout: 15000,
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to enable other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
