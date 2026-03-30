# DEPO DIY — Playwright E2E Test Suite

End-to-end and API test automation for [online.depo-diy.lt](https://online.depo-diy.lt) — a Lithuanian home improvement retail webshop. Built as a portfolio project demonstrating production-grade Playwright architecture.

![Playwright](https://img.shields.io/badge/Playwright-1.58-45ba4b?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI-2088ff?logo=githubactions&logoColor=white)
![Allure](https://img.shields.io/badge/Allure-Report-orange)

---

## Project Structure

```
├── .github/workflows/
│   └── playwright.yml        # CI: smoke on PR, regression nightly
├── components/
│   ├── CookieConsent.ts      # Cookie banner interaction
│   ├── Header.ts             # Top nav: search, cart, user menu, categories
│   └── LocationPicker.ts     # Store location selection dialog
├── data/
│   ├── constants.ts          # Shared strings: URLs, messages, IDs
│   ├── invalid-logins.json   # Parameterized negative login scenarios
│   └── users.ts              # User credentials (from .env)
├── fixtures/
│   └── index.ts              # Custom test fixture: provides `pm` (PageManager)
├── pages/
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── LoginPage.ts
│   ├── NotFoundPage.ts
│   ├── PageManager.ts        # Central access point for all pages/components
│   ├── ProductDetailPage.ts
│   └── SearchPage.ts
├── tests/
│   ├── api/
│   │   └── cart.api.spec.ts  # GraphQL API tests for cart operations
│   ├── e2e/
│   │   ├── cart.spec.ts
│   │   ├── categories.spec.ts
│   │   ├── checkout.spec.ts
│   │   ├── loginTest.spec.ts
│   │   ├── navigation.spec.ts
│   │   ├── product.spec.ts
│   │   └── search.spec.ts
│   └── setup/
│       └── consent.setup.ts  # Global auth setup: cookie consent + login
├── types/
│   ├── cart.ts               # CartItem interface
│   ├── login.ts              # InvalidLoginScenario interface
│   └── user.ts               # User interface
└── utils/
    └── cartApi.ts            # GraphQL cart helpers (API layer)
```

---

## Architecture

### Page Object Model + PageManager + Fixtures

Tests never instantiate page objects directly. Instead, a single `PageManager` is created per test via a custom Playwright fixture and exposed as `pm`.

```
Test file
  └── pm (fixture)
        └── PageManager
              ├── loginPage: LoginPage
              ├── cartPage: CartPage
              ├── checkoutPage: CheckoutPage
              ├── searchPage: SearchPage
              ├── productDetailPage: ProductDetailPage
              ├── notFoundPage: NotFoundPage
              ├── header: Header          (component)
              ├── cookieConsent: CookieConsent  (component)
              └── locationPicker: LocationPicker (component)
```

**Key conventions:**

- Locators are `private readonly` — never exposed directly to tests
- Getters return `Locator` for assertion use in tests
- No assertions inside page objects — ever
- API helpers in `utils/cartApi.ts` use `APIRequestContext`, not `Page`

---

## Test Coverage

| Feature          | File                     | Tags                          | Tests                  |
| ---------------- | ------------------------ | ----------------------------- | ---------------------- |
| Login            | `e2e/loginTest.spec.ts`  | `@smoke` `@regression`        | 3 active + 9 skipped\* |
| Cart (UI)        | `e2e/cart.spec.ts`       | `@smoke` `@regression`        | 6                      |
| Checkout         | `e2e/checkout.spec.ts`   | `@smoke` `@regression`        | 2                      |
| Search           | `e2e/search.spec.ts`     | `@smoke` `@regression`        | 3                      |
| Product detail   | `e2e/product.spec.ts`    | `@smoke` `@regression`        | 2                      |
| Navigation / 404 | `e2e/navigation.spec.ts` | `@regression` `@ui`           | 1                      |
| Categories       | `e2e/categories.spec.ts` | `@smoke` `@regression` `@ui`  | 2                      |
| Cart (API)       | `api/cart.api.spec.ts`   | `@smoke` `@regression` `@api` | 4                      |

> \* 9 parameterised invalid-login scenarios are skipped — they depend on login attempt rate limits and are intended for staging/local environments only.

**Total active tests: 33 (+ 9 skipped parameterised login scenarios)**

---

## Running Locally

### Prerequisites

- Node.js 20+
- Java (for Allure CLI, optional)

### Install

```bash
npm install
npx playwright install chromium
```

### Environment variables

Create a `.env` file in the project root:

```env
USER_EMAIL=your@email.com
USER_PASSWORD=yourPassword
```

### Auth setup

Run once to generate `playwright/.auth/` session files (cookie consent + login):

```bash
npx playwright test tests/setup/consent.setup.ts
```

### Run tests

```bash
# All tests
npx playwright test

# Smoke only
npx playwright test --grep @smoke

# Regression only
npx playwright test --grep @regression

# API tests only
npx playwright test tests/api/

# E2E tests only
npx playwright test tests/e2e/

# Specific feature
npx playwright test tests/e2e/checkout.spec.ts

# UI tests only
npx playwright test --grep @ui
```

---

## CI/CD

Configured in [.github/workflows/playwright.yml](.github/workflows/playwright.yml).

| Trigger                      | Job             | Tests run            |
| ---------------------------- | --------------- | -------------------- |
| Pull request                 | Smoke           | `--grep @smoke`      |
| Manual (`workflow_dispatch`) | Smoke           | `--grep @smoke`      |
| Schedule — nightly 02:00 UTC | Full regression | `--grep @regression` |

**Required GitHub secrets:**

| Secret          | Description           |
| --------------- | --------------------- |
| `USER_EMAIL`    | Test account email    |
| `USER_PASSWORD` | Test account password |

Allure results are uploaded as a workflow artifact (`allure-results`, 14-day retention) after every run — including failed ones.

---

## Allure Reporting

Allure is configured as a reporter in `playwright.config.ts` — results are written automatically to `allure-results/` on every test run.

### Generate and open report

```bash
# Install Allure CLI (once)
npm install -g allure-commandline

# Generate report from results
npx allure generate allure-results --clean -o allure-report

# Open in browser
npx allure open allure-report
```

### CI artifacts

After each GitHub Actions run, download the `allure-results` artifact from the workflow summary and generate the report locally with the commands above.
