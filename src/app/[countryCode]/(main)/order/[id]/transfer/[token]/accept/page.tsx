import { acceptTransferRequest } from "@lib/data/orders";
import { Heading, Text } from "@medusajs/ui";
import TransferImage from "@modules/order/components/transfer-image";

import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const lang = await getServerLanguage();
  const t = getMessages(lang);

  const { id, token } = params;

  const { success, error } = await acceptTransferRequest(id, token);

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        {success && (
          <>
            <Heading level="h1" className="text-xl text-zinc-900">
              {t.profile.order_transfer_success}
            </Heading>
            <Text className="text-zinc-600">
              {t.profile.order_transfer_account_1} {id} {t.profile.order_transfer_account_2}
            </Text>
          </>
        )}
        {!success && (
          <>
            <Text className="text-zinc-600">
              {t.profile.success_error}
            </Text>
            {error && (
              <Text className="text-red-500">{t.error.error_info}: {error}</Text>
            )}
          </>
        )}
      </div>
    </div>
  )
}
