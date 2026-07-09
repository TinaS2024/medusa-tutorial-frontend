"use client";

import { useState, useEffect } from "react";

import { HttpTypes } from "@medusajs/types";
import { Text } from "@medusajs/ui";

import { getClientLanguage } from "@lib/i18n";
import { getMessages, type Lang } from "@lib/messages";
import { sdk } from "@lib/config";

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {

  const [lang, setLang] = useState<Lang>("de");
  const t = getMessages(lang);

  const [prodStatus, setProdStatus] = useState<string | null>(null);

  useEffect(() => {
    sdk.client
      .fetch<{ status: string }>(`/store/order-production/${order.id}`, { method: "GET" })
      .then((r) => setProdStatus(r.status))
      .catch(() => {});
  }, [order.id]);
  
  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div>
      <Text>
        {t.order.send_order_details_1} 
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        {t.order.send_order_details_2}
        .
      </Text>
      <Text className="mt-2">
        {t.order.order_date}: {" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toDateString()}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        {t.order.order_number}: <span data-testid="order-id">{order.display_id}</span>
      </Text>

      {prodStatus && (
        <Text className="mt-4">
          {t.order.production_status}: {" "}
          <span className="text-ui-fg-interactive font-semibold" data-testid="order-production-status">
            {(t.order as any).production_statuses?.[prodStatus] ?? prodStatus}
          </span>
        </Text>
      )}
    </div>
  )
}

export default OrderDetails;
