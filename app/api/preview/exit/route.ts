import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { PREVIEW_COOKIE } from "@/lib/wp";

export async function GET(req: Request) {
  (await draftMode()).disable();
  (await cookies()).delete(PREVIEW_COOKIE);
  const res = NextResponse.redirect(new URL("/", req.url));
  res.headers.set("Cache-Control", "no-store");
  return res;
}
