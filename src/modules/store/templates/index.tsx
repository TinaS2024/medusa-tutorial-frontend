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
const werteAusParameter = (wert?: string): string[] =>
  wert ? wert.split(",").map((w) => w.trim()).filter(Boolean) : []

// Steht eine Auswahl in der Adresszeile, für die es keinen Datensatz gibt
// (getippte oder gelöschte Handles), darf NICHT das ganze Sortiment erscheinen.
// Eine nicht existierende ID liefert stattdessen null Treffer.
const KEIN_TREFFER = "__keine_uebereinstimmung__"

const idsOderLeerlauf = (gewaehlt: string[], ids: string[]): string[] | undefined => {
  if (!gewaehlt.length) return undefined;
  return ids.length ? ids : [KEIN_TREFFER];
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
  const [kategorien, kollektionen, schlagworte, produktarten] = await Promise.all([
    listCategories().catch(() => []),
    listCollections({ limit: "100" }).then((r) => r.collections).catch(() => []),
    listProductTags(),
    listProductTypes(),
  ])

  // --- Kategorien: Baum aus der flachen Liste bauen (nicht auf mitgelieferte
  // category_children verlassen, die reichen nur eine Ebene tief) ---
  const kinderVon = (elternId: string | null) =>
    kategorien.filter((k) => (k.parent_category?.id ?? null) === elternId)

  const kategorieOptionen: FilterOption[] = [];

  const einsammeln = (liste: typeof kategorien, ebene: number) => {
    if (ebene > 3) return;
    liste.forEach((k) => {
      kategorieOptionen.push({ value: k.handle, label: k.name, level: ebene });
      einsammeln(kinderVon(k.id), ebene + 1);
    })
  }

  einsammeln(kinderVon(null), 0);

  const gewaehlteKategorien = werteAusParameter(cat);

  // Wer eine Oberkategorie anhakt, erwartet auch deren Unterkategorien.
  const kategorieIds: string[] = [];
  const mitUnterkategorien = (k: (typeof kategorien)[number], tiefe = 0) => {
    if (tiefe > 3 || kategorieIds.indexOf(k.id) !== -1) return;
    kategorieIds.push(k.id);
    kinderVon(k.id).forEach((kind) => mitUnterkategorien(kind, tiefe + 1));
  }
  kategorien
    .filter((k) => gewaehlteKategorien.includes(k.handle))
    .forEach((k) => mitUnterkategorien(k))


  // --- Kollektionen, Schlagwörter, Produktarten ---
  const gewaehlteKollektionen = werteAusParameter(col);
  const kollektionIds = kollektionen
    .filter((c) => gewaehlteKollektionen.includes(c.handle))
    .map((c) => c.id);

  const gewaehlteSchlagworte = werteAusParameter(tag);
  const schlagwortIds = schlagworte
    .filter((s) => s.value && gewaehlteSchlagworte.includes(s.value))
    .map((s) => s.id);

  const gewaehlteArten = werteAusParameter(type);
  const artIds = produktarten
    .filter((a) => a.value && gewaehlteArten.includes(a.value))
    .map((a) => a.id);

  const filterGroups: FilterGroup[] = [
    {
      param: "cat",
      titleKey: "categories",
      options: kategorieOptionen,
    },
    {
      param: "col",
      titleKey: "collections",
      options: kollektionen.map((c) => ({ value: c.handle, label: c.title })),
    },
    {
      param: "type",
      titleKey: "types",
      options: produktarten
        .filter((a) => !!a.value)
        .map((a) => ({ value: a.value!, label: a.value! })),
    },
    {
      param: "tag",
      titleKey: "tags",
      options: schlagworte
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
            categoryIds={idsOderLeerlauf(gewaehlteKategorien, kategorieIds)}
            collectionIds={idsOderLeerlauf(gewaehlteKollektionen, kollektionIds)}
            tagIds={idsOderLeerlauf(gewaehlteSchlagworte, schlagwortIds)}
            typeIds={idsOderLeerlauf(gewaehlteArten, artIds)}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate;
