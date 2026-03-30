import { test, expect } from '../../fixtures';

test.describe('Categories - positive', () => {
  test.use({ storageState: 'playwright/.auth/consent.json' });
  test.beforeEach(async ({ pm }) => {
    await pm.goToHome();
  });

  test(
    'should show product categories when hamburger button is clicked',
    { tag: ['@regression', '@smoke', '@ui'] },
    async ({ pm }) => {
      await pm.header.openProductCategories();

      await expect(pm.header.productCategoryItems.first()).toBeVisible();
      await expect(pm.header.productCategoryItems).not.toHaveCount(0);
    },
  );

  test(
    'should open first category and show matching category title',
    { tag: ['@regression', '@smoke', '@ui'] },
    async ({ pm }) => {
      await pm.header.openProductCategories();
      const firstCategoryName = await pm.header.getFirstProductCategoryName();

      await pm.header.clickFirstProductCategory();
      await expect(
        pm.header.getCategoryLinkByName(firstCategoryName),
      ).toBeVisible();
    },
  );
});
