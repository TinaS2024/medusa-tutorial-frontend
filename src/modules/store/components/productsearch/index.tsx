"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";

export default function ProductSearch() 
{
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<"de" | "en" | "fr" | "nl">("de");
  const t = getMessages(lang).product;

  const [begriff, setBegriff] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  const suchen = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);
    const wert = begriff.trim();

    if (wert) {
      params.set("q", wert);
    } else {
      params.delete("q");
    }

    // Bei neuer Suche zurück auf die erste Seite – sonst landet man
    // womöglich auf Seite 4 eines Ergebnisses mit zwei Treffern.
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={suchen} className="flex gap-2 w-full small:w-auto">
      <input
        type="search"
        value={begriff}
        onChange={(e) => setBegriff(e.target.value)}
        placeholder={t.search_placeholder}
        aria-label={t.search_placeholder}
        className="h-10 px-3 rounded-md text-base-regular w-full small:w-64 bg-[var(--brand-surface-bg)] text-[var(--brand-page-text)] border border-[var(--brand-border)]"
      />
      <button
        type="submit"
        className="h-10 px-4 rounded-md text-base-regular shrink-0 bg-[var(--brand-primary)] text-[var(--brand-button-text)] hover:bg-[var(--brand-primary-hover)]"
      >
        {t.search}
      </button>
    </form>
  );
}
