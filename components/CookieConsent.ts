import { Page, Locator } from '@playwright/test';

export class CookieConsent {
  private readonly acceptAllButton: Locator;

  constructor(page: Page) {
    this.acceptAllButton = page
      .locator('button')
      .filter({ hasText: 'Patvirtinti visus' });
  }

  async acceptAll(): Promise<void> {
    await this.acceptAllButton.click();
  }
}
