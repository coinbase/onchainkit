import { useMemo } from 'react';

type RenderLogoProps = {
  size: number;
  logo: { uri: string } | undefined;
  logoSize: number;
  logoBackgroundColor: string;
  logoMargin: number;
  logoBorderRadius: number;
};

export function useLogo({
  size,
  logo,
  logoSize,
  logoBackgroundColor,
  logoMargin,
  logoBorderRadius,
}: RenderLogoProps) {
  const svgLogo = useMemo(() => {
    if (!logo) {
      return;
    }
    const logoPosition = (size - logoSize - logoMargin * 2) / 2;
    const logoBackgroundSize = logoSize + logoMargin * 2;
    const logoBackgroundBorderRadius =
      logoBorderRadius + (logoMargin / logoSize) * logoBorderRadius;

    return (
      <g x={logoPosition} y={logoPosition}>
        <defs>
          <clipPath id="clip-logo-background">
            <rect
              width={logoBackgroundSize}
              height={logoBackgroundSize}
              rx={logoBackgroundBorderRadius}
              ry={logoBackgroundBorderRadius}
            />
          </clipPath>
          <clipPath id="clip-logo">
            <rect width={logoSize} height={logoSize} rx={logoBorderRadius} ry={logoBorderRadius} />
          </clipPath>
        </defs>
        <g>
          <rect
            width={logoBackgroundSize}
            height={logoBackgroundSize}
            fill={logoBackgroundColor}
            clipPath="url(#clip-logo-background)"
          />
        </g>
        <g x={logoMargin} y={logoMargin}>
          <image
            width={logoSize}
            height={logoSize}
            preserveAspectRatio="xMidYMid slice"
            href={logo.uri}
            clipPath="url(#clip-logo)"
          />
        </g>
      </g>
    );
  }, [logo, logoBackgroundColor, logoBorderRadius, logoMargin, logoSize, size]);
  return svgLogo;
}
