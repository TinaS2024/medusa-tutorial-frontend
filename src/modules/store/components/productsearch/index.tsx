"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";
import { TextDecoderStream } from "node:stream/web";

export default function ProductSearch() 
{
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<"de" | "en" | "fr" | "nl">("de");
  const t = getMessages(lang).product;

  const [term, setTerm] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  const search = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);
    const value = term.trim();

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    // Bei neuer Suche zurück auf die erste Seite – sonst landet man
    // womöglich auf Seite 4 eines Ergebnisses mit zwei Treffern.
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={search} className="flex gap-2 w-full small:w-auto">
      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
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
