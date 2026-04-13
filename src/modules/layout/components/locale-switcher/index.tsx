"use client";

import { useState, useEffect } from "react";
import { sdk } from "@lib/config";

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

    return (
    <select
      title="Language"
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-transparent text-white/70 hover:text-white border border-white/30 rounded px-2 py-1 text-xs"
    >
      {SUPPORTED_LOCALES.map((loc) => (
        <option key={loc.code} value={loc.code} className="text-black">
          {loc.label}
        </option>
      ))}
    </select>
    );
}

