import QRCode from "qrcode";

/** QR code data URL (PNG) che apre la pagina evento. */
export async function generateEventQrDataUrl(eventUrl: string): Promise<string> {
  return QRCode.toDataURL(eventUrl, {
    width: 420,
    margin: 2,
    errorCorrectionLevel: "M",
    color: {
      dark: "#0b1220",
      light: "#ffffff",
    },
  });
}
