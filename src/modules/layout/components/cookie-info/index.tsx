"use client"

import { useEffect, useState } from "react";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { leseEinwilligung, speichereEinwilligung } from "@lib/util/consent";
import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";

export default function CookieHinweis({ text }: { text?: string | null }) {
  const [sichtbar, setSichtbar] = useState(false);
  const [lang, setLang] = useState<"de" | "en" | "fr" | "nl">("de");
  const t = getMessages(lang).cookie;

  useEffect(() => {
    setLang(getClientLanguage());
    // Erst nach dem Laden entscheiden, sonst blitzt der Hinweis bei jedem
    // Seitenaufruf kurz auf, obwohl längst zugestimmt wurde.
    setSichtbar(leseEinwilligung() === null);
  }, []);

  if (!sichtbar) return null;

  const entscheiden = (optional: boolean) => {
    speichereEinwilligung(optional);
    setSichtbar(false);
  }

  return (
    <div
      role="dialog"
      aria-label={t.title}
      className="fixed bottom-0 inset-x-0 z-50 border-t border-[var(--brand-border)] bg-[var(--brand-surface-bg)] p-4"
    >
      <div className="content-container flex flex-col gap-3 small:flex-row small:items-center small:justify-between">
        <p className="text-small-regular max-w-3xl">
          {text || t.text}{" "}
          <LocalizedClientLink href="/privacy" className="underline">
            {t.privacy_link}
          </LocalizedClientLink>
        </p>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => entscheiden(false)}
            className="px-4 py-2 rounded-md text-base-regular border border-[var(--brand-border)] hover:bg-[var(--brand-hover-bg)]"
          >
            {t.only_required}
          </button>
          <button
            onClick={() => entscheiden(true)}
            className="px-4 py-2 rounded-md text-base-regular bg-[var(--brand-primary)] text-[var(--brand-button-text)] hover:bg-[var(--brand-primary-hover)]"
          >
            {t.accept_all}
          </button>
        </div>
      </div>
    </div>
  )
}
