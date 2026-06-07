import { When, Then, Before } from './bdd';
import { expect } from '@playwright/test';
import { contractMonitor } from '../helpers/contract-monitor';

// ── Optional runtime contract validation ──────────────────────────────────────
// Set VALIDATE_CONTRACT=true in .env or CI environment to enable.
// Logs warnings on drift but never fails tests — it's informational only.
Before({ tags: '@contract-check' }, async () => {
  if (process.env.VALIDATE_CONTRACT !== 'true') return;
  try {
    const diff = await contractMonitor.compareSchemas();
    if (!diff.matches) {
      // eslint-disable-next-line no-console
      console.warn(
        `\n⚠️  API CONTRACT DRIFT DETECTED (${diff.checkedAt})\n` +
          `   Added in live (not yet generated): ${diff.added.length} endpoint(s)\n` +
          (diff.added.length ? `   ${diff.added.slice(0, 5).join(', ')}\n` : '') +
          `   Removed from live (stale in generated): ${diff.removed.length} endpoint(s)\n` +
          (diff.removed.length ? `   ${diff.removed.slice(0, 5).join(', ')}\n` : '') +
          `   Run: npm run generate:endpoints to sync\n`
      );
    }
  } catch (err) {
    // Don't block tests if monitor is unavailable (e.g., offline, no API access)
    // eslint-disable-next-line no-console
    console.warn(`⚠️  Contract monitor unavailable: ${String(err)}`);
  }
});

When('the user clicked the {string} button', async ({ world }, buttonText: string) => {
  await world.sdk.auth.clickButton(buttonText);
});

When('the user entered Email {string}', async ({ world }, email: string) => {
  await world.sdk.auth.enterEmail(email);
});

When('the user entered Password {string}', async ({ world }, password: string) => {
  await world.sdk.auth.enterPassword(password);
});

When('the user entered First Name {string}', async ({ world }, firstName: string) => {
  await world.sdk.auth.enterFirstName(firstName);
});

When('the user entered Last Name {string}', async ({ world }, lastName: string) => {
  await world.sdk.auth.enterLastName(lastName);
});

Then('the system shows an error {string}', async ({ world }, errorMessage: string) => {
  const msg = await world.sdk.auth.getErrorMessage();
  const shown = msg !== null && msg.toLowerCase().includes(errorMessage.toLowerCase());
  expect(shown).toBe(true);
});
