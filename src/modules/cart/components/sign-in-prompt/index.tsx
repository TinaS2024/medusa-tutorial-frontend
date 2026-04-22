"use client";

import { useState, useEffect } from "react";
import { Button, Heading, Text } from "@medusajs/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

import { getClientLanguage } from "@lib/i18n";
import { getMessages, type Lang } from "@lib/messages";

const SignInPrompt = () => {
  const [lang, setLang] = useState<Lang>("de");
  const t = getMessages(lang);

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);


  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
          {t.login_shop.have_account}
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          {t.login_shop.here_register}
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10" data-testid="sign-in-button">
            {t.login_shop.log_in}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt;
