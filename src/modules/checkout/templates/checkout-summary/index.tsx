import { Heading } from "@medusajs/ui";

import ItemsPreviewTemplate from "@modules/cart/templates/preview";
import DiscountCode from "@modules/checkout/components/discount-code";
import CartTotals from "@modules/common/components/cart-totals";
import Divider from "@modules/common/components/divider";

import { listProducts } from "@lib/data/products";
import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";

const CheckoutSummary = async ({ cart }: { cart: any }) => {

  const lang = await getServerLanguage();
  const t = getMessages(lang);

  const productIds = Array.from(
    new Set(
      (cart?.items ?? [])
        .map((i: any) => i?.variant?.product?.id)
        .filter(Boolean) as string[]
    )
  )

  const localizedProducts =
    cart?.region_id && productIds.length
      ? await listProducts({
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
            : undefined

          return [v.id, v.title ?? computed] as const
        })
      })
      .filter((entry) => Boolean(entry[0] && entry[1]))
  )

  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
      <div className="w-full bg-white flex flex-col">
        <Divider className="my-6 small:hidden" />
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular items-baseline"
        >
          {t.cart.empty.in_cart}
        </Heading>
        <Divider className="my-6" />
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate cart={cart} productTitles={productTitles} variantTitles={variantTitles} />
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
