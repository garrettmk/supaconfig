import { BaseWorkerFixtures, TestUser, baseTest } from "./base-test-setup";
export { expect } from '@playwright/test';

export type WorkerUserFixtures = {
  workerUserStorageState: string;
  workerUser: TestUser
}

export const workerUserTest = baseTest.extend<BaseWorkerFixtures, WorkerUserFixtures>({
  workerUser: [async ({ supabase }, use, workerInfo) => {
    const { workerIndex } = workerInfo;
    const email = `test-worker-${workerIndex}@test.com`;
    const password = 'test1234';

    const { data, error } = await supabase.auth.admin.createUser({
      user_metadata: {
        fullName: `Test User ${workerIndex}`
      },
      email,
      password,
      email_confirm: true
    });

    if (error)
      throw new Error(`Error creating worker user ${workerIndex}: ${error.message}`);
    if (!data.user)
      throw new Error(`Worker user ${workerIndex} not returned from Supabase`);

    await use({ ...data.user, email, password });

    await supabase.auth.admin.deleteUser(data.user.id);
  }, { scope: 'worker' }]
});