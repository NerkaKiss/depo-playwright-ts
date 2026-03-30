import { test as base, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';

type Fixtures = {
  pm: PageManager;
};

export const test = base.extend<Fixtures>({
  pm: async ({ page }, use) => {
    const pm = new PageManager(page);
    await use(pm);
    // Global cooldown to avoid site-wide rate limiting during test runs
    await page.waitForTimeout(15000);
  },
});

export { expect };
