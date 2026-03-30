import { test as setup, expect } from '@playwright/test';
import { PageManager } from '../../pages/PageManager';
import { validUser } from '../../data/users';

const consentFile = 'playwright/.auth/consent.json';
const authFile = 'playwright/.auth/user.json';

setup('save cookie consent and store state', async ({ page }) => {
  const pm = new PageManager(page);
  await page.goto('/');
  await pm.cookieConsent.acceptAll();
  await pm.locationPicker.selectDefaultStore();
  await page.context().storageState({ path: consentFile });

  await pm.header.clickSignIn();
  await pm.loginPage.login(validUser.email, validUser.password);
  await pm.header.userMenuButton.waitFor({ state: 'visible' });

  await pm.header.openUserMenu();
  await expect(pm.header.accountButton).toBeVisible();

  await page.context().storageState({ path: authFile });
});
