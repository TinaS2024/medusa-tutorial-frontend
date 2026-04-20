import { Metadata } from "next";

import InteractiveLink from "@modules/common/components/interactive-link";

import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";

export const metadata: Metadata = {
  title: "404",
  description: "Etwas ging schief",
}

export default async function NotFound() 
{
  const lang = await getServerLanguage();
  const t = getMessages(lang);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">{t.error.page_not_found}</h1>
      <p className="text-small-regular text-ui-fg-base">
       {t.error.no_cart}
      </p>
      <InteractiveLink href="/">{t.error.back_to_home}</InteractiveLink>
    </div>
  )
}
