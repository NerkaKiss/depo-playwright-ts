import { test, expect } from '../../fixtures';
import { validUser } from '../../data/users';
import invalidLogins from '../../data/invalid-logins.json';
import { InvalidLoginScenario } from '../../types/login';
import { VALIDATION_MESSAGES } from '../../data/constants';

test.describe('Login - positive', () => {
  test.beforeEach(async ({ pm }) => {
    await pm.goToHome();
    await pm.cookieConsent.acceptAll();
    await pm.locationPicker.selectDefaultStore();
    await pm.loginPage.clickLoginLink();
  });

  test(
    'should login successfully with valid credentials',
    { tag: ['@smoke', '@regression'] },
    async ({ pm }) => {
      await pm.loginPage.login(validUser.email, validUser.password);
      await pm.header.openUserMenu();

      await expect(pm.header.logoutButton).toBeVisible();
      await expect(pm.header.accountButton).toBeVisible();
    },
  );
});

test.describe('Login - negative', () => {
  test.use({ storageState: 'playwright/.auth/consent.json' });
  test.beforeEach(async ({ pm }) => {
    await pm.goToHome();
    await pm.header.clickSignIn();
  });

  test(
    'should show required errors for all fields when form is empty',
    { tag: ['@regression'] },
    async ({ pm }) => {
      await pm.loginPage.clickLoginButton();

      await expect(pm.loginPage.errorMessage).toHaveText([
        VALIDATION_MESSAGES.REQUIRED,
        VALIDATION_MESSAGES.REQUIRED,
      ]);
    },
  );

  for (const {
    scenario,
    email,
    password,
    expectedError,
  } of invalidLogins as InvalidLoginScenario[]) {
    test.skip(
      `should show error when ${scenario}`,
      { tag: ['@regression'] },
      async ({ pm }) => {
        // Skipped: live site enforces login attempt limits — run against local/staging only
        await pm.loginPage.login(email, password);

        await expect(pm.loginPage.errorMessage).toHaveText(expectedError);
      },
    );
  }

  test(
    'should handle very long email input safely',
    { tag: ['@regression'] },
    async ({ pm }) => {
      await pm.loginPage.login(
        'a'.repeat(1000) + '@test.com',
        'SomePassword1!',
      );

      await expect(pm.loginPage.errorMessage).toHaveText(
        VALIDATION_MESSAGES.USER_NOT_FOUND,
      );
    },
  );
});
