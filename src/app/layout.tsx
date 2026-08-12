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
      } as React.CSSProperties}
    >
      <body className="bg-[var(--brand-page-bg)] text-[var(--brand-page-text)]">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
