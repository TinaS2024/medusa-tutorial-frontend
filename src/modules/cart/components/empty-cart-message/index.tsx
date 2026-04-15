"use client";

import  { useEffect, useState } from "react";

import { Heading, Text } from "@medusajs/ui";

import InteractiveLink from "@modules/common/components/interactive-link";

import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";

const EmptyCartMessage = () => {
  const [lang, setLang] = useState<"de" | "en" | "fr" | "nl">("de");

   useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  const t = getMessages(lang);

  return (
    <div className="py-48 px-2 flex flex-col justify-center items-start" data-testid="empty-cart-message">
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        {t.cart.empty.title}
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        {t.cart.empty.description}
      </Text>
      <div>
        <InteractiveLink href="/store">{t.cart.empty.cta}</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage;
