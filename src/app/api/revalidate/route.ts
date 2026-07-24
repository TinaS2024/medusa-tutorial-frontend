import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/**
 * On-Demand-Revalidation. Das Backend ruft diese Route (mit Secret) auf, wenn
 * sich Produkte ändern, und leert damit gezielt den Produkt-/Bundle-Cache –
 * ohne .next zu löschen oder das Storefront neu zu starten.
 *
 * POST /api/revalidate
 *   Header: x-revalidate-secret: <REVALIDATE_SECRET>
 *   Body (optional): { "tags": ["products", "bundles"] }
 */
export async function POST(req: NextRequest) 
{
  const secret = req.headers.get("x-revalidate-secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid revalidate secret" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}));
  const tags: string[] = Array.isArray(body?.tags) && body.tags.length > 0 ? body.tags : ["products", "bundles"];

  for (const tag of tags) 
{
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: true, tags });
}
