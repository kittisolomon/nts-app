import { useEffect, useRef } from "react";

type QRCodeGeneratorProps = {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
};

export default function QRCodeGenerator({
  value,
  size = 200,
  bgColor = "#FFFFFF",
  fgColor = "#000000",
}: QRCodeGeneratorProps) {
  const qrContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!qrContainerRef.current) return;

    const generateQRCode = async () => {
      // Dynamically import QRCode library to prevent SSR issues
      const QRCodeStyling = (await import("qr-code-styling")).default;
      
      const qrCode = new QRCodeStyling({
        width: size,
        height: size,
        type: "svg",
        data: value,
        image: undefined,
        dotsOptions: {
          color: fgColor,
          type: "rounded"
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          type: "extra-rounded"
        },
        cornersDotOptions: {
          type: "dot"
        },
      });
      
      // Clear previous QR code if exists
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = "";
        qrCode.append(qrContainerRef.current);
      }
    };

    generateQRCode();
  }, [value, size, bgColor, fgColor]);

  return (
    <div className="bg-white p-2 border border-gray-300 rounded-lg">
      <div ref={qrContainerRef} className="flex items-center justify-center" />
    </div>
  );
}
