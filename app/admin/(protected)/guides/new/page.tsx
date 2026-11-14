import { requireAdmin } from "@/lib/admin/auth";
import { CATEGORIES } from "@/lib/categories";
import { CALCULATORS } from "@/lib/calculators";
import { GuideEditor } from "@/components/admin/forms";
import { saveGuide } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function NewGuide() {
  await requireAdmin();
  return (
    <div className="max-w-6xl space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">New guide</h1>
      <GuideEditor
        action={saveGuide}
        categories={CATEGORIES.map((c) => ({ slug: c.slug, name: c.short }))}
        calculators={CALCULATORS.map((c) => ({ slug: c.slug, name: c.name }))}
        initial={{ slug: "", category: CATEGORIES[0].slug, title: "", description: "", body_md: "", cover_url: "", calculator_slug: "", status: "draft", published_at: "" }}
      />
    </div>
  );
}
