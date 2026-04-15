import { Suspense } from "react";

import { listRegions } from "@lib/data/regions";
import { StoreRegion } from "@medusajs/types";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import CartButton from "@modules/layout/components/cart-button";
import SideMenu from "@modules/layout/components/side-menu";
import LocaleSwitcher from "@modules/layout/components/locale-switcher";

import { getServerLanguage } from "@lib/i18n-server";
import { getMessages } from "@lib/messages";

export default async function Nav() 
{
  const lang = await getServerLanguage();
  const t = getMessages(lang);

  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-orange-950 border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full flex items-center gap-x-2">
              <SideMenu regions={regions} />
                <div className="flex small:hidden items-center">
                <LocaleSwitcher />
              </div>
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-white/70 hover:text-white uppercase"
              data-testid="nav-store-link"
            >{t.nav.shopName}
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="text-white/70 hover:text-white"
                href="/account"
                data-testid="nav-account-link"
              >
                {t.nav.account}
              </LocalizedClientLink>
              <LocaleSwitcher/>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-white/70 hover:text-white flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  {t.nav.cart} (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
