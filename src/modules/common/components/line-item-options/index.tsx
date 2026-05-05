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

    const titleKeyMap: Record<string, string> = {
    Kissenfarbe: "cushion_color",
    Prägeposition: "embossing_posiiton",
    Hintergrundfarbe: "background_color",
    Gravurfarbe: "engraving_color",
    Stiftfarbe: "pen_color",
    Design: "design",
  }

  const productOptions = (variant as any)?.product?.options as any[] | undefined
  const optionTitleById = new Map(
    (productOptions ?? [])
      .map((o) => [o?.id, o?.title] as const)
      .filter((pair) => Boolean(pair[0] && pair[1]))
  )

  const selectedOptions = ((variant as any)?.options as any[] | undefined) ?? []

  const colorTranslations = ((t as any).colors ?? (t as any).product_color) || {}

  const embossingTranslations = (t as any).embossing_position || {}

  const lines = selectedOptions
    .map((o) => {
      const rawTitle =
        optionTitleById.get(o?.option_id) ?? o?.title ?? o?.option?.title
      const trimmedTitle = typeof rawTitle === "string" ? rawTitle.trim() : undefined
      const key = trimmedTitle ? titleKeyMap[trimmedTitle] : undefined

      const label =
        key && (t as any).product_properties
          ? (t as any).product_properties[key] ?? trimmedTitle ?? rawTitle
          : trimmedTitle ?? rawTitle

      const rawValue = o?.value
      const valueStr = rawValue == null ? "" : String(rawValue)
      const localizedValue =
        key && ["cushion_color", "background_color", "engraving_color", "pen_color"].includes(key)
          ? colorTranslations[valueStr] ?? valueStr
          : key === "embossing_posiiton"
            ? embossingTranslations[valueStr] ?? valueStr
            : valueStr

      return label && localizedValue ? { key: o?.id ?? o?.option_id ?? label, label: String(label), value: localizedValue } : null
    })
    .filter(Boolean) as { key: any; label: string; value: string }[]
    
  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block txt-medium text-ui-fg-subtle w-full"
    >
      {lines.length ? (
        lines.map((l) => (
          <span key={String(l.key)} className="block">
            {l.label}: {l.value}
          </span>
        ))
      ) : (
        <span>
          {t.product_variant.variant_title}: {variantTitle ?? variant?.title}
        </span>
      )}
    </Text>
  )
}

export default LineItemOptions;
