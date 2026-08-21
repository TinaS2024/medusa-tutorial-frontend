"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import SortProducts, { SortOptions } from "./sort-products";
import ProductFilters, { FilterGroup } from "./product-filters";

type RefinementListProps = {
  sortBy: SortOptions
  filterGroups?: FilterGroup[]
  search?: boolean
  'data-testid'?: string
}

const RefinementList = ({ sortBy, filterGroups, 'data-testid': dataTestId }: RefinementListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      // Neue Sortierung heißt neue Reihenfolge – die alte Seitenzahl passt
      // dann nicht mehr.
      params.delete("page");

      return params.toString();
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value);
    router.push(`${pathname}?${query}`);
  }

  return (
    <div className="flex flex-col gap-y-8 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:max-w-[250px] small:ml-[1.675rem]">
      <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
      {filterGroups && <ProductFilters groups={filterGroups} />}
    </div>
  )
}

export default RefinementList;
