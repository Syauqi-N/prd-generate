export function exportMarkdown(content: string, title: string): string {
  return content;
}

export function getMarkdownFilename(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + ".md"
  );
}
