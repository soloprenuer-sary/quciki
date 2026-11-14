"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MediaUploader() {
  const router = useRouter();
  const [msg, setMsg] = useState("");

  async function upload(file: File) {
    setMsg("Uploading…");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setMsg("Uploaded.");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <label htmlFor="file" className="mb-1 block text-sm font-semibold">Upload an image</label>
      <input id="file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="text-sm" />
      <p className="mt-1 text-xs text-muted">PNG, JPG, WebP or GIF, up to 5 MB. Copy the URL into a guide or an SEO social image field.</p>
      {msg && <p role="status" className="mt-2 text-sm">{msg}</p>}
    </div>
  );
}
