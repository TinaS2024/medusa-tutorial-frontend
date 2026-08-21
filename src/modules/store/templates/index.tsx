
import { Suspense } from "react";

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid";
import RefinementList from "@modules/store/components/refinement-list";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";

import PaginatedProducts from "./paginated-products";
import ProductSearch from "@modules/store/components/productsearch";

import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";


const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  q,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  q?: string
}) => {

  const lang = await getServerLanguage();
  const t = getMessages(lang);

  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} />
      <div className="w-full">
        <div className="mb-8 flex flex-col small:flex-row small: items-center small:justify-between gap-4">
          <h1 data-testid="store-page-title" className="text-2xl-semi">{t.product.all_products}</h1>
          <ProductSearch />
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            q={q}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate;
