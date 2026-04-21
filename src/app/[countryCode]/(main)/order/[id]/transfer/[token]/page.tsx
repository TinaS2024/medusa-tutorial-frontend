import { Heading, Text } from "@medusajs/ui";
import TransferActions from "@modules/order/components/transfer-actions";
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

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <Heading level="h1" className="text-xl text-zinc-900">
          {t.profile.orderrequest_for} {id}
        </Heading>
        <Text className="text-zinc-600">
          {t.profile.apply_request_1} ({id}) {t.profile.apply_request_2}.
          {t.profile.apply_request_3}
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <Text className="text-zinc-600">
          {t.profile.agree_request}
        </Text>
        <Text className="text-zinc-600">
          {t.profile.dont_agree_request}
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
