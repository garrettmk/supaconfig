import { Locator, Page } from '@playwright/test';
import { AuthUser } from '@supabase/supabase-js';
import { signedInTest, expect } from '@/e2e/setup/signed-in-test-setup';


export class UserMenuButton {
  public menuButton: Locator;
  public lightModeItem: Locator;
  public darkModeItem: Locator;
  public systemModeItem: Locator;
  public logoutItem: Locator;

  constructor(page: Page, user: AuthUser) {
    this.menuButton = page.getByRole('button', { name: user.email });
    this.lightModeItem = page.getByText(/light/i);
    this.darkModeItem = page.getByText(/dark/i);
    this.systemModeItem = page.getByText(/system/i);
    this.logoutItem = page.getByText(/logout/i);
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutItem.click();
  }

  async setDarkMode() {
    await this.menuButton.click();
    await this.darkModeItem.click();
  }

  async setLightMode() {
    await this.menuButton.click();
    await this.lightModeItem.click();
  }
}


const test = signedInTest.extend<{
  userMenuButton: UserMenuButton
}>({
  page: async ({ browser }, use) => {
    const page = await browser.newPage();
    await page.goto('/configuration');
    
    await use(page);
  },

  userMenuButton: async ({ page, workerUser }, use) => {
    await use(new UserMenuButton(page, workerUser));
  }
})



test('user menu button should exist', async ({ userMenuButton, page }) => {
  await expect(userMenuButton.menuButton).toBeVisible();
});


test('should set color-scheme to light', async ({ userMenuButton, page }) => {
  await userMenuButton.setLightMode();
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light');
});

test('should set color-scheme to dark', async ({ userMenuButton, page }) => {
  await userMenuButton.setDarkMode();
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark');
});


/*
  This test logs out the worker user, so it should be run last. Or, I should be using a separate login
  for each test. This would add a lot of extra time to each test, though, so I'm going to stick with
  this option for now.
*/
test('should logout', async ({ userMenuButton, page }) => {
  await userMenuButton.logout();
  await expect(page).toHaveURL('/login');
});