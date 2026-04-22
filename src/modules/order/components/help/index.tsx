"use client";

import { useState, useEffect } from "react";

import { Heading } from "@medusajs/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import React from "react";

import { getClientLanguage } from "@lib/i18n";
import { getMessages, type Lang } from "@lib/messages";

const Help = () => {
  
  const [lang, setLang] = useState<Lang>("de");
  const t = getMessages(lang);

  useEffect(() => {
      setLang(getClientLanguage());
    }, []);
  

  return (
    <div className="mt-6">
      <Heading className="text-base-semi">{t.login_shop.need_help}</Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink href="/contact">{t.shipping.contact}</LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/contact">
              {t.login_shop.return_exchanges}
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help;
