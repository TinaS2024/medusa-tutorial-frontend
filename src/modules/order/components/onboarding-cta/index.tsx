"use client";

import { useState, useEffect } from "react";

import { resetOnboardingState } from "@lib/data/onboarding";
import { Button, Container, Text } from "@medusajs/ui";

import { getClientLanguage } from "@lib/i18n";
import { DEFAULT_LANG } from "@lib/languages";
import { getMessages, type Lang } from "@lib/messages";

const OnboardingCta = ({ orderId }: { orderId: string }) => {

  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const t = getMessages(lang);
  
  useEffect(() => {
        setLang(getClientLanguage());
      }, []);

  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full">
      <div className="flex flex-col gap-y-4 center p-4 md:items-center">
        <Text className="text-ui-fg-base text-xl">
          {t.demo.test_created}! 🎉
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          {t.demo.completed_admin}
        </Text>
        <Button
          className="w-fit"
          size="xlarge"
          onClick={() => resetOnboardingState(orderId)}
        >
          {t.demo.completed_setup}
        </Button>
      </div>
    </Container>
  )
}

export default OnboardingCta;
