import { NextRequest } from "next/server";
import { getAuthHeaders } from "@lib/data/cookies";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

/**
 * Reicht das Rechnungs-PDF vom Backend an den Browser weiter.
 *
 * Nötig, weil Storefront und Backend unter verschiedenen Adressen laufen:
 * Ein direkter Link aus der Seite würde weder das Anmelde-Token noch den
 * Publishable Key mitschicken. Beides passiert hier auf dem Server – das
 * Token verlässt ihn nie.
 *
 * Geprüft wird trotzdem im Backend: Diese Route reicht nur weiter.
 */
export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const headers: Record<string, string> = {
    ...((await getAuthHeaders()) as Record<string, string>),
  };

  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  if (key) headers["x-publishable-api-key"] = key;

  const upstream = await fetch(`${BACKEND_URL}/store/invoices/${id}/pdf`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!upstream.ok) {
    return new Response("Nicht gefunden", { status: 404 });
  }

  const buffer = await upstream.arrayBuffer();

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        upstream.headers.get("content-disposition") ??
        'inline; filename="rechnung.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
