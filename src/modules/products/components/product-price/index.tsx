import { clx } from "@medusajs/ui";
import { HttpTypes } from "@medusajs/types";
import { useEffect, useMemo, useState } from "react";
import { getCustomVariantPrice } from "../../../../lib/data/products";
import { convertToLocale } from "../../../../lib/util/money";

import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";


export default function ProductPrice({
  product,
  variant,
  metadata,
  region,
  className
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  metadata?: Record<string, any>
  region: HttpTypes.StoreRegion
  className?: string
}) 
{
  const [price, setPrice] = useState(0);

  const [lang, setLang] = useState<"de" | "en" | "fr" | "nl">("de");
  const t = getMessages(lang);

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);


  useEffect(() => {
    if (!variant || (product.metadata?.is_personalized && ( !metadata?.height || !metadata?.width ))) {

      return;
    }


    getCustomVariantPrice({ variant_id: variant.id, region_id: region.id, metadata,})

      .then((price) => { setPrice(price) })

      .catch((error) => {

        console.error("Error fetching custom variant price:", error)

      })

  }, [metadata, variant]);


  const displayPrice = useMemo(() => {

    return convertToLocale({ amount: price, currency_code: region.currency_code, })

  }, [price])


  return (

      <div className="flex flex-col text-ui-fg-base">
      <span className={clx("text-xl-semi", className)}>
        {price > 0 && <span data-testid="product-price" data-value={displayPrice} >
          {displayPrice}
        </span>}
      </span>

      {/* Pflichtangabe nach Preisangabenverordnung: Steuer und Versandkosten */}
      {price > 0 && (
        <span className="text-small-regular text-ui-fg-subtle mt-1">
          {t.price.tax_note}
        </span>
      )}
    </div>

  )
}