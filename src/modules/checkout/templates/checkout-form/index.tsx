import { listCartShippingMethods } from "@lib/data/fulfillment";
import { listCartPaymentMethods } from "@lib/data/payment";
import { canPayByInvoice, isInvoice } from "@lib/util/invoice-payment";
import { cartContainsGiftCard, isInstantPayment } from "@lib/util/gift-card"
import { HttpTypes } from "@medusajs/types";
import Addresses from "@modules/checkout/components/addresses";
import Payment from "@modules/checkout/components/payment";
import Review from "@modules/checkout/components/review";
import Shipping from "@modules/checkout/components/shipping";

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  console.log("shippingMethods", shippingMethods)
  console.log("paymentMethods", paymentMethods)

  if (!shippingMethods || !paymentMethods) 
  {
    console.error("Error loading shipping methods");
    return null;
  }

  
  // Welche Zahlungsarten der Kunde sieht. Das ist nur fürs Auge – die
  // eigentlichen Sperren prüft der Server beim Bestellabschluss.
  //  - "Auf Rechnung" nur für Kunden mit Kundennummer.
  //  - Mit Geschenkkarte im Warenkorb nur Kartenzahlung, weil der Code
  //    direkt beim Bestellen entsteht.
  const containsGiftCard = cartContainsGiftCard(cart)

  const visiblePaymentMethods = paymentMethods
    .filter((method) => canPayByInvoice(customer) || !isInvoice(method.id))
    .filter((method) => !containsGiftCard || isInstantPayment(method.id))



  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} />

      <Payment cart={cart} availablePaymentMethods={visiblePaymentMethods} onlyCardPayment={containsGiftCard}/>

      <Review cart={cart} />
    </div>
  )
}
