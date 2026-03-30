import { Locator, Page } from '@playwright/test';
import { ERROR_MESSAGES } from '../data/constants';

export class NotFoundPage {
  private readonly _errorCode: Locator;
  private readonly _errorMessage: Locator;

  constructor(page: Page) {
    this._errorCode = page.getByText(ERROR_MESSAGES.notFound.code);
    this._errorMessage = page.getByText(ERROR_MESSAGES.notFound.message);
  }

  get errorCode(): Locator {
    return this._errorCode;
  }

  get errorMessage(): Locator {
    return this._errorMessage;
  }
}
