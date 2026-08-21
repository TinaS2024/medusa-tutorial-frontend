"use server";

import { sdk } from "@lib/config";
import { HttpTypes } from "@medusajs/types";
import { getCacheOptions } from "./cookies";
import { getLocaleHeader } from "@lib/locale";

// Schlagwörter und Produktarten stammen aus den Produktdaten, die der Betreiber
// im Admin ohnehin pflegt. Deshalb braucht die Filterleiste keine eigene
// Verwaltungsoberfläche – sie zeigt schlicht, was im Sortiment vorkommt.
//
// Beide Abfragen fangen Fehler ab und geben eine leere Liste zurück: Fehlt die
// Route (oder ist sie leer), fällt nur die betroffene Filtergruppe weg,
// die Produktübersicht bleibt benutzbar.

export const listProductTags = async (): Promise<HttpTypes.StoreProductTag[]> => {
  const next = {
    ...(await getCacheOptions("product-tags")),
  }

  const headers = {
    ...(await getLocaleHeader()),
  }

  return sdk.client
    .fetch<{ product_tags: HttpTypes.StoreProductTag[] }>(
      "/store/product-tags",
      {
        query: { limit: 100 },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_tags }) => product_tags ?? [])
    .catch(() => [])
}

export const listProductTypes = async (): Promise<HttpTypes.StoreProductType[]> => {
  const next = {
    ...(await getCacheOptions("product-types")),
  }

  const headers = {
    ...(await getLocaleHeader()),
  }

  return sdk.client
    .fetch<{ product_types: HttpTypes.StoreProductType[] }>(
      "/store/product-types",
      {
        query: { limit: 100 },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_types }) => product_types ?? [])
    .catch(() => [])
}
