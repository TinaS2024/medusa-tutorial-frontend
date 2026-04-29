"use client";

import { useState, useEffect } from "react";

import { Badge } from "@medusajs/ui";
import { getClientLanguage } from "@lib/i18n";
import { getMessages, type Lang } from "@lib/messages";

const PaymentTest = ({ className }: { className?: string }) => {

  const [lang, setLang] = useState<Lang>("de");
  const t = getMessages(lang);

  useEffect(() => {
      setLang(getClientLanguage());
    }, []);
  
  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">{t.function.warning}:</span> {t.function.test_info}
    </Badge>
  )
}

export default PaymentTest;
