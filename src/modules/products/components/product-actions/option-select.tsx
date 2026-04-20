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
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
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
    Design: "design",
  };

  const trimmedTitle = title.trim();
  const propertyKey = titleKeyMap[trimmedTitle];
  const localizedTitle =
    propertyKey && (t as any).product_properties
      ? (t as any).product_properties[propertyKey] ?? title
      : title;


  
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
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect;
