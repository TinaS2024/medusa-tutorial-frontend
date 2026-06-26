"use server";

import { sdk } from "@lib/config";

type BankDetails = {
  bank_account_holder: string | null
  bank_name: string | null
  bank_iban: string | null
  bank_bic: string | null
  bank_note: string | null
}

export const retrieveBankDetails = async (): Promise<BankDetails | null> => 
{
  return sdk.client
    .fetch<{ bank_details: BankDetails }>("/store/bank-details", {
      method: "GET",
      cache: "no-store",
    })
    .then(({ bank_details }) => bank_details)
    .catch(() => null)
}
