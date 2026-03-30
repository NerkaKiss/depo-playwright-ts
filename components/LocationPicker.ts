import { Page, Locator } from '@playwright/test';
import { STOCK_LOCATION_NAME } from '../data/constants';

export class LocationPicker {
  private readonly page: Page;
  private readonly confirmButton: Locator;
  private readonly storeDropdown: Locator;
  private readonly defaultStoreOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirmButton = page.getByRole('button', { name: 'OK', exact: true });
    this.storeDropdown = page
      .getByRole('button')
      .filter({ hasNotText: /^OK$/ });
    this.defaultStoreOption = page
      .getByText(STOCK_LOCATION_NAME)
      .filter({ visible: true });
  }

  async selectDefaultStore(): Promise<void> {
    await this.storeDropdown.click();
    await this.defaultStoreOption.click();
    await this.confirmButton.click();
  }
}
