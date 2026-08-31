import { Metadata } from "next";
import { retrieveLegal } from "@lib/data/legal";
import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLanguage();
  return { title: getMessages(lang).imprint.title};
}


export default async function Impressum() 
{
  const lang = await getServerLanguage();
  const t = getMessages(lang).imprint;
  const legal = await retrieveLegal();

  const lines: { label: string; value: string | null | undefined }[] = [
    { label: t.company, value: legal?.imprint_company },
    { label: t.address, value: legal?.imprint_address },
    { label: t.represented_by, value: legal?.imprint_represented_by },
    { label: t.phone, value: legal?.imprint_phone },
    { label: t.email, value: legal?.imprint_email },
    { label: t.register, value: legal?.imprint_register },
    { label: t.vat_id, value: legal?.imprint_vat_id },
  ].filter((z) => !!z.value)

  return (
    <div className="content-container py-12">
      <h1 className="text-2xl-semi mb-8">{t.title}</h1>

      {lines.length === 0 && !legal?.imprint_extra ? (
        <p className="text-base-regular">{t.empty}</p>
      ) : (
        <div className="max-w-2xl flex flex-col gap-y-6">
          {lines.map((z) => (
            <div key={z.label}>
              <div className="text-small-semi mb-1">{z.label}</div>
              {/* Mehrzeilige Eingaben wie die Anschrift sollen ihre Umbrüche behalten */}
              <div className="text-base-regular whitespace-pre-line">{z.value}</div>
            </div>
          ))}

          {legal?.imprint_extra && (
            <div className="text-base-regular whitespace-pre-line pt-4 border-t border-[var(--brand-border)]">
              {legal.imprint_extra}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
