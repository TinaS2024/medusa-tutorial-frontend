import InteractiveLink from "@modules/common/components/interactive-link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "404",
  description: "Etwas ging schief",
}

export default async function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">Seite wurde nicht gefunden</h1>
      <p className="text-small-regular text-ui-fg-base">
        Die Seite, die Sie aufrufen wollten, existiert nicht.


      </p>
      <InteractiveLink href="/">Zurück zur Startseite</InteractiveLink>
    </div>
  )
}
