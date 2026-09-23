import { NextRequest, NextResponse } from "next/server";

import { updateCartLocale } from "@lib/data/cart";

/**
 * Setzt die Sprache des Warenkorbs – für den Sprachumschalter.
 *
 * Absichtlich eine Route statt eines direkten Aufrufs der Serveraktion:
 * Eine Serveraktion mit revalidateTag schickt der Seite sofort neuen Inhalt
 * hinterher. Lädt der Umschalter währenddessen neu, bricht dieser Datenstrom
 * ab – Firefox meldet "Error in input stream" und Next.js zeigt kurz seine
 * Fehlerseite. Eine Route erneuert den Zwischenspeicher, ohne etwas
 * nachzuschicken.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const locale = typeof body?.locale === "string" ? body.locale : "";

  if (locale) {
    await updateCartLocale(locale);
  }

  return NextResponse.json({ ok: true });
}
