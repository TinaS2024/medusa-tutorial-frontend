"use client";

import { useEffect, useState } from "react";
import { subscribeToNewsletter } from "@lib/data/newsletter";
import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";

export default function NewsletterAbo() 
{
  const [lang, setLang] = useState<"de" | "en" | "fr" | "nl">("de");
  const t = getMessages(lang).newsletter;

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"empty" | "sent" | "ok" | "error">("empty");

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return;

    setState("sent");
    const success = await subscribeToNewsletter(email.trim(), lang);
    setState(success ? "ok" : "error");
    if (success) setEmail("");
  }

   if (state === "ok") {
    return (
      <div className="flex flex-col gap-y-2">
        <span className="txt-small-plus text-white/70">{t.title}</span>
        <span className="txt-small text-white/70 max-w-[220px]">{t.success}</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
      <span className="txt-small-plus text-white/70">{t.title}</span>

      <div className="flex gap-1 max-w-[220px]">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.placeholder}
          aria-label={t.title}
          className="min-w-0 flex-1 h-8 px-2 rounded text-xs bg-[var(--brand-surface-bg)] text-[var(--brand-page-text)] border border-[var(--brand-border)]"
        />
        <button
          type="submit"
          disabled={state === "sent"}
          className="h-8 px-2 rounded text-xs shrink-0 bg-[var(--brand-primary)] text-[var(--brand-button-text)] hover:bg-[var(--brand-primary-hover)]"
        >
          {t.submit}
        </button>
      </div>

      {state === "error" && (
        <span className="txt-small text-white/70 max-w-[220px]">{t.error}</span>
      )}
    </form>
  )
}
