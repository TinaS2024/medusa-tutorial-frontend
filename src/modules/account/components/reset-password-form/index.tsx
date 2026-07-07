"use client";

import { useEffect, useState, useActionState } from "react";
import { resetPasswordWithToken } from "@lib/data/customer";
import ErrorMessage from "@modules/checkout/components/error-message";
import { SubmitButton } from "@modules/checkout/components/submit-button";
import Input from "@modules/common/components/input";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";

type ActionState = { ok: boolean; error: string | null } | null;

const ResetPasswordForm = ({ token, email }: { token: string; email: string }) => {
  const [lang, setLang] = useState<"de" | "en" | "fr" | "nl">("de");
  useEffect(() => setLang(getClientLanguage()), []);
  const t = getMessages(lang);

  const [state, action] = useActionState<ActionState, FormData>(
    resetPasswordWithToken,
    null
  );

  const error =
    state?.error === "missing_fields"
      ? t.login_shop.reset_password_missing_fields
      : state?.error === "password_mismatch"
        ? t.login_shop.reset_password_mismatch
        : state?.ok === false
          ? state.error
          : null;

  if (state?.ok) {
    return (
      <div className="max-w-sm w-full flex flex-col items-center text-center gap-y-4">
        <h1 className="text-large-semi uppercase">
          {t.login_shop.forgot_password_title}
        </h1>
        <p className="text-base-regular">{t.login_shop.reset_password_done}</p>
        <LocalizedClientLink href="/account" className="underline">
          {t.login_shop.log_in}
        </LocalizedClientLink>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-sm w-full text-center">
        <p className="text-base-regular">
          {t.login_shop.reset_password_invalid_link}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm w-full flex flex-col items-center">
      <h1 className="text-large-semi uppercase mb-6">
        {t.login_shop.reset_password_page_title}
      </h1>
      <p className="text-center text-base-regular mb-8">
        {t.login_shop.reset_password_page_info}
      </p>
      <form noValidate className="w-full" action={action}>
        <input type="hidden" name="token" value={token} />
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={t.login_shop.email}
            name="email_display"
            type="email"
            defaultValue={email}
            disabled
          />
          <Input
            label={t.login_shop.password_new}
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          <Input
            label={t.login_shop.password_confirm}
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>
        <ErrorMessage error={error} />
        <SubmitButton className="w-full mt-6 bg-orange-950 hover:bg-orange-900">
          {t.login_shop.reset_password_set}
        </SubmitButton>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
