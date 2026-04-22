import { listProducts } from "@lib/data/products";
import { HttpTypes } from "@medusajs/types";
import { Text } from "@medusajs/ui";

import InteractiveLink from "@modules/common/components/interactive-link";
import ProductPreview from "@modules/products/components/product-preview";

import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const lang = await getServerLanguage();
  const t = getMessages(lang);

  const queryParams: HttpTypes.FindParams &
    HttpTypes.StoreProductParams & {
      collection_id?: string[]
    } = {
    collection_id: [collection.id],
    fields: "*variants.calculated_price",
  }

  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams,
  })

  if (!pricedProducts) {
    return null;
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          {t.product.view_all}
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
