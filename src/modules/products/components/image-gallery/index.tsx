"use client";

import { HttpTypes } from "@medusajs/types";
import { Container } from "@medusajs/ui";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  // Varianten samt ihren Bildern (variants.images / variants.thumbnail)
  variants?: HttpTypes.StoreProductVariant[] | null
}

/**
 * Welche Bilder zeigen?
 *
 * Ist eine Variante gewählt (?v_id=… in der Adresse, gesetzt von
 * ProductActions) und hat sie eigene Bilder, nur diese. Hat sie nur ein
 * Vorschaubild, dieses. Sonst alle Bilder des Produkts – so wie bisher.
 */
const pickImages = (
  images: HttpTypes.StoreProductImage[],
  variants: HttpTypes.StoreProductVariant[] | null | undefined,
  variantId: string | null
): HttpTypes.StoreProductImage[] => {
  const variant: any = variantId ? variants?.find((v) => v.id === variantId) : undefined

  if (variant?.images?.length) {
    return variant.images
  }

  if (variant?.thumbnail) {
    return [{ id: `${variant.id}-thumbnail`, url: variant.thumbnail } as HttpTypes.StoreProductImage]
  }

  return images
}

const ImageGallery = ({ images, variants }: ImageGalleryProps) => {
  const searchParams = useSearchParams()
  const shownImages = pickImages(images, variants, searchParams.get("v_id"))

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        {shownImages.map((image, index) => {
          return (
            <Container
              key={image.id}
              className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
              id={image.id}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0 rounded-rounded"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery;
