/** Splits markdown into the intro block and one block per "## heading" section. */
export function splitSections(md: string): string[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: string[][] = [[]];
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) inFence = !inFence;
    if (!inFence && /^##\s+/.test(line) && blocks[blocks.length - 1].length > 0) blocks.push([]);
    blocks[blocks.length - 1].push(line);
  }
  return blocks.map((b) => b.join("\n").trim()).filter(Boolean);
}
