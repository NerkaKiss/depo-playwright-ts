import { test, expect } from '../../fixtures';

test.describe('Not Found - negative', () => {
  test.use({ storageState: 'playwright/.auth/consent.json' });

  test(
    'should show 404 error message when URL is invalid',
    { tag: ['@regression', '@ui'] },
    async ({ pm }) => {
      await pm.goTo('/noneexistent-page');

      await expect(pm.notFoundPage.errorCode).toBeVisible();
      await expect(pm.notFoundPage.errorMessage).toBeVisible();
    },
  );
});
