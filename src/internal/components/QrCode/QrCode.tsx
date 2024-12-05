import { QRCodeSVG, type QRCodeSVGProps } from './QrCodeSvg';
import {
  QR_CODE_SIZE,
  QR_LOGO_SIZE,
  QR_LOGO_RADIUS,
  QR_LOGO_BACKGROUND_COLOR,
} from './gradientConstants';

export function QRCodeComponent({
  value,
  size,
  logo,
  logoSize,
  logoBackgroundColor,
  logoBorderRadius,
  gradientType,
}: QRCodeSVGProps) {
  return (
    <QRCodeSVG
      value={value}
      logo={logo}
      size={size ?? QR_CODE_SIZE}
      logoSize={logoSize ?? QR_LOGO_SIZE}
      logoBackgroundColor={logoBackgroundColor ?? QR_LOGO_BACKGROUND_COLOR}
      logoBorderRadius={logoBorderRadius ?? QR_LOGO_RADIUS}
      gradientType={gradientType}
    />
  );
}
