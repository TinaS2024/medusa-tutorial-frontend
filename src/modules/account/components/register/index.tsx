"use client";

import { useActionState } from "react";
import Input from "@modules/common/components/input";
import { LOGIN_VIEW } from "@modules/account/templates/login-template";
import ErrorMessage from "@modules/checkout/components/error-message";
import { SubmitButton } from "@modules/checkout/components/submit-button";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { signup } from "@lib/data/customer";

import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => 
  {

  const lang = getClientLanguage();
  const t = getMessages(lang);

  const [message, formAction] = useActionState(signup, null);

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        {t.login_shop.account_register}
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        {t.login_shop.account_info}
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={t.login_shop.first_name}
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label={t.login_shop.last_name}
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label={t.login_shop.email}
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label={t.login_shop.phone}
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label={t.login_shop.password}
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          {t.login_shop.account_agreements}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            {t.login_shop.terms},
          </LocalizedClientLink>{" "}
       
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            {t.login_shop.conditions}
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton className="w-full mt-6 bg-orange-950 hover:bg-orange-900" data-testid="register-button">
          {t.login_shop.now_register}
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        {t.login_shop.have_account} <button
        type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          {t.login_shop.login}
        </button>
        .
      </span>
    </div>
  )
}

export default Register;
