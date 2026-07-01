import { Heading, Text } from "@medusajs/ui";

import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";

export async function PaymentProcessingPage() 
{
  const lang = await getServerLanguage();
  const t = getMessages(lang);


  return (
    <div className="content-container py-16 flex flex-col items-center gap-4 text-center">
      <Heading level="h1">{t.payment.thank_order}</Heading>
      <Text className="max-w-xl">
        {t.payment.sepa_info}
      </Text>
    </div>
  )
}

export default PaymentProcessingPage;
