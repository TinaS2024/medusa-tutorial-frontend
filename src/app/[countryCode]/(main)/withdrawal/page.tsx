import { retrieveLegalTexts } from "@lib/data/legal";
import { legalText } from "@lib/util/legal-text";

import { Metadata } from "next";
import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";
import Rechtstext from "@modules/legal/components/rechtstext";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLanguage();
  return { title: getMessages(lang).imprint.withdrawal };
}

export default async function Withdrawal() {
  const lang = await getServerLanguage();
  const t = getMessages(lang).imprint;
  const texts = await retrieveLegalTexts();
  const html = legalText(texts, lang, "terms");

  return (
    <div className="content-container py-12">
      <h1 className="text-2xl-semi mb-8">{t.withdrawal}</h1>
      {html ? <Rechtstext html={html} /> : <p className="text-base-regular">{t.empty}</p>}
    </div>
  )
}
