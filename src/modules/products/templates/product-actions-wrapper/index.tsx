import { listProducts } from "@lib/data/products";
import { HttpTypes } from "@medusajs/types";
import ProductActions from "@modules/products/components/product-actions";
import { BundleProduct } from "@lib/data/products";
import BundleActions from "@modules/products/components/bundle-actions";

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  handle,
  region,
  bundle,
}: {
  id: string
  handle?: string
  region: HttpTypes.StoreRegion
  bundle?: BundleProduct
}) {

 const { response } = await listProducts({
    queryParams: { 
      handle: handle, 
      expand: "variants,options,variants.prices,variants.options",
    },
    regionId: region.id,

  })


  const product = response.products.find((p) => p.id === id)


  if (!product) {
    return null
  }

  if(bundle)
  {
    return <BundleActions bundle={bundle}/>
  }

  return <ProductActions product={product} region={region} />
}
