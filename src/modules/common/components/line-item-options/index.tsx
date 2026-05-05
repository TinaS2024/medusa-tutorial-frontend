"use client";

import {useState, useEffect } from "react";
import { HttpTypes } from "@medusajs/types";
import { Text } from "@medusajs/ui";

import { getClientLanguage } from "@lib/i18n";
import { getMessages, type Lang } from "@lib/messages";

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  variantTitle?: string
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

const LineItemOptions = ({
  variant,
  variantTitle,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {

  const [lang, setLang] = useState<Lang>("de");
  const t = getMessages(lang);
  
    useEffect(() => {
        setLang(getClientLanguage());
      }, []);
    
  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis"
    >
      {t.product_variant.variant_title}: {variantTitle ?? variant?.title}
    </Text>
  )
}

export default LineItemOptions;
