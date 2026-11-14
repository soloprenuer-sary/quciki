export const CONTACT_TOPICS = [
  { value: "correction", label: "Correction to a calculator or guide" },
  { value: "feature", label: "Suggest a calculator or feature" },
  { value: "privacy", label: "Privacy or data request" },
  { value: "advertising", label: "Advertising or partnership" },
  { value: "legal", label: "Legal or copyright notice" },
  { value: "other", label: "Something else" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

export function isContactTopic(v: unknown): v is ContactTopic {
  return CONTACT_TOPICS.some((t) => t.value === v);
}

export function topicLabel(v: ContactTopic): string {
  return CONTACT_TOPICS.find((t) => t.value === v)?.label ?? v;
}
