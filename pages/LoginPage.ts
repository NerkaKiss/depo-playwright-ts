import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private readonly loginLink: Locator;
  private readonly emailField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly _errorMessage: Locator;

  constructor(page: Page) {
    this.loginLink = page.getByRole('link', { name: 'Prisijungti' });
    this.emailField = page.getByRole('textbox', { name: 'El. paštas' });
    this.passwordField = page.getByRole('textbox', { name: 'Slaptažodis' });
    this.loginButton = page.getByRole('button', { name: 'Prisijungti' });
    this._errorMessage = page.locator('.ms-motion-fadeIn');
  }

  async clickLoginLink(): Promise<void> {
    await this.loginLink.click();
  }

  async setEmail(email: string): Promise<void> {
    await this.emailField.fill(email);
  }

  async setPassword(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.setEmail(email);
    await this.setPassword(password);
    await this.clickLoginButton();
  }

  get errorMessage(): Locator {
    return this._errorMessage;
  }
}
