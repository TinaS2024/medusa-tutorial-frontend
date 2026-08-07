/**
 * Rückfall für den Dashboard-Bereich.
 *
 * Next.js verlangt für jeden parallelen Bereich eine Seite – auch dann, wenn
 * für die aufgerufene Adresse bereits eine passende page.tsx existiert. Fehlt
 * sie, greift die NotFound-Grenze und die ganze Seite gilt als nicht gefunden.
 *
 * Gibt bewusst nichts aus: Wo eine passende Seite existiert, wird diese
 * angezeigt; wo keine existiert, soll der Bereich leer bleiben.
 */
export default function DashboardDefault() 
{
  return null
}
