import { Suspense } from "react";

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid";
import RefinementList from "@modules/store/components/refinement-list";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import type { FilterGroup, FilterOption } from "@modules/store/components/refinement-list/product-filters";

import PaginatedProducts from "./paginated-products";
import ProductSearch from "@modules/store/components/productsearch";

import { listCategories } from "@lib/data/categories";
import { listCollections } from "@lib/data/collections";
import { listProductTags, listProductTypes } from "@lib/data/product-filters";

import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";

// Kommagetrennte Auswahl aus der Adresszeile lesen: "a,b" -> ["a","b"]
const valuesFromParam = (value?: string): string[] =>
  value ? value.split(",").map((w) => w.trim()).filter(Boolean) : []

// Steht eine Auswahl in der Adresszeile, für die es keinen Datensatz gibt
// (getippte oder gelöschte Handles), darf NICHT das ganze Sortiment erscheinen.
// Eine nicht existierende ID liefert stattdessen null Treffer.
const __no_match__ = "__keine_uebereinstimmung__"

const idsOrEmpty = (chosen: string[], ids: string[]): string[] | undefined => {
  if (!chosen.length) return undefined;
  return ids.length ? ids : [__no_match__];
}

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  q,
  cat,
  col,
  tag,
  type,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  q?: string
  cat?: string
  col?: string
  tag?: string
  type?: string
}) => {

  const lang = await getServerLanguage();
  const t = getMessages(lang);

  const pageNumber = page ? parseInt(page) : 1;
  const sort = sortBy || "created_at";

  // Filterwerte aus den vorhandenen Produktdaten. Fällt eine Quelle aus,
  // entfällt nur die jeweilige Gruppe.
  const [categories, collections, tags, productTypes] = await Promise.all([
    listCategories().catch(() => []),
    listCollections({ limit: "100" }).then((r) => r.collections).catch(() => []),
    listProductTags(),
    listProductTypes(),
  ])

  // --- Kategorien: Baum aus der flachen Liste bauen (nicht auf mitgelieferte
  // category_children verlassen, die reichen nur eine Ebene tief) ---
  const childrenOf = (parentId: string | null) =>
    categories.filter((k) => (k.parent_category?.id ?? null) === parentId)

  const categoryOptions: FilterOption[] = [];

  const collectOptions = (list: typeof categories, level: number) => {
    if (level > 3) return;
    list.forEach((k) => {
      categoryOptions.push({ value: k.handle, label: k.name, level: level });
      collectOptions(childrenOf(k.id), level + 1);
    })
  }

  collectOptions(childrenOf(null), 0);

  const selectedCategories = valuesFromParam(cat);

  // Wer eine Oberkategorie anhakt, erwartet auch deren Unterkategorien.
  const categoryIds: string[] = [];
  const addWithDescendants = (k: (typeof categories)[number], depth = 0) => {
    if (depth > 3 || categoryIds.indexOf(k.id) !== -1) return;
    categoryIds.push(k.id);
    childrenOf(k.id).forEach((child) => addWithDescendants(child, depth + 1));
  }
  categories
    .filter((k) => selectedCategories.includes(k.handle))
    .forEach((k) => addWithDescendants(k))


  // --- Kollektionen, Schlagwörter, Produktarten ---
  const selectedCollections = valuesFromParam(col);
  const collectionIds = collections
    .filter((c) => selectedCollections.includes(c.handle))
    .map((c) => c.id);

  const selectedTags = valuesFromParam(tag);
  const tagIds = tags
    .filter((s) => s.value && selectedTags.includes(s.value))
    .map((s) => s.id);

  const selectedTypes = valuesFromParam(type);
  const typeIds = productTypes
    .filter((a) => a.value && selectedTypes.includes(a.value))
    .map((a) => a.id);

  const filterGroups: FilterGroup[] = [
    {
      param: "cat",
      titleKey: "categories",
      options: categoryOptions,
    },
    {
      param: "col",
      titleKey: "collections",
      options: collections.map((c) => ({ value: c.handle, label: c.title })),
    },
    {
      param: "type",
      titleKey: "types",
      options: productTypes
        .filter((a) => !!a.value)
        .map((a) => ({ value: a.value!, label: a.value! })),
    },
    {
      param: "tag",
      titleKey: "tags",
      options: tags
        .filter((s) => !!s.value)
        .map((s) => ({ value: s.value!, label: s.value! })),
    },
  ]

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} filterGroups={filterGroups} />
      <div className="w-full">
        <div className="mb-8 flex flex-col small:flex-row small: items-center small:justify-between gap-4">
          <h1 data-testid="store-page-title" className="text-2xl-semi">{t.product.all_products}</h1>
          <ProductSearch />
        </div>
        <Suspense
          key={`${sort}-${pageNumber}-${q ?? ""}-${cat ?? ""}-${col ?? ""}-${tag ?? ""}-${type ?? ""}`}
          fallback={<SkeletonProductGrid />}
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            q={q}
            categoryIds={idsOrEmpty(selectedCategories, categoryIds)}
            collectionIds={idsOrEmpty(selectedCollections, collectionIds)}
            tagIds={idsOrEmpty(selectedTags, tagIds)}
            typeIds={idsOrEmpty(selectedTypes, typeIds)}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate;
