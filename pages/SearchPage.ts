import { Page, Locator } from '@playwright/test';
import { SEARCH_MESSAGES } from '../data/constants';

export class SearchPage {
  private readonly _resultsHeader: Locator;
  private readonly _noResultsMessage: Locator;
  private readonly _firstResultLink: Locator;
  private readonly _firstInStockResult: Locator;

  constructor(private readonly page: Page) {
    this._resultsHeader = page.getByText(SEARCH_MESSAGES.HEADER_MESSAGE, {
      exact: false,
    });
    this._noResultsMessage = page.getByText(SEARCH_MESSAGES.NO_RESULTS, {
      exact: false,
    });
    this._firstResultLink = page
      .locator('[href^="/product/"] .clickable')
      .first();
    this._firstInStockResult = page
      .locator('.bg-white.group')
      .filter({ has: page.locator('.bg-secondary-light') })
      .first()
      .locator('a[href^="/product/"] .clickable');
  }

  get resultsHeader(): Locator {
    return this._resultsHeader;
  }

  get noResultsMessage(): Locator {
    return this._noResultsMessage;
  }

  async clickFirstResult(): Promise<void> {
    await this._firstResultLink.click();
  }

  async clickFirstInStockResult(): Promise<void> {
    await this._firstInStockResult.click();
  }
}
