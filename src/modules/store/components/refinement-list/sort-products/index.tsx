"use client";

import { useEffect, useState } from "react";

import FilterRadioGroup from "@modules/common/components/filter-radio-group";

import { getClientLanguage } from "@lib/i18n";
import { getMessages, type Lang } from "@lib/messages";

export type SortOptions = "price_asc" | "price_desc" | "created_at";

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const [lang, setLang] = useState<Lang>("de")
  const t = getMessages(lang)

const sortOptions = [
  {
    value: "created_at",
    label: t?.sort_product?.newest ?? "Newest",
  },
  {
    value: "price_asc",
    label: t?.sort_product?.price_highest ?? "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: t?.sort_product?.price_lowest ?? "Price: High -> Low",
  },
];

 useEffect(() => {
    setLang(getClientLanguage());
  }, []);


  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }


  return (
    <FilterRadioGroup
      title={t?.sort_product?.sort_by ?? "Sort by"}
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts;
