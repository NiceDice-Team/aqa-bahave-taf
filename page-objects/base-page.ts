import { Page, Locator } from '@playwright/test';
import { Header } from './components/header';

export class BasePage {
  readonly page: Page;
  readonly header: Header;

  /** Broad selector that matches error/alert messages across the app */
  protected readonly genericErrorSelector =
    '[role="alert"], [data-testid="error-message"], .error-message, .alert-danger, .invalid-feedback, .error';

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
  }

  async goto(path: string = '') {
    let retries = 3;
    while (retries > 0) {
      try {
        await this.page.goto(path);
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Resolves a field locator by name, supporting aliases and known pre-built locators.
   */
  protected resolveFieldLocator(
    fieldName: string,
    opts: {
      aliases?: Record<string, string[]>;
      knownFields?: Record<string, Locator>;
    }
  ): Locator {
    const key = fieldName.toLowerCase().replace(/\s+/g, '');
    if (opts.knownFields?.[key]) return opts.knownFields[key];
    const aliasKeys = opts.aliases?.[key];
    if (aliasKeys?.length) {
      return this.page.locator(aliasKeys.map((k) => `input[name="${k}"]`).join(', ')).first();
    }
    return this.page.locator(`input[name="${fieldName}"], #${fieldName}`).first();
  }

  /** Trims and filters empty strings from an array of text contents */
  protected toCleanTexts(texts: string[]): string[] {
    return texts.map((t) => t.trim()).filter(Boolean);
  }

  // ── Generic UI actions (used by steps via world.ui) ──────────────────────

  /** Click any button by its visible text (case-insensitive). */
  async clickButton(text: string): Promise<void> {
    await this.page.getByRole('button', { name: new RegExp(text, 'i') }).click();
  }

  /** Fill the first visible email input on the page. */
  async fillEmailField(email: string): Promise<void> {
    await this.page.locator('input[type="email"], input[name="email"], input[id*="email"]').first().fill(email);
  }

  /** Fill the first visible password input on the page. */
  async fillPasswordField(password: string): Promise<void> {
    await this.page
      .locator('input[type="password"], input[name="password"], input[id*="password"]')
      .first()
      .fill(password);
  }

  /** Fill the first-name input. */
  async fillFirstNameField(name: string): Promise<void> {
    await this.page
      .locator('input[name="first_name"], input[name="firstName"], input[id*="first_name"], input[id*="firstName"]')
      .first()
      .fill(name);
  }

  /** Fill the last-name input. */
  async fillLastNameField(name: string): Promise<void> {
    await this.page
      .locator('input[name="last_name"], input[name="lastName"], input[id*="last_name"], input[id*="lastName"]')
      .first()
      .fill(name);
  }

  /**
   * Return the first visible error message on the page, or null if none
   * is found within the default timeout.
   */
  async getErrorMessage(): Promise<string | null> {
    const loc = this.page.locator(this.genericErrorSelector);
    try {
      await loc.first().waitFor({ state: 'visible', timeout: 4000 });
      return (await loc.first().textContent())?.trim() ?? null;
    } catch {
      return null;
    }
  }

  /** Return all visible error messages on the page. */
  async getErrorMessages(): Promise<string[]> {
    const loc = this.page.locator(this.genericErrorSelector);
    try {
      await loc.first().waitFor({ state: 'visible', timeout: 4000 });
    } catch {
      return [];
    }
    return this.toCleanTexts(await loc.allTextContents());
  }

  /**
   * Returns true if a specific error message is visible (case-insensitive substring match).
   */
  async showsError(message: string): Promise<boolean> {
    const errors = await this.getErrorMessages();
    const needle = message.toLowerCase();
    return errors.some((e) => e.toLowerCase().includes(needle));
  }

  /**
   * Set the browser viewport to a named preset: 'mobile', 'tablet', or 'desktop'.
   */
  async setViewport(preset: 'mobile' | 'tablet' | 'desktop' | string): Promise<void> {
    const sizes: Record<string, { width: number; height: number }> = {
      mobile: { width: 375, height: 812 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1280, height: 800 },
    };
    const size = sizes[preset] ?? sizes.desktop;
    await this.page.setViewportSize(size);
  }
}
