'use server';

import { createServerClient } from "@/app/(lib)/supabase/server";
import { redirect } from "next/navigation";
import { type User, type AuthError } from "@/app/auth/(lib)/types";
import { headers } from "next/headers";

/**
 * Sign in the user with the provided email and password.
 * 
 * @param SignInInput 
 * @returns 
 */

export type SignInInput = {
  email: string;
  password: string;
};

export type SignInResult = {
  user?: User;
  error?: AuthError;
}

export async function signIn(input: SignInInput): Promise<SignInResult> {
  const supabase = createServerClient();
  
  const result = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  return {
    user: result.data.user ?? undefined,
    error: result.error ?? undefined,
  };
}


/**
 * Sign up the user with the provided email and password.
 */

export type SignUpInput = {
  email: string;
  password: string;
};

export type SignUpResult = {
  user?: User;
  error?: AuthError;
};

export async function signUp(input: SignUpInput): Promise<SignUpResult> {
  const supabase = createServerClient();
  const origin = headers().get("origin");

  const result = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  return {
    user: result.data.user ?? undefined,
    error: result.error ?? undefined,
  };
}

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
  const { data } = await supabase.auth.getUser();
  return data.user;
}

