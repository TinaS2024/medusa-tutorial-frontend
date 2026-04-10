"use client";

import { addToCart } from "@lib/data/cart";
import { useIntersection } from "@lib/hooks/use-in-view";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@medusajs/ui";
import Divider from "@modules/common/components/divider";
import OptionSelect from "@modules/products/components/product-actions/option-select";
import { isEqual } from "lodash";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import ProductPrice from "../product-price";
import { getCustomVariantPrice } from "@lib/data/products";
import MobileActions from "./mobile-actions";
import Input from "../../../common/components/input";


type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const TECHNICAL_OPTION_KEYS = {
  CUSHION_COLOR: "cushion_color",
  EMBOSSING_POSITION: "embossing_position",
  ENGRAVING_COLOR: "engraving_color",
  BACKGROUND_COLOR: "background_color",
  WIDTH: "width",
  HEIGHT: "height",
} as const;

const getOptionKeysMeta = (product: HttpTypes.StoreProduct) => 
{
  return (
    (product.metadata?.option_keys as Record<string, string> | undefined) ?? {}
  );
};

const findOptionByTechnicalKey = (
  product: HttpTypes.StoreProduct,
  key: string,
  optionKeysMeta: Record<string, string>
) => {
  return product.options?.find((opt) => optionKeysMeta[opt.id] === key);
};

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
  region,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [designerPrice, setDesignerPrice] = useState<number | null>(null);

  const optionKeysMeta = getOptionKeysMeta(product);

  const countryCode = useParams().countryCode as string;

  const searchParams = new URLSearchParams(window.location.search);
  const designImage = searchParams.get("designImage");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUploadClick = () =>{
    fileInputRef.current?.click();
  };
  const [uploadedImageData, setUploadedImageData] = useState<string | null>(null);

  const loadImage =(src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject)=>{
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    })
  }

  const [height,setHeight] = useState(Number(product.height) || 0);
  const [width,setWidth] = useState(Number(product.width) || 0);
  const maxHeight = Number(product.metadata?.max_height);
  const maxWidth = Number(product.metadata?.max_width);

  // If there is only 1 variant, preselect the options
  useEffect(() => {
  
    const defaultVariantId = (product.metadata as any)?.default_variant_id as | string | undefined;

    if (defaultVariantId && product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find(
        (v) => v.id === defaultVariantId
      )

      if (defaultVariant) {
        const variantOptions = optionsAsKeymap(defaultVariant.options)
        setOptions(variantOptions ?? {});
        return;
    }
  }

    if (product.variants?.length === 1) 
    {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {});
    }
  }, [product.variants, product.metadata])

  const selectedVariant = useMemo(() => {
  if (!product.variants || product.variants.length === 0) 
    {
      return;
    }

    return product.variants.find((v) => 
    {
      const variantOptions = optionsAsKeymap(v.options);
      return isEqual(variantOptions, options);
    })
  }, [product.variants, options]);


  const isStampMeta = product.metadata?.is_stampProduct;
  const isStampProduct = typeof isStampMeta === "boolean" ? isStampMeta : ["true"].includes(String(isStampMeta).toLowerCase());

  const isShieldMeta = product.metadata?.is_shieldProduct;
  const isShieldProduct = typeof isShieldMeta === "boolean" ? isShieldMeta : ["true"].includes(String(isShieldMeta).toLowerCase());

  const isRoundFormMeta = product.metadata?.is_roundForm;
  const isRoundFormMetaParsed = typeof isRoundFormMeta === "boolean" ? isRoundFormMeta : ["true"].includes(String(isRoundFormMeta).toLowerCase());

  const isOvalFormMeta = product.metadata?.is_ovalForm;
  const isOvalFormMetaParsed = typeof isOvalFormMeta === "boolean" ? isOvalFormMeta : ["true"].includes(String(isOvalFormMeta).toLowerCase());

  const isRoundFormVariantMeta = selectedVariant?.metadata?.is_roundForm;
  const isRoundFormVariantMetaParsed = typeof isRoundFormVariantMeta === "boolean" ? isRoundFormVariantMeta : ["true"].includes(String(isRoundFormVariantMeta).toLowerCase());

  const isOvalFormVariantMeta = selectedVariant?.metadata?.is_ovalForm;
  const isOvalFormVariantMetaParsed = typeof isOvalFormVariantMeta === "boolean" ? isOvalFormVariantMeta : ["true"].includes(String(isOvalFormVariantMeta).toLowerCase());

  const isRoundForm = isRoundFormMetaParsed || isRoundFormVariantMetaParsed;
  const isRoundFormProduct = isRoundForm;

  const isOvalForm = isOvalFormMetaParsed || isOvalFormVariantMetaParsed;
  const isOvalFormProduct = isOvalForm;

  const hasCushionMeta = product.metadata?.has_cushion;
  const hasCushion = typeof hasCushionMeta === "boolean" ? hasCushionMeta : ["true"].includes(String(hasCushionMeta).toLowerCase());


  console.log("ProductActions Debug:");
  console.log("  Product Title:", product.title);
  console.log("  Product Subtitle:", product.subtitle);
  console.log("  isStampProduct:", isStampProduct);
  console.log("  isRoundFormProduct", isRoundFormProduct);
  console.log("  isOvalFormProduct", isOvalFormProduct);
  console.log("  isShieldProduct:", isShieldProduct);
  console.log("  Product Options:", product.options);

  //Benutzerdefinierte Kissenfarbe für Selbstfärberstempel
  const cushionColorOption = findOptionByTechnicalKey(product,TECHNICAL_OPTION_KEYS.CUSHION_COLOR,optionKeysMeta) ?? product.options?.find((opt) => opt.title === "Kissenfarbe");
  let cushionColor = "";
  if (selectedVariant && cushionColorOption) 
  {
    const variantCushionColorValue = selectedVariant.options?.find(
      (vOpt) => vOpt.option_id === cushionColorOption.id
    )?.value;
    if (variantCushionColorValue) 
    {
      cushionColor = variantCushionColorValue;
    }
  }

  //Prägeposition für Prägestempel
  const embossingPositionOption = findOptionByTechnicalKey(product, TECHNICAL_OPTION_KEYS.EMBOSSING_POSITION, optionKeysMeta) ?? product.options?.find((opt) => opt.title === "Prägeposition");
  let embossingPosition = "";
  if (selectedVariant && embossingPositionOption) 
  {
    const variantEmbossingPositionValue = selectedVariant.options?.find(
      (vOpt) => vOpt.option_id === embossingPositionOption.id
    )?.value;
    if (variantEmbossingPositionValue) 
    {
      embossingPosition = variantEmbossingPositionValue;
    }
  }

  //Benutzerdefinierte Gravurfarbe für Schilder
  const engravedColorOption = findOptionByTechnicalKey(product, TECHNICAL_OPTION_KEYS.ENGRAVING_COLOR, optionKeysMeta) ?? product.options?.find((opt) => opt.title === "Gravurfarbe");
  let engravedColor = "";
  if (selectedVariant && engravedColorOption) {
    const variantengravedColorValue = selectedVariant.options?.find(
      (vOpt) => vOpt.option_id === engravedColorOption.id
    )?.value;
    if (variantengravedColorValue) {
      engravedColor = variantengravedColorValue;
    }
  }

  //Hintergrundfarbe für Schilder
  const backgroundColorOption = findOptionByTechnicalKey(product, TECHNICAL_OPTION_KEYS.BACKGROUND_COLOR,optionKeysMeta) ?? product.options?.find((opt) => opt.title === "Hintergrundfarbe");
  let backgroundColor = "";
  if (product.metadata?.default_background_color) 
  {
    backgroundColor = product.metadata.default_background_color as string;
  } else if (selectedVariant && backgroundColorOption) 
  {
    const variantbackgroundColorValue = selectedVariant.options?.find(
      (vOpt) => vOpt.option_id === backgroundColorOption.id
    )?.value;


    if (variantbackgroundColorValue) {
      backgroundColor = variantbackgroundColorValue;
    }
  }

  useEffect(() => {
    console.log("useEffect triggered for selectedVariant change.");
    console.log("Product options:", product.options);
    console.log("Selected variant:", selectedVariant);

    let currentWidth = Number(product.width) || 0; 
    let currentHeight = Number(product.height) || 0; 

    if (selectedVariant) 
      {
      const widthOptionDef = findOptionByTechnicalKey(product,TECHNICAL_OPTION_KEYS.WIDTH,optionKeysMeta) ?? product.options?.find((opt) => opt.title === "Breite");
      const heightOptionDef = findOptionByTechnicalKey(product,TECHNICAL_OPTION_KEYS.HEIGHT,optionKeysMeta) ?? product.options?.find((opt) => opt.title === "Höhe");

      if (widthOptionDef) 
      {
        const variantWidthValue = selectedVariant.options?.find((vOpt) => vOpt.option_id === widthOptionDef.id)?.value;
        if (variantWidthValue !== undefined && !isNaN(Number(variantWidthValue))) 
        {
          currentWidth = Number(variantWidthValue);
        }
      }
      if (heightOptionDef) 
      {
        const variantHeightValue = selectedVariant.options?.find((vOpt) => vOpt.option_id === heightOptionDef.id)?.value;
        if (variantHeightValue !== undefined && !isNaN(Number(variantHeightValue))) 
        {
          currentHeight = Number(variantHeightValue);
        }
      }
      if ((!currentWidth || isNaN(currentWidth)) && selectedVariant.width !== undefined && selectedVariant.width !== null)
      {
        const variantWidthValue = Number(selectedVariant.width);
        if(!isNaN(variantWidthValue))
        {
          currentWidth = variantWidthValue;
        }
      }
      if ((!currentHeight || isNaN(currentHeight)) && selectedVariant.height !== undefined && selectedVariant.height !== null)
      {
        const variantHeightValue = Number(selectedVariant.height);
        if(!isNaN(variantHeightValue))
        {
          currentHeight = variantHeightValue;
        }
      }
    }
      setWidth(currentWidth);
      setHeight(currentHeight);
  }, [selectedVariant, product.options, product.width, product.height]); 

  useEffect(() => {
    if (!selectedVariant) 
    {
      setDesignerPrice(null);
      return;
    }

    if (product.metadata?.is_personalized && (!width || !height)) {
      setDesignerPrice(null);
      return;
    }

    getCustomVariantPrice({
      variant_id: selectedVariant.id,
      region_id: region.id,
      metadata: product.metadata?.is_personalized ? { width, height } : undefined,
    })
      .then((price) => {
        setDesignerPrice(price);
      })
      .catch((error) => {
        console.error("Error fetching designer custom price:", error);
        setDesignerPrice(null);
      });
  }, [selectedVariant, region.id, width, height, product.metadata?.is_personalized]);

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
      metadata: {
        width,
        height,
        design_image: designImage,
        redionId: region.id,
      },
    })

    setIsAdding(false)
  }

  const drawImageOnCanvas = async (imageSrc: string) =>
   {
    const preview = canvasRef.current;
    if(!preview) return;

    const context = preview.getContext("2d");
    if(!context) return;

    try{
      
      const img = await loadImage(imageSrc);
      context.clearRect(0,0, preview.width, preview.height);
      context.drawImage(img, 0,0,preview.width, preview.height);
      console.log("Bild erfolgreich auf Canvas gezeichnet.");
    }catch(e){
      console.error("Fehler beim Laden oder Zeichnen des Bildes.", e);

    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
  {
    if(e.target.files && e.target.files[0])
    {
      const file = e.target.files[0];   
      const reader = new FileReader();
      reader.onload = (e) =>
      {
        const result = e.target?.result as string;
        if(result)
        {
          setUploadedImageData(result);
          drawImageOnCanvas(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  useEffect(()=>{
    if(uploadedImageData)
    {
      const apiEndpoint = "/store/upload";

      fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: uploadedImageData,
          product_id: product.id,
        }),
      })
      .then(response =>{
        if(!response.ok)
        {
          throw new Error(`Fehler beim Hochladen des Bildes: ${response.status}`);
        }
        return response.json();
      })
      .then(data =>{
        console.log("Upload erfolgreich:", data);
      })
      .catch(error =>{
        console.error("Fehler:", error);
      });
    }
  }, [uploadedImageData, product.id]);


  //Suchvariablen die von Medusa zum Designer geschickt werden

  const designerBaseUrl = "http://localhost:3000";
  const designerParams = new URLSearchParams({
    productId: product.id,
    width: String(width),
    height: String(height),
    title: product.title ?? "",
    subtitle: product.subtitle ?? "",
    material: product.material ?? "",
    variants: product.variants ? JSON.stringify(product.variants) : "false",
    cushion_color: cushionColor,
    engraving_color: engravedColor,
    background_color: backgroundColor,
    embossing_position: embossingPosition,
    returnUrl: `/products/${product.handle}`,
    medusaProductId: product.id,
    is_roundForm: String(isRoundForm),
    is_ovalForm: String(isOvalForm),
    is_shieldProduct: String(isShieldProduct),
  });

  if(selectedVariant)
  {
    designerParams.set("medusaVariantId", selectedVariant.id);
  }

  if (designerPrice != null) 
  {
    designerParams.set("price", String(designerPrice));
  }

  const designerLink = `${designerBaseUrl}?${designerParams.toString()}`

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).filter(option => {
                const techKey = optionKeysMeta[option.id];
                  const isCushionColor = techKey === TECHNICAL_OPTION_KEYS.CUSHION_COLOR || option.title === "Kissenfarbe";
                  const isEngravingColor = techKey === TECHNICAL_OPTION_KEYS.ENGRAVING_COLOR || option.title === "Gravurfarbe";
                  const isBackgroundColor = techKey === TECHNICAL_OPTION_KEYS.BACKGROUND_COLOR || option.title === "Hintergrundfarbe";
                  const isEmbossingPosition = techKey === TECHNICAL_OPTION_KEYS.EMBOSSING_POSITION || option.title === "Prägeposition";

                  if (isStampProduct || hasCushion) 
                  {
                    return isCushionColor || (!isEngravingColor && !isCushionColor);
                  }
                  if (isRoundFormProduct)
                  {
                   return isEmbossingPosition || (!isCushionColor && !isEngravingColor && !isBackgroundColor);
                  }
                  if (isShieldProduct) 
                  {
                    return isEngravingColor || isBackgroundColor;
                  }
                   return !isCushionColor && !isEngravingColor && !isBackgroundColor;
                }).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
        {!!product.metadata?.is_personalized && (
          <div className="flex flex-col gap-y-3">
            <span className="text-sm">Enter Dimensions</span>
            <div className="flex gap-3">
              <Input
                name="width"
                value={width}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setWidth(value);
                  if (isRoundForm) {
                    setHeight(value);
                  }
                }}
                label="Width (mm)"
                type="number"
                min={0}
                max={!isNaN(maxWidth) ? maxWidth : undefined}
              />
              <Input
                name="height"
                value={height}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setHeight(value);
                  if (isRoundForm) {
                    setWidth(value);
                  }
                }}
                label="Height (mm)"
                type="number"
                min={0}
                max={!isNaN(maxHeight) ? maxHeight : undefined}
              />

            </div>

          </div>

        )}

      </div>

        <ProductPrice product={product} variant={selectedVariant} region={region} metadata={{width,height}}/>

        {product.metadata?.is_printOnDemand === true && (
          <>
          <canvas ref={canvasRef} width="50" height="50" className="border border-gray-300 mt-4 mb-2"/>
          <input type="file" id="upload-image" accept="image/*" className="hidden" onChange={handleChange} ref={fileInputRef}/>
          <label htmlFor="upload-image" className="w-full">
            <Button className="w-full" onClick={handleUploadClick}>Upload Graphic</Button>
          </label>
          </>
        )}

    {product.metadata?.is_designable === true && (
                <a href={designerLink} className="w-full">
                <Button
                  variant="secondary"
                  className="w-full h-10 bg-gray-200 hover:bg-gray-300 text-black"
                  data-testid="go-to-designer-button"
                >
                  Zum Designer
                </Button>
              </a>
            )}
        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant ||
            (!!product.metadata?.is_personalized && (!width || !height))
          }
          variant="primary"
          className="w-full h-10 bg-orange-950 hover:bg-orange-900"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant && !options
            ? "Ausgewählte Variante"
            : !inStock || !isValidVariant
            ? "Ausverkauft"
            : "Zum Warenkorb hinzufügen"}
        </Button>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
