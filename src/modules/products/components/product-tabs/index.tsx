"use client";

import Back from "@modules/common/icons/back";
import FastDelivery from "@modules/common/icons/fast-delivery";
import Refresh from "@modules/common/icons/refresh";

import Accordion from "./accordion";
import { HttpTypes } from "@medusajs/types";

import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const lang = getClientLanguage();
  const t = getMessages(lang);

  const tabs = [
    {
      label: t.product.info,
      component: <ProductInfoTab product={product} />,
    },
    {
      label: t.product.shipping_and_returns,
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const lang = getClientLanguage();
  const t = getMessages(lang);
  
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">{t.product.material}</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">{t.product.origin_country}</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">{t.product.product_type}</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">{t.product.weight}</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">{t.product.size}</span>
            <p>
              {(() => {
                const dimensions = [];
                if (product.length) dimensions.push(`${product.length} ${t.product.lenght}`);
                if (product.width) dimensions.push(`${product.width} ${t.product.width}`);
                if (product.height) dimensions.push(`${product.height} ${t.product.height}`);
                return dimensions.length > 0 ? dimensions.join(" x ") : "-";
              })()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  const lang = getClientLanguage();
  const t = getMessages(lang);

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">{t.product.quick_delivery}</span>
            <p className="max-w-sm">
            {t.product.info_delivery}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">{t.product.product_exchange}</span>
            <p className="max-w-sm">
            {t.product.product_exchange_info}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">{t.product.return}</span>
            <p className="max-w-sm">
            {t.product.return_info}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs;
