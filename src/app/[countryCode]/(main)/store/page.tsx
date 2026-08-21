import { Metadata } from "next";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import StoreTemplate from "@modules/store/templates";

export const metadata: Metadata = {
  title: "Shop",
  description: "Entdecken Sie all unsere Produkte.",
}

// Freitextsuche mit variable q

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
    // Filterleiste: kommagetrennte Handles bzw. Werte
    cat?: string    // Kategorien
    col?: string    // Kollektionen
    tag?: string    // Schlagwörter
    type?: string   // Produktarten
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) 
{
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, q, cat, col, tag, type } = searchParams;

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      q={q}
      cat={cat}
      col={col}
      tag={tag}
      type={type}
      countryCode={params.countryCode}
    />
  )
}
