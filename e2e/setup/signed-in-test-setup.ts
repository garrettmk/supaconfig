import path from "path";
import { expect, WorkerUserFixtures, workerUserTest } from "./worker-user-test-setup";
export { expect } from '@playwright/test';

export type SignedInFixtures = {
  signedInStorageState: string;
};

export const signedInTest = workerUserTest.extend<WorkerUserFixtures, SignedInFixtures>({
  signedInStorageState: [async ({ browser, workerUser }, use) => {
    const fileName = path.resolve(workerUserTest.info().project.outputDir, `.auth/storage-state-${workerUser.email}.json`);
    const { baseURL } = workerUserTest.info().project.use;
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();

    await page.goto('/login');
    await page.getByLabel(/email/i).fill(workerUser.email ?? '');
    await page.getByLabel(/password/i).fill(workerUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/configuration');

    await page.context().storageState({ path: fileName });
    await page.close();
    await context.close();

    await use(fileName);
  }, { scope: 'worker' }],

  storageState: ({ signedInStorageState }, use) => use(signedInStorageState)
})