import { signedInTest, expect } from "@/e2e/setup/signed-in-test-setup";
import { asyncTimeout } from "@/lib/utils/utils";
import { Locator } from '@playwright/test';


const test = signedInTest.extend<{
  createLocationButton: Locator
  createLocationForm: Locator
  createLocationInput: { name: string }
}>({
  page: async ({ browser }, use) => {
    const page = await browser.newPage();
    await page.goto('/configuration/locations');

    await use(page);
  },

  createLocationButton: async ({ page }, use) => use(page.getByRole('button', { name: 'Create location' })),

  createLocationForm: async ({ page }, use) => use(page.getByTestId('create-location-form')),

  createLocationInput: async ({ supabase }, use, workerInfo) => {
    const name = `Test Location (Worker ${workerInfo.workerIndex})`;

    await use({ name });

    const { data: location, error } = await supabase
      .from('locations')
      .select('*')
      .eq('name', name)
      .single();

    if (location?.id) {
      await supabase
        .from('events')
        .delete()
        .eq('aggregate_id', location.id);

      await supabase
        .from('aggregates')
        .delete()
        .eq('id', location.id);
    }
  }
});


/**
 * Show and hide the form
 */

test('shows the create location form', async ({ createLocationButton, createLocationForm }) => {
  await createLocationButton.click();
  await expect(createLocationForm).toBeVisible();
});

test('cancel button closes hids the form', async ({ createLocationButton, createLocationForm }) => {
  await createLocationButton.click();
  await expect(createLocationForm).toBeVisible();

  const cancelButton = createLocationForm.getByRole('button', { name: 'Cancel' });
  await cancelButton.click();

  await expect(createLocationForm).not.toBeVisible();
});

test('click outside closes the form', async ({ createLocationButton, createLocationForm, page }) => {
  await createLocationButton.click();
  await expect(createLocationForm).toBeVisible();

  const wrapper = page.locator('body');
  await wrapper.click();

  await expect(createLocationForm).not.toBeVisible();
});


/**
 * Create a location
 */

test('creates a location', async ({ createLocationButton, createLocationForm, createLocationInput, supabase, page }) => {
  await createLocationButton.click();

  const nameField = createLocationForm.getByLabel(/name/i);
  const submitButton = createLocationForm.getByRole('button', { name: 'Submit' });

  await nameField.fill(createLocationInput.name);
  await submitButton.click();
  await page.waitForLoadState('networkidle');
  await asyncTimeout(5000);

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('name', createLocationInput.name)
    .single();

  await expect(error).toBeNull();
});