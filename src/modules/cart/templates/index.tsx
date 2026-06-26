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
  productTitles,
  variantTitles,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  productTitles?: Record<string, string>
  variantTitles?: Record<string, string>
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const uploadDesignImage = async (raw: string, productId: string): Promise<string | null> => {
    try {
      const dataUrl = await (async () => {
        if (raw.startsWith("data:")) {
          return raw;
        }

        if (raw.startsWith("blob:")) {
          const blob = await fetch(raw).then((r) => r.blob());

          const reader = new FileReader();
          const result = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(String(reader.result ?? ""));
            reader.onerror = () => reject(new Error("Failed to read blob"));
            reader.readAsDataURL(blob);
          });

          return result;
        }

        return null;
      })();

      if (!dataUrl) {
        return null;
      }

      const resp = await fetch("/store/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: dataUrl,
          product_id: productId,
        }),
      });

      if (!resp.ok) 
      {
        return null;
      }

      const json = (await resp.json()) as { url?: string };

      return typeof json.url === "string" && json.url.length > 0 ? json.url : null;
    } catch {
      return null;
    }
  };

  const hasAutoAddedRef = useRef(false);
  const routeParams = useParams() as { countryCode?: string };

  useEffect(() => {
    console.log("CartTemplate useEffect triggered.");
    const getParam = (key: string) => searchParams.get(key) || undefined;

    const productId = searchParams.get("productId") || getParam("medusaProductId") || getParam("product_id");
    const variantId = getParam("variantId") || getParam("medusaVariantId") || getParam("variant_id");
    const designImage = getParam("designImage") || getParam("design_image");
    const designSvg = getParam("designSvg") || getParam("svg_url");
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

        let designImageToSave = designImage as string;

          if (
            typeof designImageToSave === "string" &&
            (designImageToSave.startsWith("data:") || designImageToSave.startsWith("blob:"))
          ) {
            const uploaded = await uploadDesignImage(designImageToSave, productId as string);
            if (uploaded) 
            {
              designImageToSave = uploaded;
            }
          }

          console.log("➡️ addToCart Metadaten:", { design_image: designImageToSave, svg_url: designSvg,width, height,});

          await addToCart({
            variantId: variantId!,
            quantity: 1,
            countryCode,
            metadata: {
              design_image: designImageToSave,
              svg_url: designSvg,
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
              <ItemsTemplate cart={cart} productTitles={productTitles} variantTitles={variantTitles}/>
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
