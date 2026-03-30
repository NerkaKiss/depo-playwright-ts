import { test, expect } from '../../fixtures';

test.use({ storageState: 'playwright/.auth/consent.json' });

test.describe('Search - positive', () => {
  test(
    'should return results for valid keyword',
    { tag: ['@smoke'] },
    async ({ page, pm }) => {
      await pm.goToHome();
      await pm.header.search('varztas');

      await expect(page).toHaveURL(/\/search\/varztas/);
      await expect(pm.searchPage.resultsHeader).toBeVisible();
    },
  );
});

test.describe('Search - negative', () => {
  test(
    'should handle special characters in search',
    { tag: ['@regression'] },
    async ({ page, pm }) => {
      await pm.goToHome();
      await pm.header.search('!!!###@@@');

      await expect(page).toHaveURL(/\/search\/!!!%23%23%23/);
      await expect(pm.searchPage.noResultsMessage).toBeVisible();
    },
  );

  test(
    'should show empty state for no results',
    { tag: ['@regression'] },
    async ({ page, pm }) => {
      await pm.goToHome();
      await pm.header.search('xyzxyzxyzNoSuchProduct999');

      await expect(page).toHaveURL(/\/search\/xyzxyzxyz/);
      await expect(pm.searchPage.noResultsMessage).toBeVisible();
    },
  );
});
