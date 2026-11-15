/**
 * Renders HTML that has already been sanitized in lib/wp.ts (allow-list of tags, attributes and URL schemes).
 * Never pass unsanitized HTML to this component.
 */
export function RichHtml({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
