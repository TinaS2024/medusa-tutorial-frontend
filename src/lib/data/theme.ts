"use server";

import { sdk } from "@lib/config";
import { getCacheOptions } from "./cookies";

export type Theme = {
  theme_surface_bg: string
  theme_border: string
  theme_primary: string
  theme_primary_hover: string
  theme_button_text: string
  theme_header_bg: string
  theme_hero_bg: string
  theme_page_bg: string
  theme_page_text: string
  theme_footer_bg: string
  theme_logo_url: string | null
  theme_hero_url: string | null
}

const DEFAULTS: Theme = {
  theme_surface_bg: "#F9FAFB",
  theme_border: "#E5E7EB",
  theme_primary: "#431407",
  theme_primary_hover: "#7c2d12",
  theme_button_text: "#ffffff",
  theme_header_bg: "#431407",
  theme_hero_bg: "#F9FAFB",
  theme_page_bg: "#F9FAFB",
  theme_page_text: "#431407",
  theme_footer_bg: "#431407",
  theme_logo_url: null,
  theme_hero_url: "/Hero.png",
}

export const retrieveTheme = async (): Promise<Theme> => {
    const next = {
    ...(await getCacheOptions("theme")),
    revalidate: 60,
  }

  const theme = await sdk.client
    .fetch<{ theme: Partial<Theme> }>("/store/theme", {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ theme }) => theme)
    .catch(() => null)

  return {
    theme_surface_bg: theme?.theme_surface_bg || DEFAULTS.theme_surface_bg,
    theme_border: theme?.theme_border || DEFAULTS.theme_border,
    theme_primary: theme?.theme_primary || DEFAULTS.theme_primary,
    theme_primary_hover: theme?.theme_primary_hover || DEFAULTS.theme_primary_hover,
    theme_button_text: theme?.theme_button_text || DEFAULTS.theme_button_text,
    theme_header_bg: theme?.theme_header_bg || DEFAULTS.theme_header_bg,
    theme_hero_bg: theme?.theme_hero_bg || DEFAULTS.theme_hero_bg,
    theme_page_bg: theme?.theme_page_bg || DEFAULTS.theme_page_bg,
    theme_page_text: theme?.theme_page_text || DEFAULTS.theme_page_text,
    theme_footer_bg: theme?.theme_footer_bg || DEFAULTS.theme_footer_bg,
    theme_logo_url: theme?.theme_logo_url || DEFAULTS.theme_logo_url,
    theme_hero_url: theme?.theme_hero_url || DEFAULTS.theme_hero_url,
  }
}
