import { newsletterBestaetigen } from "@lib/data/newsletter";
import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";

export default async function NewsletterConfirm(props: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await props.searchParams;
  const lang = await getServerLanguage();
  const t = getMessages(lang).newsletter;

  const erfolg = token ? await newsletterBestaetigen(token) : false;

  return (
    <div className="content-container py-16">
      <h1 className="text-2xl-semi mb-4">{t.title}</h1>
      <p className="text-base-regular">{erfolg ? t.confirm_ok : t.confirm_fail}</p>
    </div>
  )
}
