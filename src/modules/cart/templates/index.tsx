"use client";
import ItemsTemplate from "./items";
import Summary from "./summary";
import EmptyCartMessage from "../components/empty-cart-message";
import SignInPrompt from "../components/sign-in-prompt";
import Divider from "@modules/common/components/divider";
import { HttpTypes } from "@medusajs/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { addToCart } from "@lib/data/cart";

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
   const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("CartTemplate useEffect triggered.");
    const productId = searchParams.get("productId");
    const variantId = searchParams.get("variantId");
    const designImage = searchParams.get("designImage");
    const width = searchParams.get("width");
    const height = searchParams.get("height");
    const cushionColor = searchParams.get("cushionColor");
    const embossingPosition = searchParams.get("embossingPosition");

    console.log("URL Params:", { productId, variantId, designImage, width, height, cushionColor, embossingPosition });
    console.log("Current Cart:", cart);

    if (productId && variantId && designImage && width && height) 
    {
      const addProductToCart = async () => {
        console.log("Attempting to add product to cart...");
        if (!cart) 
        {
          console.warn("Cart is null, cannot add product.");
          return;
        }
        try {
          const countries = cart?.region?.countries || [];
          const countryCode = countries.length > 0 ? countries[0].iso_2 || "de" : "de"; 

          await addToCart({
            variantId: variantId,
            quantity: 1,
            countryCode: countryCode,
            metadata: {
              design_image: designImage,
              width: parseFloat(width),
              height: parseFloat(height),
              cushion_color: cushionColor || undefined,
              embossing_position: embossingPosition || undefined,
            },
          });
          console.log("Product added to cart successfully!");
          router.replace("/cart", undefined);
        } catch (error) {
          console.error("Error adding product to shopping cart:", error);
        }
      };
      addProductToCart();
    }
  }, [searchParams, router, cart]);
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
