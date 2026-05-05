import { retrieveCart } from "@lib/data/cart";
import { retrieveCustomer } from "@lib/data/customer";
import CartTemplate from "@modules/cart/templates";
import { listProducts } from "@lib/data/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Warenkorb",
  description: "zeigt ihren Warenkorb",
}

export default async function Cart() 
{
  const cart = await retrieveCart().catch((error) => {
    console.error(error);
    return notFound();
  })

  const customer = await retrieveCustomer();

   const productIds = Array.from(
    new Set(
      (cart?.items ?? [])
        .map((i) => i.variant?.product?.id)
        .filter(Boolean) as string[]
    )
  )

  const productTitles = cart?.region_id && productIds.length ? await listProducts({regionId: cart.region_id,  queryParams: { id: productIds, limit: productIds.length },
        }).then(({ response }) =>
          Object.fromEntries(
            response.products
              .map((p) => [p.id, p.title] as const)
              .filter((entry) => Boolean(entry[0] && entry[1]))
          )
        )
      : {}

  return (
    <CartTemplate cart={cart} customer={customer} productTitles={productTitles} />
  )
}
