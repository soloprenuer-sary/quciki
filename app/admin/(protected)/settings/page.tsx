import { requireAdmin } from "@/lib/admin/auth";
import { getSiteConfig } from "@/lib/cms";
import { ActionForm, SubmitButton, helpCls, inputCls, labelCls } from "@/components/admin/forms";
import { saveSettings } from "../../actions";

export const dynamic = "force-dynamic";

export default async function SettingsAdmin() {
  await requireAdmin();
  const c = await getSiteConfig();
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
      <p className="rounded-xl bg-brand-soft p-3 text-sm">These values are public (they end up in the page source). Never paste passwords or secret keys here.</p>
      <ActionForm action={saveSettings} className="space-y-5">
        <fieldset className="space-y-4 rounded-2xl border border-line bg-surface p-4">
          <legend className="px-1 text-sm font-bold">Google AdSense</legend>
          <div>
            <label className={labelCls} htmlFor="adsense_client">Publisher ID</label>
            <input id="adsense_client" name="adsense_client" defaultValue={c.adsenseClient} placeholder="ca-pub-1234567890123456" className={inputCls} />
            <p className={helpCls}>Leave empty until AdSense approves the site. Setting it loads the ad script, adds the verification meta tag and publishes /ads.txt.</p>
          </div>
          <div>
            <label className={labelCls} htmlFor="adsense_slot_results">Ad unit ID: below calculator results</label>
            <input id="adsense_slot_results" name="adsense_slot_results" defaultValue={c.slotResults} placeholder="1234567890" className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="adsense_slot_content">Ad unit ID: inside articles</label>
            <input id="adsense_slot_content" name="adsense_slot_content" defaultValue={c.slotContent} placeholder="1234567890" className={inputCls} />
          </div>
        </fieldset>
        <fieldset className="space-y-4 rounded-2xl border border-line bg-surface p-4">
          <legend className="px-1 text-sm font-bold">Site</legend>
          <div>
            <label className={labelCls} htmlFor="contact_email">Contact email shown on the Contact page</label>
            <input id="contact_email" name="contact_email" type="email" defaultValue={c.contactEmail} className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="google_verification">Google Search Console verification code</label>
            <input id="google_verification" name="google_verification" defaultValue={c.googleVerification} className={inputCls} placeholder="The content value of the meta tag" />
            <p className={helpCls}>Paste only the code (the <code>content</code> value), not the whole tag.</p>
          </div>
        </fieldset>
        <SubmitButton>Save settings</SubmitButton>
      </ActionForm>
    </div>
  );
}
