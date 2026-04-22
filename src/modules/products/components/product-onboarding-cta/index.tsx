import { Button, Container, Text } from "@medusajs/ui";
import { cookies as nextCookies } from "next/headers";

import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";

async function ProductOnboardingCta() 
{
  const lang = await getServerLanguage();
  const t = getMessages(lang);
  const cookies = await nextCookies();

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true";

  if (!isOnboarding) 
  {
    return null;
  }

  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full p-8">
      <div className="flex flex-col gap-y-4 center">
        <Text className="text-ui-fg-base text-xl">
          {t.demo.create_demo}🎉
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          {t.demo.set_demo}
        </Text>
        <a href="http://localhost:7001/a/orders?onboarding_step=create_order_nextjs">
          <Button className="w-full"> {t.demo.admin_demo}</Button>
        </a>
      </div>
    </Container>
  )
}

export default ProductOnboardingCta;
