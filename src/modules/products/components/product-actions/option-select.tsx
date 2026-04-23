import { HttpTypes } from "@medusajs/types";
import { clx } from "@medusajs/ui";
import React from "react";
import { getClientLanguage } from "@lib/i18n";
import { getMessages, type Lang } from "@lib/messages";

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  technicalKey?: string
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  technicalKey,
  "data-testid": dataTestId,
  disabled,
}) => {
  const lang = getClientLanguage() as Lang;
  const t = getMessages(lang);

  const titleKeyMap: Record<string, string> = {
    Kissenfarbe: "cushion_color",
    Prägeposition: "embossing_posiiton",
    Hintergrundfarbe: "background_color",
    Gravurfarbe: "engraving_color",
    Stiftfarbe: "pen_color",
    Design: "design",
  };

  const trimmedTitle = title.trim();
  const propertyKeyFromTitle = titleKeyMap[trimmedTitle];

  const propertyKeyFromTechnicalKey = technicalKey === "pencolor" ? "pen_color" : technicalKey;

  const propertyKey = propertyKeyFromTitle ?? propertyKeyFromTechnicalKey;
  const localizedTitle = propertyKey && (t as any).product_properties ? (t as any).product_properties[propertyKey] ?? title : title;

  const colorTranslationKeys = [
    "cushion_color",
    "background_color",
    "engraving_color",
    "pen_color",
  ];

  const colorTechnicalKeys = [
    "cushion_color",
    "background_color",
    "engraving_color",
    "pencolor",
  ];

  const isColorOption = (propertyKey && colorTranslationKeys.includes(propertyKey)) || (technicalKey && colorTechnicalKeys.includes(technicalKey));

  const colorTranslations = ((t as any).colors ?? (t as any).product_color) || {};
  
  const filteredOptions = (option.values ?? []).map((v) => v.value);

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">{t.product_properties.choose} {localizedTitle} {t.product_properties.out}</span>
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button type="button"
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded p-2 flex-1 ",
                {
                  "border-ui-border-interactive": v === current,
                  "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                    v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {isColorOption ? colorTranslations[v.toLowerCase()] ?? v   : v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect;
