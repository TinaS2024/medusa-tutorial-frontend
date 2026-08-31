export type LegalTexts = Record<string, Record<string, string>>

/** Text in der gewünschten Sprache, sonst die deutsche Fassung. */
export const legalText = (
  texts: LegalTexts,
  sprache: string,
  document: "terms" | "privacy" | "withdrawal" | "shipping"
): string | null => texts?.[sprache]?.[document] || texts?.de?.[document] || null;
