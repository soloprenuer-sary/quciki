"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdmin } from "@/lib/admin/auth";
import { createAuthClient, supabaseConfigured } from "@/lib/supabase/server";
import { CALCULATORS } from "@/lib/calculators";
import { CATEGORIES } from "@/lib/categories";
import { GUIDES, guideToMarkdown } from "@/lib/guides";
import { SETTING_KEYS } from "@/lib/cms";
import {
  isProtectedPath,
  isSafeUrl,
  isSlug,
  normalizePath,
  parseFaqs,
  parseLines,
  parseParagraphs,
} from "@/lib/admin/parse";

export type ActionState = { ok: boolean; message: string } | null;
const fail = (message: string): ActionState => ({ ok: false, message });
const done = (message: string): ActionState => ({ ok: true, message });
const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

/** Every action re-checks that the caller is a signed-in admin. Never trust that the page was protected. */
async function guard() {
  const admin = await getAdmin();
  if (!admin) throw new Error("Not authorized");
  return admin;
}

/** Refresh every public page after content changes. */
const refreshSite = () => revalidatePath("/", "layout");

const dbError = (e: { message?: string; code?: string } | null): string =>
  e?.code === "23505"
    ? "That value already exists."
    : e?.code === "42P01"
      ? "Database tables are missing. Run supabase/admin.sql in the Supabase SQL editor."
      : e?.code === "42501"
        ? "Permission denied. Is your email in the admin_users table?"
        : `Could not save: ${e?.message ?? "unknown error"}`;

/* ================================ auth ================================ */

export async function signIn(_prev: ActionState, fd: FormData): Promise<ActionState> {
  if (!supabaseConfigured()) return fail("Supabase is not configured. Add the keys to .env.local.");
  const email = str(fd, "email");
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return fail("Enter your email and password.");

  const db = await createAuthClient();
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) return fail("Invalid email or password.");

  const admin = await getAdmin();
  if (!admin) {
    await db.auth.signOut();
    return fail("This account is not an admin. Add the email to the admin_users table.");
  }
  redirect("/admin");
}

export async function signOut() {
  if (supabaseConfigured()) {
    const db = await createAuthClient();
    await db.auth.signOut();
  }
  redirect("/admin/login");
}

/* ================================ guides ================================ */

export async function saveGuide(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const { db } = await guard();
  const id = str(fd, "id");
  const slug = str(fd, "slug").toLowerCase();
  const category = str(fd, "category");
  const title = str(fd, "title");
  const description = str(fd, "description");
  const body = String(fd.get("body_md") ?? "");
  const cover = str(fd, "cover_url");
  const calc = str(fd, "calculator_slug");
  const status = str(fd, "status") === "published" ? "published" : "draft";
  const publishedRaw = str(fd, "published_at");

  if (!isSlug(slug)) return fail("Slug must be lowercase letters, numbers and hyphens, for example my-first-guide.");
  if (!CATEGORIES.some((c) => c.slug === category)) return fail("Choose a category.");
  if (title.length < 3 || title.length > 200) return fail("Title must be 3 to 200 characters.");
  if (description.length > 300) return fail("Description must be 300 characters or fewer.");
  if (body.length > 200_000) return fail("The guide body is too long.");
  if (!isSafeUrl(cover)) return fail("Cover image must be empty, a path like /images/x.png, or an https URL.");
  if (calc && !CALCULATORS.some((c) => c.slug === calc)) return fail("Unknown calculator slug.");
  if (status === "published" && body.trim().length < 50) return fail("Write at least a short body before publishing.");

  let published_at: string | null = null;
  if (status === "published") {
    // The datetime-local box has no time zone; the editor labels it UTC.
    const raw = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(publishedRaw) ? `${publishedRaw}:00Z` : publishedRaw;
    const d = raw ? new Date(raw) : new Date();
    if (Number.isNaN(d.getTime())) return fail("Publish date is not valid.");
    published_at = d.toISOString();
  }

  const row = {
    slug,
    category,
    title,
    description,
    body_md: body,
    cover_url: cover || null,
    calculator_slug: calc || null,
    status,
    published_at,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await db.from("guides").update(row).eq("id", id);
    if (error) return fail(dbError(error));
    refreshSite();
    return done(status === "published" ? "Saved and published." : "Draft saved.");
  }
  const { data, error } = await db.from("guides").insert(row).select("id").single();
  if (error || !data) return fail(dbError(error));
  refreshSite();
  redirect(`/admin/guides/${data.id}`);
}

export async function deleteGuide(fd: FormData) {
  const { db } = await guard();
  const id = str(fd, "id");
  if (id) await db.from("guides").delete().eq("id", id);
  refreshSite();
  redirect("/admin/guides");
}

/** Copy built-in guides into the database so they can be edited in the admin. */
export async function importGuides(fd: FormData) {
  const { db } = await guard();
  const only = str(fd, "slug");
  const list = GUIDES.filter((g) => !only || g.slug === only);
  const rows = list.map((g) => ({
    slug: g.slug,
    category: g.category,
    title: g.title,
    description: g.description,
    body_md: guideToMarkdown(g),
    calculator_slug: g.calculator,
    status: "published",
    published_at: new Date(`${g.published}T00:00:00Z`).toISOString(),
  }));
  if (rows.length) await db.from("guides").upsert(rows, { onConflict: "slug", ignoreDuplicates: true });
  refreshSite();
  redirect("/admin/guides");
}

/* ================================ SEO ================================ */

export async function saveSeo(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const { db } = await guard();
  const path = normalizePath(str(fd, "path"));
  const title = str(fd, "title");
  const description = str(fd, "description");
  const canonical = str(fd, "canonical");
  const og = str(fd, "og_image");
  const noindex = fd.get("noindex") === "on";

  if (!path.startsWith("/") || /\s/.test(path) || path.length > 200) return fail("Path must start with / and contain no spaces.");
  if (isProtectedPath(path)) return fail("That path cannot be edited.");
  if (title.length > 120) return fail("Title is too long (120 characters maximum).");
  if (description.length > 320) return fail("Description is too long (320 characters maximum).");
  if (!isSafeUrl(canonical) || !isSafeUrl(og)) return fail("Canonical and image must be empty, a /path, or an https URL.");

  // Nothing customised: remove the override so the page goes back to its defaults.
  if (!title && !description && !canonical && !og && !noindex) {
    await db.from("seo_overrides").delete().eq("path", path);
    refreshSite();
    return done("Override removed. The page uses its default SEO again.");
  }
  const { error } = await db.from("seo_overrides").upsert(
    { path, title: title || null, description: description || null, canonical: canonical || null, og_image: og || null, noindex, updated_at: new Date().toISOString() },
    { onConflict: "path" },
  );
  if (error) return fail(dbError(error));
  refreshSite();
  return done("SEO saved.");
}

/* ================================ calculator copy ================================ */

export async function saveCalcContent(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const { db } = await guard();
  const slug = str(fd, "slug");
  if (!CALCULATORS.some((c) => c.slug === slug)) return fail("Unknown calculator.");

  const faqs = parseFaqs(String(fd.get("faqs") ?? ""));
  if (faqs.error) return fail(faqs.error);

  const row = {
    slug,
    tagline: str(fd, "tagline") || null,
    intro: parseParagraphs(String(fd.get("intro") ?? "")),
    steps: parseLines(String(fd.get("steps") ?? "")),
    formula: parseLines(String(fd.get("formula") ?? "")),
    example: parseParagraphs(String(fd.get("example") ?? "")),
    tips: parseLines(String(fd.get("tips") ?? "")),
    faqs: faqs.faqs,
    updated_at: new Date().toISOString(),
  };
  if ((row.tagline ?? "").length > 300) return fail("Tagline must be 300 characters or fewer.");
  const total = JSON.stringify(row).length;
  if (total > 100_000) return fail("Content is too long.");

  const { error } = await db.from("calculator_content").upsert(row, { onConflict: "slug" });
  if (error) return fail(dbError(error));
  refreshSite();
  return done("Saved. The calculator page now uses this text.");
}

export async function resetCalcContent(fd: FormData) {
  const { db } = await guard();
  const slug = str(fd, "slug");
  if (slug) await db.from("calculator_content").delete().eq("slug", slug);
  refreshSite();
  redirect(`/admin/calculators/${slug}`);
}

/* ================================ redirects ================================ */

export async function addRedirect(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const { db } = await guard();
  const source = normalizePath(str(fd, "source"));
  const destination = normalizePath(str(fd, "destination"));
  const permanent = fd.get("permanent") === "on";

  if (!source.startsWith("/") || /\s|\?|#/.test(source)) return fail("Source must start with / and contain no spaces, ? or #.");
  if (isProtectedPath(source)) return fail("You cannot redirect /admin, /api or /_next.");
  if (!isSafeUrl(destination) || !destination) return fail("Destination must be a /path or an https URL.");
  if (source === destination) return fail("Source and destination are the same.");

  // Reject direct two-step loops (A to B while B already redirects to A).
  const { data: back } = await db.from("redirects").select("id").eq("source", destination).eq("destination", source).maybeSingle();
  if (back) return fail("That would create a redirect loop with an existing redirect.");

  const { error } = await db.from("redirects").insert({ source, destination, permanent });
  if (error) return fail(dbError(error));
  refreshSite();
  return done("Redirect added. It can take up to a minute to take effect.");
}

export async function deleteRedirect(fd: FormData) {
  const { db } = await guard();
  const id = str(fd, "id");
  if (id) await db.from("redirects").delete().eq("id", id);
  refreshSite();
  redirect("/admin/redirects");
}

export async function toggleRedirect(fd: FormData) {
  const { db } = await guard();
  const id = str(fd, "id");
  const active = str(fd, "active") === "true";
  if (id) await db.from("redirects").update({ active: !active }).eq("id", id);
  refreshSite();
  redirect("/admin/redirects");
}

/* ================================ settings ================================ */

export async function saveSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const { db } = await guard();
  const values: Record<(typeof SETTING_KEYS)[number], string> = {
    adsense_client: str(fd, "adsense_client"),
    adsense_slot_results: str(fd, "adsense_slot_results"),
    adsense_slot_content: str(fd, "adsense_slot_content"),
    contact_email: str(fd, "contact_email"),
    google_verification: str(fd, "google_verification"),
  };
  if (values.adsense_client && !/^ca-pub-\d{10,20}$/.test(values.adsense_client)) return fail('AdSense client must look like "ca-pub-1234567890123456".');
  for (const k of ["adsense_slot_results", "adsense_slot_content"] as const) {
    if (values[k] && !/^\d{6,20}$/.test(values[k])) return fail("AdSense slot IDs are numbers, for example 1234567890.");
  }
  if (values.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact_email)) return fail("Contact email is not valid.");
  if (values.google_verification && !/^[A-Za-z0-9_-]{10,120}$/.test(values.google_verification)) return fail("Verification token should be just the code from Search Console, not the whole tag.");

  const rows = SETTING_KEYS.map((key) => ({ key, value: values[key], updated_at: new Date().toISOString() }));
  const { error } = await db.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) return fail(dbError(error));
  refreshSite();
  return done("Settings saved.");
}

/* ================================ media ================================ */

export async function deleteMedia(fd: FormData) {
  const { db } = await guard();
  const name = str(fd, "name");
  if (name && !name.includes("/") && !name.includes("..")) await db.storage.from("media").remove([name]);
  redirect("/admin/media");
}
