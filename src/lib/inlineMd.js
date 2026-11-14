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
