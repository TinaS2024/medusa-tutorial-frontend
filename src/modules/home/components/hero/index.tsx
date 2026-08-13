
"use client";

import  { useEffect, useState } from "react";

import { Heading } from "@medusajs/ui";
import Image from "next/image";

import { getClientLanguage } from "@lib/i18n";
import { getMessages } from "@lib/messages";


const Hero = ({ heroUrl}: { heroUrl?: string | null }) => {

  const [lang, setLang] = useState<"de" | "en" | "fr" | "nl">("de");
  const t = getMessages(lang);

   useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  return (
    <div className="h-[75vh] w-full relative bg-[var(--brand-hero-bg)]">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >

          </Heading>
          <Heading
            level="h2"
            className="text-xsleading-10 text-ui-fg-subtle font-normal"
          >
            <div className="mb-5">
                       <Image src={heroUrl || "/Hero.png"} alt="Hero Image" width={400} height={200} unoptimized/>
            </div>
            
            <a href="/store" className="bg-[var(--brand-primary)] rounded-xl text-base-regular text-[var(--brand-button-text)] p-2">{t.cart.empty.cta}</a>
          </Heading>
        </span>
       
      </div>
    </div>
  )
}

export default Hero;
