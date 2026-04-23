"use client";

import { useState, useEffect } from "react";

import { Table, Text, clx } from "@medusajs/ui";
import { updateLineItem } from "@lib/data/cart";
import { HttpTypes } from "@medusajs/types";
import CartItemSelect from "@modules/cart/components/cart-item-select";
import ErrorMessage from "@modules/checkout/components/error-message";
import DeleteButton from "@modules/common/components/delete-button";
import LineItemOptions from "@modules/common/components/line-item-options";
import LineItemPrice from "@modules/common/components/line-item-price";
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Spinner from "@modules/common/icons/spinner";
import Thumbnail from "@modules/products/components/thumbnail";

import { getClientLanguage } from "@lib/i18n";
import { getMessages, type Lang } from "@lib/messages";


type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {

  const [lang, setLang] = useState<Lang>("de");
  const t = getMessages(lang);
  
    useEffect(() => {
      setLang(getClientLanguage());
    }, []);

  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
        <div className="text-sm text-ui fg-muted">
          {!!item.metadata?.width && <div>{t.product.width}: {item.metadata.width as number} mm</div>}
          {!!item.metadata?.height && <div>{t.product.height}: {item.metadata.height as number} mm</div>}
          {!!item.metadata?.cushion_color && (
            <div>{t.product_properties.cushion_color}: {String(item.metadata.cushion_color)}</div>
          )}
          {!!item.metadata?.embossing_position && (
            <div>{t.product_properties.embossing_posiiton}: {String(item.metadata.embossing_position)}</div>
          )}
          {!!item.metadata?.design_image && (
            <div className="mt-2">
              <Text className="txt-small text-ui-fg-subtle">{t.product_properties.design}:</Text>
              <img src={decodeURIComponent(item.metadata.design_image as string)} alt="Design" className="w-24 h-24 object-contain border border-gray-200 rounded-md mt-1" />
            </div>
          )}
        </div>
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2 items-center w-28">
            <DeleteButton id={item.id} data-testid="product-delete-button" bundle_id={item.metadata?.bundle_id as string}>
              {item.metadata?.bundle_id !== undefined ? "Entferne Bundle" : "Entfernen"}
            </DeleteButton>
            <CartItemSelect
              aria-label={t.product.quantity}
              title={t.product.quantity}
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="w-14 h-10 p-4"
              data-testid="product-select-button"
            >
              {/* TODO: Update this with the v2 way of managing inventory */}
              {Array.from(
                {
                  length: Math.min(maxQuantity, 10),
                },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                )
              )}

              <option value={1} key={1}>
                1
              </option>
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item;
