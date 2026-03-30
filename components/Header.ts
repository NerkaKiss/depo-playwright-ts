import { Page, Locator } from '@playwright/test';

export class Header {
  private readonly page: Page;
  private readonly _logoutButton: Locator;
  private readonly _accountButton: Locator;
  private readonly _productCategoryItems: Locator;
  private readonly productCategoriesButton: Locator;
  private readonly _userMenuButton: Locator;
  private readonly _searchInput: Locator;
  private readonly _cartLink: Locator;
  private readonly signInLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this._logoutButton = page.getByRole('button', { name: 'Atsijungti' });
    this._accountButton = page.getByRole('button', { name: 'Paskyra' });
    this._cartLink = page.getByRole('link', { name: /Pirkinių krepšelis/ });
    this.signInLink = page.locator("a[href='/sign-in']");
    this.productCategoriesButton = page.getByRole('button', {
      name: 'Prekių kategorijos',
    });
    this._productCategoryItems = page.getByRole('menuitem');
    this._userMenuButton = page
      .locator('.ellipsis')
      .filter({ visible: true })
      .filter({
        hasNot: page.locator('div', { hasText: 'Prekių kategorijos' }),
      });
    this._searchInput = page.getByRole('searchbox', {
      name: 'Ieškoti pagal pavadinimą arba',
    });
  }

  async openProductCategories(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.productCategoriesButton.click();
  }

  async getFirstProductCategoryName(): Promise<string> {
    return (await this._productCategoryItems.first().innerText()).trim();
  }

  async clickFirstProductCategory(): Promise<void> {
    await this._productCategoryItems.first().waitFor({ state: 'visible' });
    await this._productCategoryItems.first().dispatchEvent('click');
  }

  getCategoryLinkByName(categoryName: string): Locator {
    return this.page.getByRole('link', { name: categoryName }).first();
  }

  async openUserMenu(): Promise<void> {
    await this._userMenuButton.click();
  }

  async search(keyword: string): Promise<void> {
    await this._searchInput.fill(keyword);
    await this._searchInput.press('Enter');
  }

  async clickOnCart(): Promise<void> {
    await this._cartLink.click();
  }

  get productCategoryItems(): Locator {
    return this._productCategoryItems;
  }
  get logoutButton(): Locator {
    return this._logoutButton;
  }
  get accountButton(): Locator {
    return this._accountButton;
  }

  async clickSignIn(): Promise<void> {
    await this.signInLink.click();
  }
  get userMenuButton(): Locator {
    return this._userMenuButton;
  }
}
