// ============================================================
// ALFA DARK JOYERÍA — Slug Utility
// ============================================================

export function generateSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function generateUniqueSlug(text: string): string {
  const base = generateSlug(text);
  const suffix = Date.now().toString(36).slice(-4);
  return `${base}-${suffix}`;
}
