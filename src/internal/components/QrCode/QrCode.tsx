import { QRCodeSVG, type QRCodeSVGProps } from './QrCodeSvg';
import {
  QR_CODE_SIZE,
  QR_LOGO_SIZE,
  QR_LOGO_RADIUS,
  QR_LOGO_BACKGROUND_COLOR,
} from './gradientConstants';

export function QRCodeComponent({
  color,
  value,
  logo,
  isAsyncDataFetched,
  gradientType,
}: QRCodeSVGProps) {

  return (
    <QRCodeSVG
      size={QR_CODE_SIZE}
      logo={logo}
      logoSize={QR_LOGO_SIZE}
      logoBackgroundColor={QR_LOGO_BACKGROUND_COLOR}
      logoBorderRadius={QR_LOGO_RADIUS}
      value={value}
      color={color}
      isAsyncDataFetched={isAsyncDataFetched}
      gradientType={gradientType}
    />
  );
}
