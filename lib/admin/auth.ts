import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAuthClient, supabaseConfigured } from "../supabase/server";

export interface AdminSession {
  email: string;
  /** Supabase client acting as this user. Database rules (RLS) still decide what it may write. */
  db: SupabaseClient;
}

/**
 * Returns the signed-in admin, or null. Two checks must both pass:
 *  1. a valid Supabase session (verified with the Auth server, not just read from the cookie), and
 *  2. the email exists in public.admin_users (visible to a user only for their own row, via RLS).
 */
export async function getAdmin(): Promise<AdminSession | null> {
  if (!supabaseConfigured()) return null;
  try {
    const db = await createAuthClient();
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user?.email) return null;
    const { data } = await db.from("admin_users").select("email").maybeSingle();
    if (!data) return null;
    return { email: user.email, db };
  } catch {
    return null;
  }
}

/** For admin pages: redirect to the login page when not an admin. */
export async function requireAdmin(): Promise<AdminSession> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
