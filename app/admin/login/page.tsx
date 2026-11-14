import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin/auth";
import { supabaseConfigured } from "@/lib/supabase/server";
import { signIn } from "../actions";
import { ActionForm, SubmitButton, inputCls, labelCls } from "@/components/admin/forms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  const configured = supabaseConfigured();
  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center px-4">
      <div className="w-full rounded-2xl border border-line bg-surface p-6 shadow-card">
        <h1 className="text-2xl font-extrabold tracking-tight">Admin sign in</h1>
        {!configured ? (
          <div className="mt-4 space-y-2 text-sm text-muted">
            <p className="font-semibold text-ink">Supabase is not configured yet.</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>.</li>
              <li>Run <code>supabase/schema.sql</code> then <code>supabase/admin.sql</code> in the Supabase SQL editor.</li>
              <li>Create your user in Supabase Auth and add your email to <code>admin_users</code>.</li>
              <li>Restart the dev server.</li>
            </ol>
          </div>
        ) : (
          <ActionForm action={signIn} className="mt-4 space-y-4">
            <div>
              <label className={labelCls} htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="username" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="password">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required className={inputCls} />
            </div>
            <SubmitButton className="w-full">Sign in</SubmitButton>
          </ActionForm>
        )}
      </div>
    </main>
  );
}
