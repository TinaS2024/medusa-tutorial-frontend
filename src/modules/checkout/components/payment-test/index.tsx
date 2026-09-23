"use client";

import { useState, useEffect } from "react";

import { Badge } from "@medusajs/ui";
import { getClientLanguage } from "@lib/i18n";
import { DEFAULT_LANG } from "@lib/languages";
import { getMessages, type Lang } from "@lib/messages";

const PaymentTest = ({ className }: { className?: string }) => {

  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
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
