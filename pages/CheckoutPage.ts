import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  private readonly _continueButton: Locator;
  private readonly _paymentMethodHeading: Locator;
  private readonly _nameInput: Locator;
  private readonly _phoneInput: Locator;
  private readonly _requiredFieldErrors: Locator;

  constructor(page: Page) {
    this._continueButton = page.getByRole('button', { name: 'Tęsti' });
    this._paymentMethodHeading = page.getByRole('heading', {
      name: 'Mokėjimo būdas',
    });
    this._nameInput = page.getByRole('textbox', { name: 'Vardas Pavardė' });
    this._phoneInput = page.locator('[name="phoneNumber"]');
    // getByText resolves immediately when text appears in DOM,
    // avoiding the ~10s delay caused by waiting for .ms-motion-fadeIn animation to settle
    this._requiredFieldErrors = page.locator('.ms-motion-fadeIn');
  }

  get paymentMethodHeading(): Locator {
    return this._paymentMethodHeading;
  }

  get requiredFieldErrors(): Locator {
    return this._requiredFieldErrors;
  }

  async clickContinue(): Promise<void> {
    await this._continueButton.click();
  }

  async clearName(): Promise<void> {
    await this._nameInput.clear();
  }

  async clearPhone(): Promise<void> {
    await this._phoneInput.clear();
  }
}
