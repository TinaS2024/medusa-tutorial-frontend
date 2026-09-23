import { Heading } from "@medusajs/ui";

import { retrieveOrderInvoices } from "@lib/data/orders";
import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";
import { langToLocale } from "@lib/languages";


type Props = {
  orderId: string
}

/** Sprachkürzel zu vollem Gebietsschema – für Datums- und Geldformate. */
const LOCALES: Record<string, string> = {
  de: "de-DE",
  en: "en-GB",
  fr: "fr-FR",
  nl: "nl-NL",
};

const Invoices = async ({ orderId }: Props) => {
  const invoices = await retrieveOrderInvoices(orderId);
  const lang = await getServerLanguage();
  const t = getMessages(lang);

  // Gibt es keine Rechnung, erscheint der Block gar nicht. Ein leerer
  // Kasten mit "keine Rechnung vorhanden" verunsichert Kunden nur.
  if (!invoices.length) return null;

  const locale = langToLocale(lang);


  const money = (value: number | string, currency: string) =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(
      Number(value)
    );

  const day = (value: string) =>
    new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));

  /** Rechnung, Stornorechnung oder Korrektur – je nach Dokumenttyp. */
  const typeLabel = (type: string) => {
    if (type === "cancellation") return t.profile.invoice_type_cancellation;
    if (type === "credit_note") return t.profile.invoice_type_credit_note;
    return t.profile.invoice_type_invoice;
  };


  return (
    <div className="mt-6">
      <Heading className="text-base-semi">{t.profile.invoices}</Heading>

      <ul className="flex flex-col gap-y-2 my-2">
        {invoices.map((invoice) => (
          <li
            key={invoice.id}
            className="flex items-center justify-between gap-x-4 text-base-regular"
          >
            <span>
              {t.profile.invoice_no} {invoice.number} · {day(invoice.issued_at)} ·{" "}
              {money(invoice.total_gross, invoice.currency_code)}
            </span>

            {invoice.has_pdf ? (
              <a
                href={`/api/invoices/${invoice.id}/pdf`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-[var(--brand-button-text)] bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] transition-colors"
              >
                {t.profile.invoice_download}
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Invoices;
