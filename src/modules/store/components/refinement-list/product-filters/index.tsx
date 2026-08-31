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
const readValues = (params: URLSearchParams, name: string): string[] => {
  const raw = params.get(name)
  if (!raw) return []
  return raw.split(",").map((w) => w.trim()).filter(Boolean)
}

const ProductFilters = ({ groups }: ProductFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<Lang>("de");
  const [open, setOpen] = useState(false);
  const t = getMessages(lang);

  useEffect(() => {
    setLang(getClientLanguage())
  }, [])

  const title: Record<FilterGroup["titleKey"], string> = {
    categories: t?.filter?.categories ?? "Kategorien",
    collections: t?.filter?.collections ?? "Kollektionen",
    tags: t?.filter?.tags ?? "Schlagwörter",
    types: t?.filter?.types ?? "Produktart",
  }

  // Gruppen ohne Einträge gar nicht erst anzeigen – ein leerer Kasten
  // "Kollektionen" wirkt wie ein Fehler.
  const visibleGroups = groups.filter((g) => g.options.length > 0);

  const currentParams = new URLSearchParams(searchParams.toString());

  const countActiv = visibleGroups.reduce(
    (sum, g) => sum + readValues(currentParams, g.param).length,
    0
  )

  const toggle = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const previous = readValues(params, param);
    const next = previous.includes(value)
      ? previous.filter((w) => w !== value)
      : [...previous, value];

    if (next.length) 
    {
      params.set(param, next.join(","));
    } else {
      params.delete(param);
    }

    // Nach jeder Filteränderung zurück auf Seite 1 – sonst landet man auf
    // Seite 4 einer Ergebnisliste mit zwei Treffern.
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  const resetAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    visibleGroups.forEach((g) => params.delete(g.param));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  if (!visibleGroups.length) return null;

  return (
    <div className="w-full">
      {/* Auf schmalen Bildschirmen aufklappbar, ab "small" dauerhaft offen */}
      <button
        type="button"
        onClick={() => setOpen((z) => !z)}
        aria-expanded={open}
        className="small:hidden w-full h-10 px-3 mb-3 rounded-md txt-compact-small flex items-center justify-between border border-[var(--brand-border)] bg-[var(--brand-surface-bg)] text-[var(--brand-page-text)] hover:bg-[var(--brand-page-bg)]"
      >
        <span>
          {t?.filter?.title ?? "Filter"}
          {countActiv > 0 ? ` (${countActiv})` : ""}
        </span>
        <span aria-hidden="true">{open ? "–" : "+"}</span>
      </button>

      <div
        className={`${open ? "flex" : "hidden"} small:flex flex-col gap-y-6`}
        data-testid="product-filters"
      >
        {visibleGroups.map((group) => {
          const chosen = readValues(currentParams, group.param)

          return (
            <fieldset key={group.param} className="flex flex-col gap-y-1">
              <legend className="txt-compact-small-plus mb-2 text-[var(--brand-page-text)] opacity-70">
                {title[group.titleKey]}
              </legend>

              {group.options.map((option) => {
                const id = `filter-${group.param}-${option.value}`
                const activ = chosen.includes(option.value)

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
                      checked={activ}
                      onChange={() => toggle(group.param, option.value)}
                      className="h-4 w-4 shrink-0 rounded accent-[var(--brand-primary)] border border-[var(--brand-border)]"
                      data-testid="filter-checkbox"
                    />
                    <span
                      className={`txt-compact-small text-[var(--brand-page-text)] ${
                        activ ? "font-semibold" : "opacity-80"
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

        {countActiv > 0 && (
          <button
            type="button"
            onClick={resetAll}
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
