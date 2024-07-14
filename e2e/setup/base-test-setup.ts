import { test as base } from '@playwright/test';
import { type AuthUser, createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export type TestUser = AuthUser & { password: string };

export type BaseTestFixtures = {};

export type BaseWorkerFixtures = {
  supabase: SupabaseClient;
};

export const baseTest = base.extend<BaseTestFixtures, BaseWorkerFixtures>({
  supabase: [async ({}, use) => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false
      }
    });
    
    await use(supabase);
  }, { scope: 'worker' }],
});

export { expect } from '@playwright/test';
