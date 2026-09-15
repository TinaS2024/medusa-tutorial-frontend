# Bündel (Bundles) im Shop

Stand: 2026-09-15

## Kurzfassung

- Im Code stecken **zwei** Bündel-Mechanismen. Aktiv ist derzeit nur einer: das **Design-Set**, bei dem das Bündel-Produkt wie ein normales Produkt über den Designer bestellt wird.
- Der zweite, **klassische Bündel-Weg** (Varianten pro Bestandteil wählen, `BundleActions`) ist durch eine unscheinbare Stelle in `listProducts` nicht erreichbar – siehe [Die Falle](#die-falle).
- **Diese Stelle nicht einfach „reparieren".** Das Design-Set hängt davon ab. Wer beide Wege braucht, muss vorher einen Umschalter pro Bündel einbauen – siehe [Wenn beide Bündel-Arten gebraucht werden](#wenn-beide-bündel-arten-gebraucht-werden).
- **Der Produktimport überträgt keine Bündel.** Nach einem Import in eine andere Umgebung, zum Beispiel von lokal auf den Server, müssen Bündel dort über das Admin-Formular neu angelegt werden – siehe [Bündel in eine andere Umgebung übertragen](#bündel-in-eine-andere-umgebung-übertragen).

## So funktionieren Bündel derzeit: das Design-Set

Beispiel: „Alu-Schilder" – Gold-, Silber- und Bronzeschild, rund, 50 mm, ein gemeinsames Motiv, Setpreis 21 € netto (24,99 € brutto).

**Anlegen (Admin):** Über das Formular „Bundled Products" entstehen ein Bündel, ein damit verknüpftes Bündel-Produkt und die Verknüpfungen zu den Bestandteilen.

**Form und Größe** stehen in den Metadaten des **Bündel-Produkts** (`designer_shape`, `designer_category`). Die Bestandteile behalten ihre eigenen Metadaten: Das Silberschild ist einzeln rechteckig und nur im Bündel rund. Die Form hängt also vom Zusammenhang ab, nicht vom Produkt. Das ist gewollt.

**Preis:** Der Setpreis ist der normale Admin-Preis des Bündel-Produkts (netto). Einen Bündelrabatt bildet man einfach über einen entsprechend niedrigen Setpreis ab.

**Im Shop:** Das Bündel-Produkt verhält sich wie jedes andere Produkt – `ProductActions`, Designer, eine Warenkorbposition mit Design.

**Export nach GPE** (`medusa-backend/src/subscribers/order-placed-gpe.ts`): Der Subscriber lädt alle Bündel und löst eine bestellte Bündel-Position in **eine Position je Bestandteil** auf:

| Feld | Wert |
|---|---|
| Produkt, Titel, `gpe_id` | vom jeweiligen Bestandteil |
| Design, Form, Maße | vom bestellten Bündel-Produkt |
| `quantity` | Menge des Bestandteils im Bündel × bestellte Menge |
| `unit_price` | Setpreis ÷ Summe der Bestandteil-Mengen, gleicher Anteil pro Stück |
| `bundle` | Produkt-ID und Titel des Bündels (Herkunftsvermerk) |

Der Setpreis sollte glatt teilbar sein (21 € ÷ 3 = 7 €). Sonst schreibt der Subscriber eine Warnung, und die Summe der Positionen weicht um Cent-Beträge ab.

**Ohne GPE** ist nichts weiter nötig: Die Bestellung enthält dann einfach eine Position „Alu-Schilder". Die Auflösung in Bestandteile betrifft nur den Export.

## Die Falle

Die Produktseite fragt das Bündel ab, bekommt es aber nie:

1. `src/app/[countryCode]/(main)/products/[handle]/page.tsx` ruft `listProducts` mit `queryParams.fields` inklusive `*bundle` auf und lädt nur dann die Bündeldaten (`getBundleProduct`), wenn `pricedProduct.bundle` gesetzt ist.
2. `src/lib/data/products.ts` → `listProducts` übernimmt aus `queryParams` nur ausgewählte Schlüssel (`q`, `handle`, `id`, `category_id` …) und setzt `fields` fest. **`fields` und `expand` des Aufrufers werden verworfen.** `pricedProduct.bundle` bleibt deshalb immer leer.
3. `src/modules/products/templates/product-actions-wrapper/index.tsx` zeigt `BundleActions` nur, wenn `bundle` gesetzt ist – also nie. Es erscheint immer `ProductActions`.

**Was passiert, wenn man das repariert:** Alle Bündel-Produkte zeigen dann `BundleActions` statt des Designers. Das Design-Set bricht:

- kein Designer, also kein Motiv
- die Bestandteile landen ohne `svg_url` im Warenkorb, und der GPE-Export überspringt sie – bei einer reinen Bündelbestellung entsteht gar keine Datei in `gpe-outbox`
- jeder Bestandteil kostet den reinen Admin-Preis, ohne Flächenaufschlag und ohne Setpreis
- bei personalisierten Bestandteilen zeigt die Bündelseite keinen Preis an, weil `ProductPrice` ohne Maße abbricht

## Der klassische Bündel-Weg (derzeit nicht erreichbar)

Der Code dafür ist vorhanden, aber unvollständig:

```
bundle-actions/index.tsx
  → addBundleToCart            (src/lib/data/cart.ts)
  → POST /store/carts/:id/line-item-bundles
  → add-bundl-to-cart.tsx      (medusa-backend/src/workflows)
  → prepare-bundle-cart-data.ts
  → Medusas addToCartWorkflow
```

Bekannte Lücken:

- Die Route nimmt pro Bestandteil nur `item_id` und `variant_id` an – kein Design, keine Maße.
- Die Preise sind die reinen Admin-Preise der Varianten. Ein Setpreis oder Flächenaufschlag wird nicht berechnet.
- Positionen ohne Design überspringt der GPE-Export.
- Die eigene Bündel-Liste in der Übersicht ist in `src/modules/store/templates/paginated-products.tsx` auskommentiert (`listBundles`, `BundlePreview`).
- `src/lib/util/get-bundle-price.ts` erwartet `calculated_price` am Bündel, das `/store/bundle-products` nicht liefert. Die Funktion `variantPrice` darin übergibt sich selbst statt einer Variante; sie wird aber nicht verwendet.

Für nicht personalisierte Produkte ohne GPE wäre der Weg nach Behebung der Falle grundsätzlich brauchbar.

## Wenn beide Bündel-Arten gebraucht werden

Shopbetreiber sollen auch „normale" Bündel anlegen können. Dafür braucht es einen **Umschalter pro Bündel**, bevor die Falle behoben wird. Vorschlag, nicht umgesetzt:

1. Metadatum am Bündel-Produkt, zum Beispiel `bundle_mode: "design_set"` oder `"classic"`.
2. `listProducts` gibt die benötigten Felder weiter, damit `bundle` ankommt.
3. `product-actions-wrapper` zeigt `BundleActions` nur bei `bundle_mode === "classic"`, sonst `ProductActions`.
4. Der Subscriber löst nur Design-Sets auf. Klassische Bündel-Positionen ohne Design würden weiterhin übersprungen – soll der klassische Weg mit GPE funktionieren, müssen Route und Vorbereitungsschritt Design-Daten mitnehmen.

## Bündel in eine andere Umgebung übertragen

**Der Produktimport überträgt keine Bündel.** Er legt nur die Produkte an. Das Bündel selbst, seine Bestandteile und die Verknüpfungen liegen in eigenen Tabellen des Bündel-Moduls (`bundle`, `bundle_item` und die zugehörigen Link-Tabellen) und werden nicht mitgenommen. Dazu kommt, dass die IDs in jeder Umgebung andere sind – Bündel lassen sich also auch nicht einfach per ID nachtragen.

**So äußert es sich:** Das Bündel-Produkt, zum Beispiel „Alu-Schilder", existiert nach dem Import mit Preis und Metadaten und lässt sich ganz normal bestellen. Es ist aber mit keinem Bündel verknüpft, und der Subscriber findet nichts zum Auflösen. In `gpe-outbox` steht dann nur **eine** Position statt einer je Bestandteil – ohne Fehlermeldung. In der Backend-Ausgabe erkennt man es daran, dass die ID des Bündel-Produkts in der Zeile `[GPE] Bündel geladen: [ … ]` fehlt.

**Vorgehen nach einem Import:**

1. Jedes Bündel in der Zielumgebung über das Admin-Formular „Bundled Products" neu anlegen und die Bestandteile auswählen.
2. Das Formular erzeugt dabei ein **neues** Bündel-Produkt; ein vorhandenes lässt sich nicht verknüpfen. Am neuen Produkt Preis und Metadaten eintragen (`designer_shape`, `designer_category` usw.).
3. Das importierte, unverknüpfte Bündel-Produkt löschen oder unveröffentlichen, damit es niemand bestellt.
4. Mit einer Testbestellung prüfen: In `gpe-outbox` müssen so viele Positionen stehen, wie das Bündel Bestandteile hat.

## Offene Punkte

- **`gpe_id` für Bestandteile:** Eine ID pro Produkt kann nicht zugleich die rechteckige und die runde Ausführung abbilden, und `order2gpe` übergibt `designer_shape` nicht an GPE (die Form kommt nur über das Motiv an). Zu entscheiden: getrennte GPE-Produkte für die runde Ausführung (ID zum Beispiel in den Metadaten des Bündel-Produkts) oder die Form als Option am selben GPE-Produkt.
- **Bündel beim Import:** Der Produktimport überträgt Bündel bisher nicht. Eine Möglichkeit, Bündel samt Bestandteilen und Verknüpfungen zu exportieren und in einer anderen Umgebung wieder anzulegen, gibt es noch nicht. Bis dahin gilt das Vorgehen aus [Bündel in eine andere Umgebung übertragen](#bündel-in-eine-andere-umgebung-übertragen).
- **Dreifacher Upload:** `order2gpe` lädt das gemeinsame Motiv für jede Bestandteil-Position einzeln herunter und hoch.

## Beteiligte Dateien

| Bereich | Datei |
|---|---|
| Produktseite | `src/app/[countryCode]/(main)/products/[handle]/page.tsx` |
| Produktabfrage (Falle) | `src/lib/data/products.ts` → `listProducts` |
| Weiche Produkt/Bündel | `src/modules/products/templates/product-actions-wrapper/index.tsx` |
| Klassischer Bündel-Weg | `src/modules/products/components/bundle-actions/index.tsx`, `src/lib/data/cart.ts` → `addBundleToCart` |
| Export-Auflösung | `medusa-backend/src/subscribers/order-placed-gpe.ts` |
| Bündel anlegen | `medusa-backend/src/admin/components/create-bundled-product.tsx`, `medusa-backend/src/workflows/create-bundled-product.tsx` |
| Bündel in den Warenkorb | `medusa-backend/src/workflows/add-bundl-to-cart.tsx`, `medusa-backend/src/workflows/steps/prepare-bundle-cart-data.ts` |
| Datenmodell und Verknüpfungen | `medusa-backend/src/modules/bundled-product/models/`, `medusa-backend/src/links/bundle-product.tsx`, `medusa-backend/src/links/bundle-item-product.tsx` |
