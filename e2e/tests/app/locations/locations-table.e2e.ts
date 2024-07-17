import { signedInTest, expect } from "@/e2e/setup/signed-in-test-setup";
import { Locator, Page } from "@playwright/test";

export class TableTester {
  constructor(public page: Page) {}

  static hasEqualValues(valuesLeft: any[], valuesRight: any[]): boolean {
    return valuesLeft.length === valuesRight.length && valuesLeft.reduce(
      (result, valueLeft, index) => {
        if (!result) 
          return false;

        return valuesLeft[index] === valuesRight[index];
      },
      true
    )
  }

  headerLocator(text: string) {
    return this.page.getByRole('cell', { name: text });
  }

  async sortBy(header: string) {
    await this.headerLocator(header).click();
  }

  async getCells(header: string) {
    const headerIndex = await this.headerLocator(header).evaluate(headerCell => {
      const headerCells = Array.from(headerCell.parentElement!.children);
      return headerCells.indexOf(headerCell);
    });

    return this.page.locator(`tbody td:nth-child(${headerIndex + 1})`);
  }

  async getValues(header: string) {
    const locator = await this.getCells(header);
    return locator.allInnerTexts();
  }

  async isSorted(header: string, direction: 'asc' | 'desc' = 'asc') {
    const valuesLeft = await this.getValues(header);
    const valuesRight = direction === 'asc' ? valuesLeft.sort() : valuesLeft.sort().reverse();

    return TableTester.hasEqualValues(valuesLeft, valuesRight);
  }

  async getCell(header: string, row: number) {
    const headerIndex = await this.headerLocator(header).evaluate(headerCell => {
      const headerCells = Array.from(headerCell.parentElement!.children);
      return headerCells.indexOf(headerCell);
    });

    return this.page.locator(`tbody tr:nth-child(${row}) td:nth-child(${headerIndex + 1})`);
  }
}

const test = signedInTest.extend<{
  locationsTable: TableTester
}>({
  page: async ({ browser }, use) => {
    const page = await browser.newPage();
    await page.goto('/configuration/locations');

    await use(page);
  },

  locationsTable: ({ page }, use) => use(new TableTester(page))
});


/**
 * Column sorting
 */

const sortableColumns = ['Name', 'ID', 'Version'];
const initiallySortedBy = 'Name';

for (const column of sortableColumns) {
  if (column === initiallySortedBy)
    test(`is initially sorted by ${initiallySortedBy} asc`, async ({ locationsTable }) => {
      await expect(await locationsTable.isSorted(column, 'asc')).toBe(true);
    });

  const direction = column === initiallySortedBy ? 'desc' : 'asc';
  
  test(`should sort by ${column} ${direction}`, async ({ locationsTable }) => {
    await locationsTable.sortBy(column);
    await expect(await locationsTable.isSorted(column, direction)).toBe(true);
  });

  const oppositeDirection = direction === 'asc' ? 'desc' : 'asc';

  test(`should sort by ${column} ${oppositeDirection}`, async ({ locationsTable }) => {
    await locationsTable.sortBy(column);
    await expect(await locationsTable.isSorted(column, direction)).toBe(true);

    await locationsTable.sortBy(column);
    await expect(await locationsTable.isSorted(column, oppositeDirection)).toBe(true);
  });
}


/**
 * Navigate to location
 */

test('should navigate to location', async ({ locationsTable, page }) => {
  const idCell = (await locationsTable.getCell('ID', 1));
  const id = await idCell.textContent();

  const nameLink = (await locationsTable.getCell('Name', 1)).getByRole('link');
  await nameLink.click();
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL(`/configuration/locations/${id}`);
});


/**
 * Copy ID to clipboard
 */

test('should copy ID to clipboard', async ({ locationsTable, page }) => {
  const idCell = await locationsTable.getCell('ID', 1);
  const id = await idCell.textContent();

  const copyButton = await idCell.getByRole('button');
  await copyButton.click();

  const clipboardText = await page.evaluate('navigator.clipboard.readText()');
  await expect(clipboardText).toContain(id);
});


/**
 * Navigate to events
 */

test('should navigate to event stream', async ({ locationsTable, page }) => {
  const idCell = await locationsTable.getCell('ID', 1);
  const id = await idCell.textContent();

  const versionLink = (await locationsTable.getCell('Version', 1)).getByRole('link');
  await versionLink.click();
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL(`/configuration/locations/${id}/events`);
});