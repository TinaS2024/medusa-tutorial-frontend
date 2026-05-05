import { retrieveCart } from "@lib/data/cart";
import { listProducts } from "@lib/data/products";
import CartDropdown from "../cart-dropdown";

export default async function CartButton() 
{
  const cart = await retrieveCart().catch(() => null)

  const productIds = Array.from(
    new Set(
      (cart?.items ?? [])
        .map((i) => i.variant?.product?.id)
        .filter(Boolean) as string[]
    )
  )

  const productTitles =
    cart?.region_id && productIds.length
      ? await listProducts({
          regionId: cart.region_id,
          queryParams: { id: productIds, limit: productIds.length },
        }).then(({ response }) =>
          Object.fromEntries(
            response.products
              .map((p) => [p.id, p.title] as const)
              .filter((entry) => Boolean(entry[0] && entry[1]))
          )
        )
      : {}

  return <CartDropdown cart={cart} productTitles={productTitles} />
}
