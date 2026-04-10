import { acceptTransferRequest } from "@lib/data/orders";
import { Heading, Text } from "@medusajs/ui";
import TransferImage from "@modules/order/components/transfer-image";

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params;

  const { success, error } = await acceptTransferRequest(id, token);

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        {success && (
          <>
            <Heading level="h1" className="text-xl text-zinc-900">
              Bestellung übertragen!
            </Heading>
            <Text className="text-zinc-600">
              Bestellung {id} wurde erfolgreich an den neuen Kontoinhaber übertragen.
            </Text>
          </>
        )}
        {!success && (
          <>
            <Text className="text-zinc-600">
              Bei der Annahme der Überweisung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
            </Text>
            {error && (
              <Text className="text-red-500">Fehlermeldung: {error}</Text>
            )}
          </>
        )}
      </div>
    </div>
  )
}
