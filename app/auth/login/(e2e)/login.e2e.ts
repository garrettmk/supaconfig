import { TestUser } from '@/e2e/setup/base-test-setup';
import { workerUserTest, expect } from '@/e2e/setup/worker-user-test-setup';
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
  signUpButton: Locator;
  signUpUserCredentials: { email: string, password: string };
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
  },

  signUpButton: async ({ page }, use) => {
    await use(page.getByRole('button', { name: /sign up/i }));
  },

  signUpUserCredentials: async ({ supabase }, use) => {
    const userCredentials = { email: 'worker@mail.com', password: 'test1234' };

    await use(userCredentials);

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('name', 'worker')
      .single();

    if (user)
      await supabase.auth.admin.deleteUser(user.id);
  },
});


test('should redirect to login page', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL('/auth/login');
});

test('should log in successfully', async ({ page, workerUser, emailInput, passwordInput, signInButton }) => {
  await emailInput.fill(workerUser.email ?? '');
  await passwordInput.fill(workerUser.password);
  await signInButton.click();

  await test.expect(page).toHaveURL('/configuration');
});

test('should create a new user', async ({ supabase, page, signUpUserCredentials, emailInput, passwordInput, signUpButton }) => {
  await emailInput.fill(signUpUserCredentials.email);
  await passwordInput.fill(signUpUserCredentials.password);
  await signUpButton.click();

  await test.expect(page).toHaveURL('/auth/login?message=Check email to continue sign in process');

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('name', 'worker')
    .single();

  await test.expect(user).not.toBeFalsy();
  await test.expect(error).toBeFalsy();
});