"use client";
import ItemsTemplate from "./items";
import Summary from "./summary";
import EmptyCartMessage from "../components/empty-cart-message";
import SignInPrompt from "../components/sign-in-prompt";
import Divider from "@modules/common/components/divider";
import { HttpTypes } from "@medusajs/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { addToCart } from "@lib/data/cart";
import { get } from "lodash";

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasAutoAddedRef = useRef(false);
  const routeParams = useParams() as { countryCode?: string };

  useEffect(() => {
    console.log("CartTemplate useEffect triggered.");
    const getParam = (key: string) => searchParams.get(key) || undefined;

    const productId = searchParams.get("productId") || getParam("medusaProductId") || getParam("product_id");
    const variantId = getParam("variantId") || getParam("medusaVariantId") || getParam("variant_id");
    const designImage = getParam("designImage") || getParam("design_image");
    const width = getParam("width");
    const height = getParam("height");
    const cushionColor = searchParams.get("cushionColor");
    const embossingPosition = getParam("embossingPosition") || getParam("embossing_position");

    const shouldAutoAdd = Boolean(productId && variantId && designImage && width && height);

    if (!shouldAutoAdd || hasAutoAddedRef.current) 
    {
      return;
    }

    hasAutoAddedRef.current = true;

    console.log("URL Params:", {
      productId,
      variantId,
      designImage,
      width,
      height,
      cushionColor,
      embossingPosition,
    });
    console.log("Current Cart:", cart);

    if (productId && variantId && designImage && width && height) 
    {
      const addProductToCart = async () => {
        try {
        const fallbackCountryCode = cart?.region?.countries?.[0]?.iso_2?.toLowerCase() || "de";
        const countryCode = routeParams.countryCode?.toLowerCase() || fallbackCountryCode; 

          await addToCart({
            variantId: variantId!,
            quantity: 1,
            countryCode,
            metadata: {
              design_image: designImage,
              width: parseFloat(width!),
              height: parseFloat(height!),
              cushion_color: cushionColor || undefined,
              embossing_position: embossingPosition || undefined,
            },
          });
          console.log("Product added to cart successfully!");
          router.replace(`/${countryCode}/cart`, undefined);
        } catch (error) {
          hasAutoAddedRef.current = false;
        console.error("Error adding product to shopping cart:", error);
        }
      };
      addProductToCart();
    }
  }, [searchParams, router, cart, routeParams.countryCode]);
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-white py-6 gap-y-6">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="bg-white py-6">
                      <Summary cart={cart as any} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate;
