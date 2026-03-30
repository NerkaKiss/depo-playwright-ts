import { test, expect } from '../../fixtures';

test.use({ storageState: 'playwright/.auth/consent.json' });

test.describe('Product detail page - positive', () => {
  test(
    'should display product name, price and image',
    { tag: ['@smoke'] },
    async ({ pm }) => {
      await pm.goToHome();
      await pm.header.search('varztas');
      await pm.searchPage.clickFirstResult();

      await expect(pm.productDetailPage.productName).toBeVisible();
      await expect(pm.productDetailPage.productImage).toBeVisible();
      await expect(pm.productDetailPage.retailPrice).toBeVisible();
      // wholesale price is not present for all products
      if (await pm.productDetailPage.wholesalePrice.isVisible()) {
        await expect(pm.productDetailPage.wholesalePrice).toBeVisible();
      }
    },
  );

  test(
    'should update quantity before adding to cart',
    { tag: ['@regression'] },
    async ({ pm }) => {
      await pm.goToHome();
      await pm.header.search('varztas');
      await pm.searchPage.clickFirstResult();

      await pm.productDetailPage.setQuantity(3);

      await expect(pm.productDetailPage.quantityInput).toHaveValue('3');
    },
  );
});
