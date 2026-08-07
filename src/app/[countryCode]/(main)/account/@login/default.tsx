import LoginTemplate from "@modules/account/templates/login-template";

/**
 * Rückfallseite für den Anmeldebereich.
 *
 * Bei parallelen Bereichen löst Next.js jede Adresse in beiden Bereichen auf –
 * auch in dem, der gerade nicht angezeigt wird. Ohne diese Datei findet der
 * Anmeldebereich für /account/profile nichts, und die ganze Seite gilt als
 * nicht vorhanden.
 */
export default function LoginDefault() 
{
  return <LoginTemplate />
}
