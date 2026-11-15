import { content } from "./content";
import { FORMS_ENTRY } from "./content/entries";
import type { EmailFormLabels } from "@/components/EmailForm";

/** Labels for the newsletter form and for the save-estimate form under calculator results. */
export async function formLabels() {
  const f = await content(FORMS_ENTRY);
  const newsletter: EmailFormLabels = {
    emailLabel: f.emailLabel,
    placeholder: f.placeholder,
    button: f.subscribeButton,
    saving: f.savingLabel,
    success: f.subscribeSuccess,
    error: f.genericError,
  };
  const save: EmailFormLabels = { ...newsletter, button: f.saveButton, success: f.saveSuccess };
  return { newsletter, save, saveTitle: f.saveTitle };
}
