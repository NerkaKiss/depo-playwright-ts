import { test, expect } from '../../fixtures';
import { clearCart } from '../../utils/cartApi';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Cart - positive', () => {
  test.beforeEach(async ({ page }) => {
    await clearCart(page);
  });

  test(
    'should show empty cart message',
    { tag: ['@smoke', '@regression'] },
    async ({ pm }) => {
      await pm.goToHome();
      await pm.header.clickOnCart();

      await expect(pm.cartPage.emptyCartMessage).toBeVisible();
    },
  );

  test('should add product to cart', { tag: ['@smoke'] }, async ({ pm }) => {
    await pm.goToHome();
    await pm.header.search('varztas');
    await pm.searchPage.clickFirstInStockResult();
    await pm.productDetailPage.clickAddToCart();

    await expect(pm.productDetailPage.addToCartConfirmation).toBeVisible();
  });

  test(
    'should update product quantity in cart via input',
    { tag: ['@regression'] },
    async ({ pm }) => {
      await pm.goToHome();
      await pm.header.search('varztas');
      await pm.searchPage.clickFirstInStockResult();
      await pm.productDetailPage.clickAddToCart();
      await pm.productDetailPage.clickOnCartFromConfirmation();

      await pm.cartPage.setQuantity(2);

      await expect(pm.cartPage.quantityInput).toHaveValue('2');
    },
  );

  test(
    'should remove product from cart',
    { tag: ['@smoke', '@regression'] },
    async ({ pm }) => {
      await pm.goToHome();
      await pm.header.search('varztas');
      await pm.searchPage.clickFirstInStockResult();
      await pm.productDetailPage.clickAddToCart();
      await pm.productDetailPage.clickOnCartFromConfirmation();

      await pm.cartPage.clickRemove();

      await expect(pm.cartPage.emptyCartMessage).toBeVisible();
    },
  );

  test(
    'should update total price when quantity is changed',
    { tag: ['@regression'] },
    async ({ pm }) => {
      await pm.goToHome();
      await pm.header.search('varztas');
      await pm.searchPage.clickFirstInStockResult();
      await pm.productDetailPage.clickAddToCart();
      await pm.productDetailPage.clickOnCartFromConfirmation();

      const initialTotal = await pm.cartPage.itemLineTotal.textContent();

      await pm.cartPage.setQuantity(3);

      await expect(pm.cartPage.itemLineTotal).not.toHaveText(initialTotal!);
    },
  );
});

test.describe('Cart - negative', () => {
  test.beforeEach(async ({ page }) => {
    await clearCart(page);
  });

  test(
    'should show warning when quantity exceeds stock',
    { tag: ['@regression'] },
    async ({ pm }) => {
      await pm.goToHome();
      await pm.header.search('varztas');
      await pm.searchPage.clickFirstResult();

      await pm.productDetailPage.setQuantity(9999);
      await pm.productDetailPage.clickAddToCart();
      await pm.productDetailPage.clickOnCartFromConfirmation();

      await expect(pm.cartPage.stockWarning).toBeVisible();
      await expect(pm.cartPage.createOrderButton).toBeDisabled();
    },
  );
});
