import { signedInTest, expect } from "@/e2e/setup/signed-in-test-setup";
import { Locator, Page } from "@playwright/test";

export class LocationsTable {
  public nameColumnHeader: Locator;
  public nameCells: Locator;
  public idColumnHeader: Locator;
  public idCells: Locator;
  public versionColumnHeader: Locator;
  public versionCells: Locator;

  constructor(public page: Page) {
    this.nameColumnHeader = page.getByRole('cell', { name: 'Name' });
    this.nameCells = page.locator('tbody td:nth-child(1)');
    this.idColumnHeader = page.getByRole('cell', { name: 'ID' });
    this.idCells = page.locator('tbody td:nth-child(2)');
    this.versionColumnHeader = page.getByRole('cell', { name: 'Version' });
    this.versionCells = page.locator('tbody td:nth-child(3)');
  }

  async sortByName() {
    await this.nameColumnHeader.click();
  }

  async getNameValues() {
    return this.idCells.allInnerTexts();
  }

  async sortById() {
    await this.idColumnHeader.click();
  }

  async getIdValues() {
    return this.idCells.allInnerTexts();
  }

  async sortByVersion() {
    await this.versionColumnHeader.click();
  }

  async getVersionValues() {
    return await this.versionCells.allInnerTexts();
  }
}

const test = signedInTest.extend<{
  locationsTable: LocationsTable
}>({
  page: async ({ browser }, use) => {
    const page = await browser.newPage();
    await page.goto('/configuration/locations');

    await use(page);
  },

  locationsTable: ({ page }, use) => use(new LocationsTable(page))
});


/**
 * Sorting by name
 */

test('is initially sorted by name', async ({ locationsTable }) => {
  const nameValues = await locationsTable.getNameValues();

  await expect(nameValues).toEqual(nameValues.sort());
})

test('should sort by name desc', async ({ locationsTable }) => {
  await locationsTable.sortByName();
  const nameValues = await locationsTable.getNameValues();

  await expect(nameValues).toEqual(nameValues.sort().reverse());
});


test('should sort by name asc', async ({ locationsTable }) => {
  await locationsTable.sortByName();
  let nameValues = await locationsTable.getNameValues();

  await expect(nameValues).toEqual(nameValues.sort().reverse());

  await locationsTable.sortByName();
  nameValues = await locationsTable.getNameValues();

  await expect(nameValues).toEqual(nameValues.sort());
});


/**
 * Sorting by ID
 */

test('should sort by ID desc', async ({ locationsTable }) => {
  await locationsTable.sortById();
  const idValues = await locationsTable.getIdValues();

  await expect(idValues).toEqual(idValues.sort().reverse());
});


test('should sort by ID asc', async ({ locationsTable }) => {
  await locationsTable.sortById();
  let idValues = await locationsTable.getIdValues();

  await expect(idValues).toEqual(idValues.sort().reverse());

  await locationsTable.sortById();
  idValues = await locationsTable.getIdValues();

  await expect(idValues).toEqual(idValues.sort());
});


/**
 * Sorting by version
 */

test('should sort by version desc', async ({ locationsTable }) => {
  await locationsTable.sortByVersion();
  const versionValues = await locationsTable.getVersionValues();

  await expect(versionValues).toEqual(versionValues.sort().reverse());
});


test('should sort by version asc', async ({ locationsTable }) => {
  await locationsTable.sortByVersion();
  let versionValues = await locationsTable.getVersionValues();

  await expect(versionValues).toEqual(versionValues.sort().reverse());

  await locationsTable.sortByVersion();
  versionValues = await locationsTable.getVersionValues();

  await expect(versionValues).toEqual(versionValues.sort());
});