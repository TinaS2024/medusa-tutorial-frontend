"use client";

import React from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  variant = "primary",
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus();

  // Bewusst ein einfaches Knopf-Element statt Medusas Button: Dessen
  // Farbverlauf-Overlay überdeckt im gedrückten Zustand die eingestellte
  // Farbe und lässt den Knopf weiß aufblitzen.
  const colors =
    variant === "secondary"
      ? "bg-[var(--brand-surface-bg)] text-[var(--brand-page-text)] border border-[var(--brand-border)] hover:bg-[var(--brand-border)] active:bg-[var(--brand-border)]"
      : "bg-[var(--brand-primary)] text-[var(--brand-button-text)] hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-hover)]"

  return (
    <button
      type="submit"
      disabled={pending}
      data-testid={dataTestId}
      className={`h-10 px-4 rounded-md text-base-regular transition-colors ${colors} ${
        pending ? "cursor-wait" : ""
      } ${className ?? ""}`}
    >
      {children}
    </button>
  )
}
