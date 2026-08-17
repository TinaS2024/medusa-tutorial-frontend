import { getBaseURL } from "@lib/util/env";
import { retrieveTheme } from "@lib/data/theme";
import { Metadata } from "next";
import "styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function RootLayout(props: { children: React.ReactNode }) 
{
  const theme = await retrieveTheme();

  // Schriftstapel je Auswahl. Bewusst nur Familien, die auf allen Geräten
  // vorhanden sind – so entfallen Ladezeiten und Ersatzschriften.
  const schriften: Record<string, string> = {
    default: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'Georgia, Cambria, "Times New Roman", serif',
    sans: '"Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, "Cascadia Mono", Consolas, monospace',
    rounded: '"Segoe UI", Verdana, Tahoma, sans-serif',
  }

  return (
    <html
      lang="en"
      data-mode="light"
      style={{
        "--brand-surface-bg": theme.theme_surface_bg,
        "--brand-border": theme.theme_border,
        "--brand-primary": theme.theme_primary,
        "--brand-primary-hover": theme.theme_primary_hover,
        "--brand-button-text": theme.theme_button_text,
        "--brand-header-bg": theme.theme_header_bg,
        "--brand-hero-bg": theme.theme_hero_bg,
        "--brand-page-bg": theme.theme_page_bg,
        "--brand-page-text": theme.theme_page_text,
        "--brand-footer-bg": theme.theme_footer_bg,
        "--brand-font": schriften[theme.theme_font] ?? schriften.default,


        // Medusas eigene Farben mitziehen: Alle ui-Klassen der Vorlage
        // (bg-ui-bg-subtle, text-ui-fg-subtle, border-ui-border-base …)
        // lesen ausschließlich diese Variablen.
        "--bg-base": theme.theme_page_bg,
        "--bg-subtle": theme.theme_page_bg,
        "--bg-component": theme.theme_surface_bg,
        "--bg-field": theme.theme_surface_bg,

        // Abstufung der Texte erhalten: Haupttext voll, Nebentext und
        // Hilfstexte zunehmend zurückgenommen.
        "--fg-base": theme.theme_page_text,
        "--fg-subtle": `color-mix(in srgb, ${theme.theme_page_text} 75%, transparent)`,
        "--fg-muted": `color-mix(in srgb, ${theme.theme_page_text} 55%, transparent)`,

        // Knöpfe: auffällige in der Hauptfarbe, zurückhaltende auf Flächenfarbe.
        // Ohne diese Zeilen behalten alle Standardknöpfe Medusas Schwarz/Weiß.
        "--button-inverted": theme.theme_primary,
        "--button-inverted-hover": theme.theme_primary_hover,
        "--button-inverted-pressed": theme.theme_primary_hover,
        "--fg-on-inverted": theme.theme_button_text,

        "--button-neutral": theme.theme_surface_bg,
        "--button-neutral-hover": theme.theme_border,
        "--button-neutral-pressed": theme.theme_border,
        "--button-transparent-hover": theme.theme_border,

         // Verweise und Auswahlkästchen: Medusas Standardblau durch die
        // Hauptfarbe des Shops ersetzen.
        "--fg-interactive": theme.theme_primary,
        "--fg-interactive-hover": theme.theme_primary_hover,
        "--bg-interactive": theme.theme_primary,
        "--border-interactive": theme.theme_primary,

        // Hover- und Klickzustände – aus dem Admin einstellbar, damit die
        // Farbe zum jeweiligen Schema passt (Weiß wirkt auf Beige störend).
        "--bg-base-hover": theme.theme_hover_bg,
        "--bg-base-pressed": theme.theme_hover_bg,
        "--bg-subtle-hover": theme.theme_hover_bg,
        "--bg-subtle-pressed": theme.theme_hover_bg,
        "--bg-component-hover": theme.theme_hover_bg,
        "--bg-component-pressed": theme.theme_hover_bg,
        "--bg-field-hover": theme.theme_hover_bg,
        "--bg-field-component-hover": theme.theme_hover_bg,

        "--border-base": theme.theme_border,
        "--border-strong": theme.theme_border,
      } as React.CSSProperties}
    >
      <body className="bg-[var(--brand-page-bg)] text-[var(--brand-page-text)]">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
