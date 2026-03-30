import { test, expect } from '../../fixtures';
import { clearCart } from '../../utils/cartApi';
import { VALIDATION_MESSAGES } from '../../data/constants';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Checkout - positive', () => {
  test.beforeEach(async ({ page }) => {
    await clearCart(page);
  });

  test(
    'should display payment method section on step 3',
    { tag: ['@smoke'] },
    async ({ pm }) => {
      await pm.goToHome();
      await pm.header.search('varztas');
      await pm.searchPage.clickFirstInStockResult();
      await pm.productDetailPage.clickAddToCart();
      await pm.productDetailPage.clickOnCartFromConfirmation();

      await pm.cartPage.clickCreateOrder();

      // Step 1: delivery method (default: pickup in store selected)
      await pm.checkoutPage.clickContinue();

      // Step 2: order details (pre-filled from user profile)
      await pm.checkoutPage.clickContinue();

      // Step 3: verify payment method heading is visible
      await expect(pm.checkoutPage.paymentMethodHeading).toBeVisible();
    },
  );
});

test.describe('Checkout - negative', () => {
  test.beforeEach(async ({ page }) => {
    await clearCart(page);
  });

  test(
    'should show error with missing required fields on step 2',
    { tag: ['@regression'] },
    async ({ pm }) => {
      await pm.goToHome();
      await pm.header.search('varztas');
      await pm.searchPage.clickFirstInStockResult();
      await pm.productDetailPage.clickAddToCart();
      await pm.productDetailPage.clickOnCartFromConfirmation();

      await pm.cartPage.clickCreateOrder();

      // Step 1: proceed with default delivery method
      await pm.checkoutPage.clickContinue();

      // Step 2: clear required fields and try to proceed
      await pm.checkoutPage.clearName();
      await pm.checkoutPage.clearPhone();
      await pm.checkoutPage.clickContinue();

      await expect(pm.checkoutPage.requiredFieldErrors).toContainText([
        VALIDATION_MESSAGES.REQUIRED,
        VALIDATION_MESSAGES.REQUIRED,
      ]);
    },
  );
});
