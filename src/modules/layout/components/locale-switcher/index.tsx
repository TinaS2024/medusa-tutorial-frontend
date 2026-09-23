"use client";

import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

import { DEFAULT_LANG, LANGUAGES, langToLocale, localeToLang } from "@lib/languages";

const STORAGE_KEY = "ui_locale";

export default function LocaleSwitcher() {
  const [current, setCurrent] = useState<string>(langToLocale(DEFAULT_LANG));

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

    // Kurzformen ("nl") und nicht angebotene Sprachen landen so bei einem
    // Eintrag der Liste – nicht angebotene bei Englisch.
    const locale = langToLocale(localeToLang(storedLocale));

    setCurrent(locale);
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, []);

  const handleChange = async (locale: string) => {
    setCurrent(locale);
    window.localStorage.setItem(STORAGE_KEY, locale);

    //Server-Variante:
    //const domaene = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
    //document.cookie = `_medusa_locale=; path=/; max-age=0`;
    //document.cookie = `_medusa_locale=${locale}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax` + (domaene ? `; domain=${domaene}` : "");

    document.cookie = `_medusa_locale=${locale}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

    // Warenkorb auf die neue Sprache umstellen, bevor die Seite neu lädt.
    // Über die Route, nicht als Serveraktion – siehe api/cart-locale.
    await fetch("/api/cart-locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    }).catch(() => {});


    // Nur neu laden – das Land in der Adresse bleibt, wie es ist. Die
    // Sprache bestimmt die Texte, das Land die Steuer und das Lieferland.
    // Das Land wählt der Kunde getrennt über die Länderauswahl im Menü.
    window.location.reload();
  };

  const selected =
    LANGUAGES.find((language) => language.locale === current) ?? LANGUAGES[0];

  return (
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
            {LANGUAGES.map((language) => (
              <Listbox.Option
                key={language.locale}
                value={language.locale}
                className={({ active }) =>
                  `cursor-pointer select-none px-3 py-1 ${
                    active ? "bg-transparent text-orange-900" : "bg-transparent text-gray-900"
                  }`
                }
              >
                {language.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
