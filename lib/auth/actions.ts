'use server';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/login");
}

export async function getUser() {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  return user;
}

