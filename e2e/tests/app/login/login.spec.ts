import { TestUser } from '@/e2e/setup/base-setup';
import { workerUserTest, expect } from '@/e2e/setup/worker-user-setup';
import { Locator, Page } from '@playwright/test';

export class LoginPage {
  public emailInput: Locator;
  public passwordInput: Locator;
  public signInButton: Locator;

  static async from(page: Page): Promise<LoginPage> {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    return new LoginPage(page);
  }

  static async login(page: Page, user: TestUser) {
    const loginPage = await LoginPage.from(page);
    await loginPage.login(user);
  }

  constructor(public page: Page) {
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.signInButton = page.getByRole('button', { name: /sign in/i });
  }

  async login(user: TestUser) {
    const { email = '', password } = user;

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}



export const test = workerUserTest.extend<{ 
  emailInput: Locator;
  passwordInput: Locator;
  signInButton: Locator;
}>({
  page: async ({ browser }, use) => {
    const page = await browser.newPage({ storageState: undefined });
    await page.goto('/login');

    await use(page);
  },

  emailInput: async ({ page }, use) => {
    await use(page.getByLabel(/email/i));
  },

  passwordInput: async ({ page }, use) => {
    await use(page.getByLabel(/password/i));
  },

  signInButton: async ({ page }, use) => {
    await use(page.getByRole('button', { name: /sign in/i }));
  }
});


test('should redirect to login page', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL('/login');
});

test('should log in successfully', async ({ page, workerUser, emailInput, passwordInput, signInButton }) => {
  await emailInput.fill(workerUser.email ?? '');
  await passwordInput.fill(workerUser.password);
  await signInButton.click();

  await test.expect(page).toHaveURL('/configuration');
});