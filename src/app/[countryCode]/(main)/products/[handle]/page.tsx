import { Metadata } from "next";
import { notFound } from "next/navigation";
import { listProducts } from "@lib/data/products";
import { getRegion, listRegions } from "@lib/data/regions";
import ProductTemplate from "@modules/products/templates";
import { getBundleProduct } from "@lib/data/products";

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() 
{
    return [];
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { handle } = params;
  const region = await getRegion(params.countryCode);

  if (!region) 
  {
    notFound();
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) 
  {
    notFound();
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) 
{
  const params = await props.params;
  const region = await getRegion(params.countryCode);

  if (!region) 
  {
    notFound();
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { 
      handle: [params.handle],
      fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+options,+images,+variants.images,*bundle",
      expand: "variants,options, variants.prices, variants.options,images,variants.images",
   },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) 
  {
    notFound();
  }

  const bundleProduct = pricedProduct.bundle ? await getBundleProduct(pricedProduct.bundle.id,
      {
        currency_code: region.currency_code,
        region_id: region.id,
      }) : null

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
      bundle={bundleProduct?.bundle_product}
    />
  )
}
