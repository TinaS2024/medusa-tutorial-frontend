import { Metadata } from "next";
import { retrieveCustomer, updateCustomer } from "@lib/data/customer";
import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";
import { notFound } from "next/navigation";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

export const metadata: Metadata = {
  title: "Designs",
  description: "Gespeicherte Designs.",
}

type CustomerDesign = {
  id: string
  created_at?: string
  design_image?: string
  variant_id?: string
  width?: number
  height?: number
  thickness?: number
  country_code?: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const DESIGNER_NEXT_URL = process.env.NEXT_PUBLIC_DESIGNER_NEXT_URL || "http://localhost:3000";

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

const resolveDesignImageUrl = (src: string | undefined) => {
  if (!src) return null;
  const decoded = safeDecodeURIComponent(src);

  if (decoded.startsWith("blob:") || decoded.startsWith("data:")) return null;
  if (decoded.startsWith("/designs/")) return `${DESIGNER_NEXT_URL}${decoded}`;
  if (decoded.startsWith("/")) return `${BACKEND_URL}${decoded}`;

  return decoded;
}

const normalizeDesigns = (raw: unknown): CustomerDesign[] => {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((d) => d && typeof d === "object" && typeof (d as any).id === "string")
    .map((d) => d as CustomerDesign)
}

async function removeDesignAction(formData: FormData) 
{
  "use server"

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const customer = await retrieveCustomer();
  if (!customer) return;

  const existingMetadata = customer.metadata && typeof customer.metadata === "object"  ? (customer.metadata as Record<string, any>)  : {};

  const existingDesigns = Array.isArray(existingMetadata.designs) ? existingMetadata.designs : [];

  const designs = existingDesigns.filter((d) => (d as any)?.id !== id);

  await updateCustomer({
    metadata: {
      ...existingMetadata,
      designs,
    },
  })
}

export default async function DesignsPage() 
{
  const lang = await getServerLanguage();
  const t = getMessages(lang);

  const customer = await retrieveCustomer();
  if (!customer) notFound();

  const designs = normalizeDesigns((customer.metadata as any)?.designs);

  return (
    <div className="w-full" data-testid="designs-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{t.profile.designs}</h1>
        <p className="text-base-regular">{t.profile.designs_info}</p>
      </div>

      {designs.length === 0 ? (
        <div className="flex flex-col gap-y-4">
          <p className="text-base-regular text-ui-fg-subtle">{t.profile.no_designs}</p>
          <div>
            <LocalizedClientLink href="/store" className="text-ui-fg-base underline">
              {t.profile.continue_shopping}
            </LocalizedClientLink>
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 small:grid-cols-2 gap-4">
          {designs.map((d) => {
            const sizeText = d.width && d.height ? `${Number(d.width)}×${Number(d.height)} mm` : null;
            const thicknessText = d.thickness != null ? `${Number(d.thickness)} mm` : null;
            const metaText = [sizeText, thicknessText].filter(Boolean).join(" · ") || null;

            return (
              <li
                key={d.id}
                className="border border-gray-200 rounded-lg p-4 flex flex-col gap-y-4"
              >
                {(() => {
                  const src = resolveDesignImageUrl(d.design_image);

                  if (src) {
                    return (
                      <div className="w-full overflow-hidden rounded-md bg-gray-50">
                        <img
                          src={src}
                          alt=""
                          className="w-full h-auto object-contain"
                          loading="lazy"
                        />
                      </div>
                    );
                  }

                  return (
                    <div className="w-full aspect-square rounded-md bg-gray-50 flex items-center justify-center">
                      {d.design_image ? (
                        <span className="text-small-regular text-ui-fg-subtle break-all px-4">
                          {String(d.design_image)}
                        </span>
                      ) : null}
                    </div>
                  );
                })()}
                <div className="flex items-center justify-between gap-x-4">
                  <div className="text-small-regular text-ui-fg-subtle">
                    {metaText ?? ""}
                  </div>

                  <form action={removeDesignAction}>
                    <input type="hidden" name="id" value={d.id} />
                    <button
                      type="submit"
                      className="text-small-regular text-ui-fg-subtle hover:text-ui-fg-base"
                    >
                      {t.function.delete}
                    </button>
                  </form>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}