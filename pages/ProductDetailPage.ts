import { Page, Locator } from '@playwright/test';
import { VALIDATION_MESSAGES } from '../data/constants';

export class ProductDetailPage {
  private readonly _productName: Locator;
  private readonly _productImage: Locator;
  private readonly _retailPrice: Locator;
  private readonly _wholesalePrice: Locator;
  private readonly _quantityInput: Locator;
  private readonly _addToCartButton: Locator;
  private readonly _addToCartConfirmation: Locator;
  private readonly cartButton: Locator;

  constructor(page: Page) {
    this._productName = page.locator('.text-xl.font-bold.text-gray-800');
    this._productImage = page.locator('[id^="myimage-"]');
    // No semantic HTML available — using stable Tailwind color classes
    this._retailPrice = page.getByRole('article').locator('.bg-yellow-100');
    this._wholesalePrice = page.getByRole('article').locator('.bg-orange-100');
    this._quantityInput = page.getByRole('spinbutton');
    this._addToCartButton = page.getByRole('button', {
      name: 'Į pirkinių krepšelį',
    });
    this._addToCartConfirmation = page.getByText(
      VALIDATION_MESSAGES.PRODUCT_ADDED,
    );
    this.cartButton = page
      .locator('.ms-Dialog-inner')
      .getByRole('button', { name: 'Į pirkinių krepšelį' });
  }

  get productName(): Locator {
    return this._productName;
  }

  get productImage(): Locator {
    return this._productImage.first();
  }

  get retailPrice(): Locator {
    return this._retailPrice;
  }

  get wholesalePrice(): Locator {
    return this._wholesalePrice;
  }

  get quantityInput(): Locator {
    return this._quantityInput;
  }

  get addToCartButton(): Locator {
    return this._addToCartButton;
  }

  async setQuantity(quantity: number): Promise<void> {
    await this._quantityInput.fill(String(quantity));
  }

  async clickAddToCart(): Promise<void> {
    await this._addToCartButton.click();
  }

  get addToCartConfirmation(): Locator {
    return this._addToCartConfirmation;
  }

  async clickOnCartFromConfirmation(): Promise<void> {
    await this.cartButton.click();
  }
}
