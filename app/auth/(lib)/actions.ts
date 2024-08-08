'use server';

import { createServerClient } from "@/app/(lib)/supabase/server";
import { redirect } from "next/navigation";

/**
 * Sign out the user and redirect to the login page.
 * 
 * @returns 
 */
export async function signOut() {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  return redirect("/login");
}

/**
 * Return the currently signed-in user.
 * 
 * @returns 
 */
export async function getUser() {
  const supabase = createServerClient();
  const { data: user } = await supabase.auth.getUser();
  return user;
}

