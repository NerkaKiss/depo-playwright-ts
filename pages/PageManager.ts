import { Page } from '@playwright/test';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';
import { CookieConsent } from '../components/CookieConsent';
import { Header } from '../components/Header';
import { LocationPicker } from '../components/LocationPicker';
import { LoginPage } from './LoginPage';
import { NotFoundPage } from './NotFoundPage';
import { ProductDetailPage } from './ProductDetailPage';
import { SearchPage } from './SearchPage';

export class PageManager {
  private readonly page: Page;
  readonly cartPage: CartPage;
  readonly checkoutPage: CheckoutPage;
  readonly cookieConsent: CookieConsent;
  readonly header: Header;
  readonly locationPicker: LocationPicker;
  readonly loginPage: LoginPage;
  readonly notFoundPage: NotFoundPage;
  readonly productDetailPage: ProductDetailPage;
  readonly searchPage: SearchPage;

  constructor(page: Page) {
    this.page = page;
    this.cartPage = new CartPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.cookieConsent = new CookieConsent(page);
    this.header = new Header(page);
    this.locationPicker = new LocationPicker(page);
    this.loginPage = new LoginPage(page);
    this.notFoundPage = new NotFoundPage(page);
    this.productDetailPage = new ProductDetailPage(page);
    this.searchPage = new SearchPage(page);
  }

  async goToHome(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('load');
  }

  async goTo(path: string): Promise<void> {
    await this.page.goto(path);
  }
}
