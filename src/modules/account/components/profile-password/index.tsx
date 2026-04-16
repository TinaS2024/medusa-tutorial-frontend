"use client";

import React, { useEffect, useState, useActionState } from "react";
import Input from "@modules/common/components/input";
import AccountInfo from "../account-info";
import { HttpTypes } from "@medusajs/types";
import { toast } from "@medusajs/ui";

import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [lang, setLang] = useState<"de" | "en" | "fr" | "nl">("de");
  const t = getMessages(lang);

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);


  const [successState, setSuccessState] = React.useState(false);

  // TODO: Add support for password updates
  const updatePassword = async () => {
    toast.info("Password update is not implemented")
  }

  const clearState = () => {
    setSuccessState(false)
  }

  return (
    <form
      action={updatePassword}
      onReset={() => clearState()}
      className="w-full"
    >
      <AccountInfo
        label={t.login_shop.password}
        currentInfo={
          <span>The password is not shown for security reasons</span>
        }
        isSuccess={successState}
        isError={false}
        errorMessage={undefined}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t.login_shop.password_old}
            name="old_password"
            required
            type="password"
            data-testid="old-password-input"
          />
          <Input
            label={t.login_shop.password_new}
            type="password"
            name="new_password"
            required
            data-testid="new-password-input"
          />
          <Input
            label={t.login_shop.password_confirm}
            type="password"
            name="confirm_password"
            required
            data-testid="confirm-password-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword;
