"use client";

import { useState, useEffect } from "react";

import { convertToLocale } from "@lib/util/money";
import React from "react";

import { getClientLanguage } from "@lib/i18n";
import { DEFAULT_LANG } from "@lib/languages";
import { getMessages, type Lang } from "@lib/messages";

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    item_total?: number | null
    tax_total?: number | null
    shipping_total?: number | null
    discount_total?: number | null
    gift_card_total?: number | null
    currency_code: string
    shipping_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const t = getMessages(lang);
  
    useEffect(() => {
      setLang(getClientLanguage());
    }, []);

  const {
    currency_code,
    total,
    item_total,
    tax_total,
    discount_total,
    gift_card_total,
    shipping_total,
  } = totals;

    return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <span>{t.price.subtotal}</span>
          <span data-testid="cart-subtotal" data-value={item_total || 0}>
            {convertToLocale({ amount: item_total ?? 0, currency_code })}
          </span>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between">
            <span>{t.price.discount}</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_total || 0}
            >
              -{" "}
              {convertToLocale({ amount: discount_total ?? 0, currency_code })}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>{t.shipping.title}</span>
          <span data-testid="cart-shipping" data-value={shipping_total || 0}>
            {convertToLocale({ amount: shipping_total ?? 0, currency_code })}
          </span>
        </div>
        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span>{t.payment.gift_card}</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              -{" "}
              {convertToLocale({ amount: gift_card_total ?? 0, currency_code })}
            </span>
          </div>
        )}
      </div>
      <div className="h-px w-full border-b border-[var(--brand-border)] my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
        <span>{t.price.total}</span>
        <span
          className="txt-xlarge-plus"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
      <div className="flex items-center justify-between text-small-regular text-ui-fg-subtle">
        <span>{t.price.taxes_included}</span>
        <span data-testid="cart-taxes" data-value={tax_total || 0}>
          {convertToLocale({ amount: tax_total ?? 0, currency_code })}
        </span>
      </div>
      <div className="h-px w-full border-b border-[var(--brand-border)] mt-4" />
    </div>
  )
}

export default CartTotals;
