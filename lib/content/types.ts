/*
 * Editable content definitions.
 *
 * Every piece of text, link and image that editors can change in WordPress is declared here once, with its
 * default value. The defaults are what visitors see until someone edits the field, and they are what the site
 * falls back to if WordPress is down or a value is invalid. `npm run wp:export` copies these definitions into
 * the WordPress plugin, which builds the edit screens from them.
 */

export type TextType = "text" | "textarea" | "url" | "image" | "richtext" | "date";

interface FieldBase {
  label: string;
  help?: string;
  /** Edit-screen section heading. */
  section?: string;
  /** Editors may clear this field on purpose. Other fields fall back to the default when empty. */
  optional?: boolean;
}

export interface TextField extends FieldBase {
  type: TextType;
  default: string;
  max?: number;
}

export type ItemFields = Record<string, TextField>;

export interface ListField extends FieldBase {
  type: "list";
  /** Maximum number of rows. */
  max: number;
  item: ItemFields;
  default: Record<string, string>[];
  itemLabel?: string;
}

export type Field = TextField | ListField;
export type Fields = Record<string, Field>;

type FieldValue<F> = F extends ListField ? { [K in keyof F["item"]]: string }[] : string;
export type Values<F extends Fields> = { [K in keyof F]: FieldValue<F[K]> };

export interface EntryDef<F extends Fields = Fields> {
  key: string;
  label: string;
  /** Group heading in the WordPress list of pages. */
  group: string;
  /** Public URL path. Entries with a path get an SEO box in WordPress. */
  path?: string;
  /** Default search title and description, shown as the placeholder in the SEO box. */
  seo?: { title: string; description: string };
  /**
   * Reviewer sign-off. "required": publishing is blocked until a reviewer name and date are saved (legal pages).
   * "optional": the fields are shown and, when filled in, appear on the page.
   */
  review?: "required" | "optional";
  fields: F;
}

/* -------- field builders -------- */

type Opts = Partial<Pick<TextField, "help" | "max" | "section" | "optional">>;
const make = (type: TextType) => (label: string, def: string, o: Opts = {}): TextField => ({ type, label, default: def, ...o });

export const text = make("text");
export const textarea = make("textarea");
export const url = make("url");
export const image = make("image");
export const richtext = make("richtext");
export const date = make("date");

export const list = (
  label: string,
  item: ItemFields,
  def: Record<string, string>[],
  o: { max?: number; help?: string; section?: string; itemLabel?: string } = {},
): ListField => ({ type: "list", label, item, default: def, max: o.max ?? 12, help: o.help, section: o.section, itemLabel: o.itemLabel });

export const defineEntry = <F extends Fields>(def: EntryDef<F>): EntryDef<F> => def;

/** Default values of an entry, ready to render. */
export function defaultsOf<F extends Fields>(fields: F): Values<F> {
  const out: Record<string, unknown> = {};
  for (const [k, f] of Object.entries(fields)) out[k] = f.type === "list" ? f.default.map((r) => ({ ...r })) : f.default;
  return out as Values<F>;
}
