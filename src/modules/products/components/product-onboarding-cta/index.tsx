import { Button, Container, Text } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

async function ProductOnboardingCta() {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  if (!isOnboarding) {
    return null
  }

  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full p-8">
      <div className="flex flex-col gap-y-4 center">
        <Text className="text-ui-fg-base text-xl">
          Ihr Demoprodukt wurde erfolgreich erstellt! 🎉
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          Sie können nun mit der Einrichtung Ihres Shops im Adminbereich fortfahren.
        </Text>
        <a href="http://localhost:7001/a/orders?onboarding_step=create_order_nextjs">
          <Button className="w-full">Setzen Sie die Einrichtung im Admin fort</Button>
        </a>
      </div>
    </Container>
  )
}

export default ProductOnboardingCta;
