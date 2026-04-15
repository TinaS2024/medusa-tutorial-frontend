"use client";

import  { useEffect, useState } from "react";

import { login } from "@lib/data/customer";
import { LOGIN_VIEW } from "@modules/account/templates/login-template";
import ErrorMessage from "@modules/checkout/components/error-message";
import { SubmitButton } from "@modules/checkout/components/submit-button";
import Input from "@modules/common/components/input";
import { useActionState } from "react";

import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

  const Login = ({ setCurrentView }: Props) => {
  const [lang, setLang] = useState<"de" | "en" | "fr" | "nl">("de");
  
     useEffect(() => {
      setLang(getClientLanguage());
    }, []);
  
  const t = getMessages(lang);

  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6">{t.login_shop.welcome}</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        {t.login_shop.login_info}
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={t.login_shop.email}
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label={t.login_shop.password}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6 bg-orange-950 hover:bg-orange-900">
          {t.login_shop.login}
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        {t.login_shop.no_account} {" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
        >
          {t.login_shop.new_register}
        </button>
        
      </span>
    </div>
  )
}

export default Login;
