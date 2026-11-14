import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin/auth";

const TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" };
const MAX = 5 * 1024 * 1024;

/** Checks the real file signature, not just the type the browser claims. */
function sniff(b: Uint8Array): string | null {
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return "image/gif";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  return null;
}

export async function POST(req: Request) {
  // Same-origin only (the session cookie is also SameSite=Lax).
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return NextResponse.json({ error: "Bad origin." }, { status: 403 });

  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file." }, { status: 400 });
  if (file.size === 0 || file.size > MAX) return NextResponse.json({ error: "File must be between 1 byte and 5 MB." }, { status: 400 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const real = sniff(bytes);
  if (!real || !TYPES[real] || (TYPES[file.type] && file.type !== real)) {
    return NextResponse.json({ error: "Only PNG, JPG, WebP and GIF images are allowed." }, { status: 400 });
  }

  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "image";
  const name = `${Date.now()}-${base}.${TYPES[real]}`;
  const { error } = await admin.db.storage.from("media").upload(name, bytes, { contentType: real, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = admin.db.storage.from("media").getPublicUrl(name);
  return NextResponse.json({ url: data.publicUrl, name });
}
