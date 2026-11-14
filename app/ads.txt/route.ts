import { getSiteConfig } from "@/lib/cms";

export const revalidate = 3600;

/** Serves /ads.txt from the AdSense publisher ID in the admin settings (ca-pub-XXXX becomes pub-XXXX). */
export async function GET() {
  const { adsenseClient } = await getSiteConfig();
  const pub = adsenseClient.replace(/^ca-/, "");
  const body = pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : "# Set your AdSense publisher ID in Admin > Settings to publish your ads.txt line.\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
