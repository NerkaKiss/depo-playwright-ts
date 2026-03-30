import { Page, Locator } from '@playwright/test';
import { VALIDATION_MESSAGES } from '../data/constants';

export class CartPage {
  private readonly _stockWarning: Locator;
  private readonly _createOrderButton: Locator;
  private readonly _emptyCartMessage: Locator;
  private readonly _quantityInput: Locator;
  private readonly _itemLineTotal: Locator;
  private readonly _removeButton: Locator;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;

    // bg-primary-15 is the unique class for the out-of-stock warning banner
    this._stockWarning = page.locator('.bg-primary-15').first();
    this._createOrderButton = page.getByRole('button', {
      name: 'Sukurti užsakymą',
    });
    // nested article only rendered when cart is empty
    this._emptyCartMessage = page.getByText(VALIDATION_MESSAGES.CART_EMPTY);
    this._quantityInput = page.getByRole('spinbutton').first();
    // bold price shown next to "Iš viso:" label — item line total
    this._itemLineTotal = page
      .locator('.text-lg.font-bold')
      .filter({ hasText: /€/ });
    // desktop remove button (.first() picks desktop version over xl:hidden mobile duplicate)
    this._removeButton = page.locator(
      '.clickable:has(svg[viewBox="0 0 16 20"]):visible',
    );
  }

  get stockWarning(): Locator {
    return this._stockWarning;
  }

  get createOrderButton(): Locator {
    return this._createOrderButton;
  }

  get emptyCartMessage(): Locator {
    return this._emptyCartMessage;
  }

  get quantityInput(): Locator {
    return this._quantityInput;
  }

  get itemLineTotal(): Locator {
    return this._itemLineTotal;
  }

  get removeButton(): Locator {
    return this._removeButton;
  }

  async clickRemove(): Promise<void> {
    await this._removeButton.click();
  }

  async setQuantity(quantity: number): Promise<void> {
    await this._quantityInput.fill(String(quantity));
    await this.page.keyboard.press('Enter');
  }

  async clickCreateOrder(): Promise<void> {
    await this._createOrderButton.click();
  }
}
