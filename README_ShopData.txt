Wichtige Metadata die im Admin-Bereich des Shops eingesetzt werden können:

- thumbail: Path                      ... Pfad zu einem Produktbild im Public-Ordner des Storefront
- has_cushion: Boolean                ... schaltet Kissenoptionen für Stempel frei
- is_personalized: Boolean            ... schaltet individuele Breiten-und Höhenangaben frei
- is_designable: Boolean              ... zeigt Button zum Designer
- is_giftcard: Boolean                         ... markiert ein Produkt als Geschenkekarte
- max_width: Number                   ... begrenzt die maximale Breite eines Produktes
- max_height: Number                  ... begrenzt die maximale Höhe eins Produktes
- dimension_price_factor: Number      ... übernimmt Preisfaktor
- default_variant_id: String          ... übernimmt ID der Default-Produkt-Variante
- default_background_color: String    ... übergibt die Hintergrundfarbe eines Schildes
- designer_shape: String              ... Form im Designer: "rect" | "round" | "oval"
- designer_category: String           ... Kategorie im Designer: "stamp" | "self_inking" | "shield" | "wooden_shield" | "emboss"
- design_inset_mm: Number             ... unbedruckter Rand des Stempels in mm


Optionale Metadata für das Designer-backend im Admin-Bereich des Shops (technischer Name):
- cushion_color
- pencolor
- engraving_color
- background_color
- embossing_position
- material

Derzeitige Produktbeispiele im Medusa-Store:
- Trodat Printy
- Colop Printer
- Alu Goldschild, Silberschild, Bronzeschild
- Alu Schild Weiß, Schwarz, Gelb
- Prägestempel
- Holzstempel
- Wiegestempel
- Siegelstempel
- Kugelschreiberstempel
- Fleischbeschaustempel
- Brennstempel
- Geschenkekarte

Hinweise für den Admin von Medusa:
- Nach Änderungen im Backend sollte der .next-Ordner im Storefront gelöscht werden, damit alte Daten überschrieben werden
- Breite und Höhe von Produktvarianten können erst nach Erstellung einer Produktvariante eingestellt werden mit Klick auf ... (sind etwas versteckt)
- Produkte mit der Meta-Eigenschaft is_personalized sollten eine max_width und max_height zusätzlich in den Metadaten drinnen stehen haben
- Vorschaubilder von Produkten im Admin-Bereichen müssen extra mit Taste "T" aktiviert werden
- Damit Produkte im Store gesehen, gekauft und versendet werden können, muss folgendes getan werden:
    
    Sichtbar im Store:
    1. Produkte müssen veröffentlicht werden
    2. Produkte müssen dem richtigen Sales-Channel zugeordnet werden

    Kauf- und versandfähig:
    3. Alle Produktvarianten müssen Preise in der Region-Währung (EUR) haben
    4. Der Lagerbestand muss höher als 0 sein (oder Bestandsverwaltung aus)
    5. Eine Versand-Konfiguration (Shipping Profile) muss ausgewählt sein
