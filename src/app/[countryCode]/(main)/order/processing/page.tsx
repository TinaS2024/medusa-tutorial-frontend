import { Heading, Text } from "@medusajs/ui";

export default function PaymentProcessingPage() 
{
  return (
    <div className="content-container py-16 flex flex-col items-center gap-4 text-center">
      <Heading level="h1">Vielen Dank für deine Bestellung!</Heading>
      <Text className="max-w-xl">
        Deine SEPA-Lastschrift wird verarbeitet. Sobald die Zahlung bestätigt ist,
        erhältst du eine Bestellbestätigung per E-Mail.
      </Text>
    </div>
  )
}
