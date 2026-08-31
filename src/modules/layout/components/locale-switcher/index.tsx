"use client";

import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";

const SUPPORTED_LOCALES = [
  { code: "de-DE", label: "DE" },
  { code: "en-GB", label: "EN" },
  { code: "fr-FR", label: "FR" },
  { code: "nl-NL", label: "NL" },
]

const LOCALE_TO_COUNTRY: Record<string, string> = {
  "de-DE": "de",
  "en-GB": "gb",  
  "fr-FR": "fr",
  "nl-NL": "nl",
};

const STORAGE_KEY = "ui_locale";

export default function LocaleSwitcher()
{
    const [current, setCurrent] = useState<string>("de-DE");

        useEffect(() => {
    if (typeof window === "undefined") return;

    // Cookie zuerst – er ist die gemeinsame Quelle mit dem Designer und mit
    // dem serverseitigen Rendern. localStorage ist pro Ursprung getrennt und
    // enthält deshalb nur die zuletzt IM SHOP gewählte Sprache.
    const rawCookie = document.cookie
      .split("; ")
      .find((part) => part.startsWith("_medusa_locale="))
      ?.slice("_medusa_locale=".length);

    const storedLocale = rawCookie
      ? decodeURIComponent(rawCookie)
      : window.localStorage.getItem(STORAGE_KEY);

    if (!storedLocale) return;

    // Der Cookie kann auch eine Kurzform enthalten ("nl"). Die Liste kennt nur
    // volle Kennungen, deshalb notfalls über die ersten beiden Zeichen suchen.
    const result =
      SUPPORTED_LOCALES.find((l) => l.code === storedLocale) ??
      SUPPORTED_LOCALES.find((l) =>
        l.code.toLowerCase().startsWith(storedLocale.slice(0, 2).toLowerCase())
      );

    if (!result) return;

    setCurrent(result.code);

    // Beide Speicher gleichziehen, damit der nächste Aufruf ohne Cookie
    // denselben Wert findet.
    window.localStorage.setItem(STORAGE_KEY, result.code);
  }, [])

    const handleChange = (code: string) => {
    setCurrent(code);
    if (typeof window !== "undefined") 
    {
      window.localStorage.setItem(STORAGE_KEY, code);

      //Server-Variante:
      //const domaene = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
      //document.cookie = `_medusa_locale=${code}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax` + (domaene ? `; domain=${domaene}` : "");

      document.cookie = `_medusa_locale=${code}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;


      const countryCode = LOCALE_TO_COUNTRY[code];
    if (countryCode) {
      const path = window.location.pathname;
      const parts = path.split("/");

      if (parts.length > 1) 
      {
        parts[1] = countryCode;
        const newPath = parts.join("/");
        window.location.href = newPath; 
      } else {
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  }
    }

   const selected = SUPPORTED_LOCALES.find((loc) => loc.code === current) ?? SUPPORTED_LOCALES[0];

    return (
    <>
    <Listbox value={current} onChange={handleChange}>
      <div className="relative">
        <Listbox.Button className="flex items-center justify-between gap-x-1 rounded px-2 py-1 text-xs bg-transparent text-white shadow-sm">
          <span>{selected.label}</span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute right-0 z-10 mt-1 w-10 rounded-md bg-[var(--brand-surface-bg)] py-1 text-xs shadow-lg ring-1 ring-black/5">
            {SUPPORTED_LOCALES.map((loc) => (
              <Listbox.Option
                key={loc.code}
                value={loc.code}
                className={({ active }) =>`cursor-pointer select-none px-3 py-1 ${active ? "bg-transparent text-orange-900" : "bg-transaprent text-gray-900"}`
                }
              >
                {loc.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  </>
    );
}

