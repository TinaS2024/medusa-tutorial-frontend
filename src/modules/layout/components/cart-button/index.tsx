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

  const localizedProducts = cart?.region_id && productIds.length ? await listProducts({
          regionId: cart.region_id,
           queryParams: {
            id: productIds,
            limit: productIds.length,
          },
        }).then(({ response }) => response.products)
      : []

  const productTitles = Object.fromEntries(
    localizedProducts
      .map((p) => [p.id, p.title] as const)
      .filter((entry) => Boolean(entry[0] && entry[1]))
  )

  const variantTitles = Object.fromEntries(
    localizedProducts
      .flatMap((p) => {
        const variants = (p as any).variants as any[] | undefined

        return (variants ?? []).map((v) => {
          const computed = Array.isArray(v.options)
            ? v.options
                .map((o: any) => o?.value)
                .filter(Boolean)
                .join(" / ")
            : undefined;

          return [v.id, v.title ?? computed] as const;
        })
      })
      .filter((entry) => Boolean(entry[0] && entry[1]))
  )

  return (
    <CartDropdown
      cart={cart}
      productTitles={productTitles}
      variantTitles={variantTitles}
    />
  )
}
