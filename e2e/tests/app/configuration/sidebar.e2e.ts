import { Locator, Page } from '@playwright/test';
import { signedInTest as signedInTest, expect } from '@/e2e/setup/signed-in-test-setup';

export class Sidebar {
  public locationsItem: Locator;

  constructor(public page: Page) {
    this.locationsItem = page.getByRole('link', { name: /locations/i });
  }

  async gotoLocations() {
    this.locationsItem.click();
  }

  async gotoUsers(){
    const link = await this.page.getByRole('link', { name: /users/i });
    await link.click();
  }
}

const test = signedInTest.extend<{
  sidebar: Sidebar
}>({
  page: async ({ browser }, use) => {
    const page = await browser.newPage();
    await page.goto('/configuration');

    await use(page);
  },

  sidebar: async ({ page }, use) => {
    await use(new Sidebar(page));
  }
});


test('should navigate to Users', async ({ sidebar, page }) => {
  await sidebar.gotoUsers();
  await expect(page).toHaveURL('/configuration/users');
})

test('should navigate to Locations', async ({ sidebar, page }) => {
  await sidebar.gotoLocations();
  await expect(page).toHaveURL('/configuration/locations');
});
