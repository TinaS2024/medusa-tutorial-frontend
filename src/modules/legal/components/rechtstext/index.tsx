import sanitizeHtml from "sanitize-html";

/**
 * Zeigt einen im Admin gepflegten Rechtstext an.
 *
 * Der Text darf einfache Auszeichnungen enthalten (Überschriften, Absätze,
 * Listen, fett/kursiv/unterstrichen, Verweise). Alles andere wird entfernt –
 * insbesondere Skripte und Ereignis-Attribute.
 */
const ERLAUBT: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2", "h3", "h4", "p", "br", "hr",
    "strong", "b", "em", "i", "u",
    "ul", "ol", "li", "blockquote", "a",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
}

export default function Rechtstext({ html }: { html: string }) {
  const sauber = sanitizeHtml(html, ERLAUBT)

  return (
    <div
      className="rechtstext text-base-regular max-w-3xl"
      dangerouslySetInnerHTML={{ __html: sauber }}
    />
  )
}
