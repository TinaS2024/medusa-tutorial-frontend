import { Metadata } from "next";

import OrderOverview from "@modules/account/components/order-overview";
import { notFound } from "next/navigation";
import { listOrders } from "@lib/data/orders";
import Divider from "@modules/common/components/divider";
import TransferRequestForm from "@modules/account/components/transfer-request-form";

import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";

export const metadata: Metadata = {
  title: "Bestellungen",
  description: "Übersicht Ihrer bisherigen Bestellungen.",
}

export default async function Orders() 
{
  const lang = await getServerLanguage();
  const t = getMessages(lang);

  const orders = await listOrders();

  if (!orders) 
  {
    notFound();
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{t.profile.orders}</h1>
        <p className="text-base-regular">
          {t.profile.order_info}
        </p>
      </div>
      <div>
        <OrderOverview orders={orders} />
        <Divider className="my-16" />
        <TransferRequestForm />
      </div>
    </div>
  )
}
