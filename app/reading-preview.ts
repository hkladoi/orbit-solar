import type { Language } from './i18n';

// An excerpt, never an invented summary. Keep complete sentences when possible.
export function readingPreview(text: string, language: Language, limit = 180): string {
  const clean = text.replace(/\s+/gu, ' ').trim();
  const first = typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter(language, { granularity: 'sentence' }).segment(clean))[0]?.segment.trim() ?? clean
    : clean;
  if (first.length <= limit) return first;
  const end = first.lastIndexOf(' ', limit);
  return `${first.slice(0, end > limit / 2 ? end : limit).trimEnd()}…`;
}
