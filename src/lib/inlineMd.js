// Tiny, safe inline formatter for our own content: escapes HTML first,
// then renders `code` and **bold**. (marked would pass raw "<T>" through as HTML.)
export function inlineMd(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
}

/**
 * Block formatter for lesson text: blank line = new paragraph, lines starting
 * with "- " = bullet list, "1. " = numbered list. Inline parts go through inlineMd.
 * @returns {{ type: 'p' | 'ul' | 'ol', html?: string, items?: string[] }[]}
 */
export function blocksMd(s = '') {
  return String(s)
    .trim()
    .split(/\n\s*\n/)
    .map((chunk) => {
      const lines = chunk.split('\n').filter((l) => l.trim())
      if (lines.every((l) => /^\s*-\s+/.test(l)))
        return { type: 'ul', items: lines.map((l) => inlineMd(l.replace(/^\s*-\s+/, ''))) }
      if (lines.every((l) => /^\s*\d+\.\s+/.test(l)))
        return { type: 'ol', items: lines.map((l) => inlineMd(l.replace(/^\s*\d+\.\s+/, ''))) }
      return { type: 'p', html: lines.map(inlineMd).join('<br>') }
    })
}
