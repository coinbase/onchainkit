import { useMemo } from 'react';

type RenderLogoProps = {
  size: number;
  logo: React.ReactNode | undefined;
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
      <g transform={`translate(${logoPosition}, ${logoPosition})`}>
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
            <rect
              width={logoSize}
              height={logoSize}
              rx={logoBorderRadius}
              ry={logoBorderRadius}
            />
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
          <g
            width={logoSize}
            height={logoSize}
            clipPath="url(#clip-logo)"
          >
            {logo}
          </g>
        </g>
      </g>
    );
  }, [logo, logoBackgroundColor, logoBorderRadius, logoMargin, logoSize, size]);
  return svgLogo;
}
