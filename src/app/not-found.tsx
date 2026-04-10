import { ArrowUpRightMini } from "@medusajs/icons";
import { Text } from "@medusajs/ui";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404",
  description: "Etwas ging schief",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">Seite wurde nicht gefunden</h1>
      <p className="text-small-regular text-ui-fg-base">
        Die Seite, die Sie aufrufen wollten, existiert nicht.
      </p>
      <p className="text-small-regular text-ui-fg-base">
      </p>
      <Link
        className="flex gap-x-1 items-center group"
        href="/"
      >
        <Text className="text-ui-fg-interactive">Zurück zur Startseite</Text>
        <ArrowUpRightMini
          className="group-hover:rotate-45 ease-in-out duration-150"
          color="var(--fg-interactive)"
        />
      </Link>
    </div>
  )
}
