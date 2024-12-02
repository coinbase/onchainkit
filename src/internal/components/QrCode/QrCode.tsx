// import { useIsSmallScreen } from ':rn/shared/hooks/useIsSmallScreen';

import { QRCodeSVG, type QRCodeSVGProps } from './QrCodeSvg';

export const QR_CODE_SIZE = 237;
export const QR_CODE_SMALL_SIZE = 150;
export const QR_LOGO_SIZE = 50;
export const QR_LOGO_RADIUS = 25;

export function QRCodeComponent({
  color = '#000000',
  value,
  logo,
  isAsyncDataFetched,
  gradientType,
}: QRCodeSVGProps) {
  // const isSmallScreen = useIsSmallScreen();

  return (
    <QRCodeSVG
      size={QR_CODE_SIZE}
      logo={logo}
      logoSize={QR_LOGO_SIZE}
      logoBorderRadius={QR_LOGO_RADIUS}
      value={value}
      color={color}
      isAsyncDataFetched={isAsyncDataFetched}
      gradientType={gradientType}
    />
  );
}
