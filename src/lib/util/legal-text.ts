export type LegalTexts = Record<string, Record<string, string>>

/** Text in der gewünschten Sprache, sonst die deutsche Fassung. */
export const legalText = (
  texts: LegalTexts,
  sprache: string,
  dokument: "terms" | "privacy" | "withdrawal"
): string | null => texts?.[sprache]?.[dokument] || texts?.de?.[dokument] || null;
