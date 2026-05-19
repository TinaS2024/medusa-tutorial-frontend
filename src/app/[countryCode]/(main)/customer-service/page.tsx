import type { Metadata } from "next";

import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";
import InteractiveLink from "@modules/common/components/interactive-link";

export const metadata: Metadata = {
  title: "Customer Service",
  description: "Help, FAQs and contact information.",
}

export default async function CustomerService() 
{
    const lang = await getServerLanguage();
    const t = await getMessages(lang);


    return (
    <div className="content-container py-12 small:py-24">
      <h1 className="text-2xl-semi text-ui-fg-base">{t.service.title}</h1>
      <p className="text-small-regular text-ui-fg-base mt-2">{t.service.intro}</p>

      <div className="mt-10 grid grid-cols-1 small:grid-cols-3 gap-6">
        {t.service.blocks.map((b) => (
          <div
            key={b.title}
            className="border border-ui-border-base rounded-lg p-6 bg-white"
          >
            <h2 className="text-base-semi text-ui-fg-base">{b.title}</h2>
            <p className="text-small-regular text-ui-fg-base mt-2">{b.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-6 flex-wrap">
        <InteractiveLink href="/">{t.error.back_to_home}</InteractiveLink>
        <InteractiveLink href="/account">{t.nav.account}</InteractiveLink>
      </div>
    </div>
  );
}