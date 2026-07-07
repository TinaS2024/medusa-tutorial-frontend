"use client";

import { useEffect, useState, useActionState } from "react";
import { requestPasswordReset, resetPasswordWithToken} from "@lib/data/customer";
import ErrorMessage from "@modules/checkout/components/error-message";
import { SubmitButton } from "@modules/checkout/components/submit-button";
import Input from "@modules/common/components/input";
import Modal from "@modules/common/components/modal";

import { getMessages } from "@lib/messages";

type ForgotPasswordStep = "request" | "update" | "done"

type ActionState = {
  ok: boolean
  error: string | null
} | null

const ForgotPasswordForm = ({t, onClose, }: {t: ReturnType<typeof getMessages>; onClose: () => void }) => {
  const [step, setStep] = useState<ForgotPasswordStep>("request");

  const [requestState, requestAction] = useActionState<ActionState, FormData>(
    requestPasswordReset,
    null
  )

  const [updateState, updateAction] = useActionState<ActionState, FormData>(
    resetPasswordWithToken,
    null
  )

  useEffect(() => {
    if (requestState?.ok) 
    {
      setStep("done");
    }
  }, [requestState]);

  useEffect(() => {
    if (updateState?.ok) 
    {
      setStep("done");
    }
  }, [updateState]);

   const requestError = requestState?.error === "missing_fields" ? t.login_shop.reset_password_missing_fields
      : requestState?.ok === false
        ? requestState.error
        : null;

  const updateError = updateState?.error === "missing_fields" ? t.login_shop.reset_password_missing_fields
      : updateState?.error === "password_mismatch"
        ? t.login_shop.reset_password_mismatch
        : updateState?.ok === false
          ? updateState.error
          : null

  if (step === "done") 
{
    return (
      <>
        <Modal.Title>{t.login_shop.forgot_password_title}</Modal.Title>
        <Modal.Description>{t.login_shop.reset_password_link_sent}</Modal.Description>
        <Modal.Footer>
          <button
            type="button"
            onClick={onClose}
            className="bg-orange-950 hover:bg-orange-900 text-white px-4 py-2 rounded-rounded"
            data-testid="forgot-password-close"
          >
            {t.login_shop.close}
          </button>
        </Modal.Footer>
      </>
    )
  }

  return (
    <>
      <Modal.Title>{t.login_shop.forgot_password_title}</Modal.Title>
      <Modal.Description>
        {step === "request"
          ? t.login_shop.forgot_password_info
          : t.login_shop.reset_password_enter_token}
      </Modal.Description>

      <Modal.Body>
        <div className="w-full">
          {step === "request" ? (
            <form noValidate action={requestAction} className="w-full">
              <div className="flex flex-col gap-y-2 w-full">
                <Input
                  label={t.login_shop.email}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  data-testid="reset-email-input"
                />
              </div>
              <ErrorMessage error={requestError} data-testid="reset-request-error" />
              <SubmitButton
                className="w-full mt-4 bg-orange-950 hover:bg-orange-900"
                data-testid="reset-request-submit"
              >
                {t.login_shop.reset_password_send_link}
              </SubmitButton>
            </form>
          ) : (
            <form noValidate action={updateAction} className="w-full">
              <div className="flex flex-col gap-y-2 w-full">
                <Input
                  label={t.login_shop.reset_password_token}
                  name="token"
                  type="text"
                  autoComplete="one-time-code"
                  required
                  data-testid="reset-token-input"
                />
                <Input
                  label={t.login_shop.password_new}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  data-testid="reset-password-input"
                />
                <Input
                  label={t.login_shop.password_confirm}
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  required
                  data-testid="reset-password-confirm-input"
                />
              </div>
              <ErrorMessage error={updateError} data-testid="reset-update-error" />
              <SubmitButton
                className="w-full mt-4 bg-orange-950 hover:bg-orange-900"
                data-testid="reset-update-submit"
              >
                {t.login_shop.reset_password_set}
              </SubmitButton>
            </form>
          )}
        </div>
      </Modal.Body>
    </>
  )
}

export default ForgotPasswordForm;