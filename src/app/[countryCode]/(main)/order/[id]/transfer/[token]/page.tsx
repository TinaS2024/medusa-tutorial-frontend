import { Heading, Text } from "@medusajs/ui";
import TransferActions from "@modules/order/components/transfer-actions";
import TransferImage from "@modules/order/components/transfer-image";

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params;

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        <Heading level="h1" className="text-xl text-zinc-900">
          Überweisungsantrag für Bestellung {id}
        </Heading>
        <Text className="text-zinc-600">
          Sie haben eine Anfrage zur Übertragung der Inhaberschaft Ihrer Bestellung ({id}) erhalten.
          Wenn Sie dieser Anfrage zustimmen, können Sie die Übertragung durch Klicken auf die Schaltfläche unten bestätigen.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <Text className="text-zinc-600">
          Wenn Sie zustimmen, übernimmt der neue Eigentümer alle Verantwortlichkeiten und Berechtigungen, die mit dieser Bestellung verbunden sind.
        </Text>
        <Text className="text-zinc-600">
          Wenn Sie diese Anfrage nicht anerkennen oder das Eigentum behalten möchten, sind keine weiteren Maßnahmen erforderlich.
        </Text>
        <div className="w-full h-px bg-zinc-200" />
        <TransferActions id={id} token={token} />
      </div>
    </div>
  )
}
