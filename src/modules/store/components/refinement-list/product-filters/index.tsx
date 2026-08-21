"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getClientLanguage } from "@lib/i18n";
import { getMessages, type Lang } from "@lib/messages";

export type FilterOption = {
  value: string   // steht so in der Adresszeile (Handle bzw. Tag-/Art-Wert)
  label: string   // Anzeigename
  level?: number  // Einrückungstiefe bei Unterkategorien
}

export type FilterGroup = {
  param: string   // Name des URL-Parameters, z. B. "cat"
  titleKey: "categories" | "collections" | "tags" | "types"
  options: FilterOption[]
}

type ProductFiltersProps = {
  groups: FilterGroup[]
}

// Mehrfachauswahl je Gruppe, kommagetrennt: ?cat=stuehle,tische&tag=neu
const werteLesen = (params: URLSearchParams, name: string): string[] => {
  const roh = params.get(name)
  if (!roh) return []
  return roh.split(",").map((w) => w.trim()).filter(Boolean)
}

const ProductFilters = ({ groups }: ProductFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<Lang>("de");
  const [offen, setOffen] = useState(false);
  const t = getMessages(lang);

  useEffect(() => {
    setLang(getClientLanguage())
  }, [])

  const titel: Record<FilterGroup["titleKey"], string> = {
    categories: t?.filter?.categories ?? "Kategorien",
    collections: t?.filter?.collections ?? "Kollektionen",
    tags: t?.filter?.tags ?? "Schlagwörter",
    types: t?.filter?.types ?? "Produktart",
  }

  // Gruppen ohne Einträge gar nicht erst anzeigen – ein leerer Kasten
  // "Kollektionen" wirkt wie ein Fehler.
  const sichtbareGruppen = groups.filter((g) => g.options.length > 0);

  const aktuelleParams = new URLSearchParams(searchParams.toString());

  const anzahlAktiv = sichtbareGruppen.reduce(
    (summe, g) => summe + werteLesen(aktuelleParams, g.param).length,
    0
  )

  const umschalten = (param: string, wert: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const bisher = werteLesen(params, param);
    const neu = bisher.includes(wert)
      ? bisher.filter((w) => w !== wert)
      : [...bisher, wert];

    if (neu.length) 
    {
      params.set(param, neu.join(","));
    } else {
      params.delete(param);
    }

    // Nach jeder Filteränderung zurück auf Seite 1 – sonst landet man auf
    // Seite 4 einer Ergebnisliste mit zwei Treffern.
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  const allesZuruecksetzen = () => {
    const params = new URLSearchParams(searchParams.toString());
    sichtbareGruppen.forEach((g) => params.delete(g.param));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  if (!sichtbareGruppen.length) return null;

  return (
    <div className="w-full">
      {/* Auf schmalen Bildschirmen aufklappbar, ab "small" dauerhaft offen */}
      <button
        type="button"
        onClick={() => setOffen((z) => !z)}
        aria-expanded={offen}
        className="small:hidden w-full h-10 px-3 mb-3 rounded-md txt-compact-small flex items-center justify-between border border-[var(--brand-border)] bg-[var(--brand-surface-bg)] text-[var(--brand-page-text)] hover:bg-[var(--brand-page-bg)]"
      >
        <span>
          {t?.filter?.title ?? "Filter"}
          {anzahlAktiv > 0 ? ` (${anzahlAktiv})` : ""}
        </span>
        <span aria-hidden="true">{offen ? "–" : "+"}</span>
      </button>

      <div
        className={`${offen ? "flex" : "hidden"} small:flex flex-col gap-y-6`}
        data-testid="product-filters"
      >
        {sichtbareGruppen.map((gruppe) => {
          const gewaehlt = werteLesen(aktuelleParams, gruppe.param)

          return (
            <fieldset key={gruppe.param} className="flex flex-col gap-y-1">
              <legend className="txt-compact-small-plus mb-2 text-[var(--brand-page-text)] opacity-70">
                {titel[gruppe.titleKey]}
              </legend>

              {gruppe.options.map((option) => {
                const id = `filter-${gruppe.param}-${option.value}`
                const aktiv = gewaehlt.includes(option.value)

                return (
                  <label
                    key={id}
                    htmlFor={id}
                    style={{ paddingLeft: `${(option.level ?? 0) * 12 + 4}px` }}
                    className="flex items-center gap-x-2 py-0.5 pr-1 rounded cursor-pointer hover:bg-[var(--brand-page-bg)]"
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={aktiv}
                      onChange={() => umschalten(gruppe.param, option.value)}
                      className="h-4 w-4 shrink-0 rounded accent-[var(--brand-primary)] border border-[var(--brand-border)]"
                      data-testid="filter-checkbox"
                    />
                    <span
                      className={`txt-compact-small text-[var(--brand-page-text)] ${
                        aktiv ? "font-semibold" : "opacity-80"
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                )
              })}
            </fieldset>
          )
        })}

        {anzahlAktiv > 0 && (
          <button
            type="button"
            onClick={allesZuruecksetzen}
            className="self-start h-9 px-3 rounded-md txt-compact-small border border-[var(--brand-border)] bg-[var(--brand-surface-bg)] text-[var(--brand-page-text)] hover:bg-[var(--brand-page-bg)]"
            data-testid="filter-reset"
          >
            {t?.filter?.reset ?? "Filter zurücksetzen"}
          </button>
        )}
      </div>
    </div>
  )
}

export default ProductFilters;
