"use server";

import { sdk } from "@lib/config";
import { getCacheOptions } from "./cookies";

type BankDetails = {
  bank_account_holder: string | null
  bank_name: string | null
  bank_iban: string | null
  bank_bic: string | null
  bank_note: string | null
}

export const retrieveBankDetails = async (): Promise<BankDetails | null> => 
{
   const next = {
    ...(await getCacheOptions("bank")),
    revalidate: 60,
  }

  return sdk.client
    .fetch<{ bank_details: BankDetails }>("/store/bank-details", {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ bank_details }) => bank_details)
    .catch(() => null)
}
