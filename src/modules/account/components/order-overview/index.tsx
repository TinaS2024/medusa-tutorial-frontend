"use client";

import { Button } from "@medusajs/ui";

import OrderCard from "../order-card";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { HttpTypes } from "@medusajs/types";

import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {

    const lang = getClientLanguage();
    const t = getMessages(lang);

  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-y-4"
      data-testid="no-orders-container"
    >
      <h2 className="text-large-semi"> {t.profile.nothing_to_see}</h2>
      <p className="text-base-regular">
        {t.profile.no_current_orders}
      </p>
      <div className="mt-4">
        <LocalizedClientLink href="/" passHref>
          <Button data-testid="continue-shopping-button">
            {t.profile.continue_shopping}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview;
