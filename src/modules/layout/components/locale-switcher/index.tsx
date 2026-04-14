"use client";

import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";

const SUPPORTED_LOCALES = [
  { code: "de-DE", label: "DE" },
  { code: "en-US", label: "EN" },
  { code: "fr-FR", label: "FR" },
  { code: "nl-NL", label: "NL" },
]

const STORAGE_KEY = "ui_locale";

export default function LocaleSwitcher()
{
    const [current, setCurrent] = useState<string>("de-DE");

    useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) 
    {
      setCurrent(stored)
    }
  }, [])

    const handleChange = (code: string) => {
    setCurrent(code);
    if (typeof window !== "undefined") 
    {
      window.localStorage.setItem(STORAGE_KEY, code);
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
          <Listbox.Options className="absolute right-0 z-10 mt-1 w-10 rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black/5">
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

