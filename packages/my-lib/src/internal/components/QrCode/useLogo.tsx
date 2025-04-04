import React, { useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';
import { coinbaseWalletSvg } from '../../svg/coinbaseWalletSvg';

type RenderLogoProps = {
  size: number;
  logo: { uri: string } | React.ReactNode | undefined;
  logoSize: number;
  logoBackgroundColor: string;
  logoMargin: number;
  logoBorderRadius: number;
};

const defaultSvgString = ReactDOMServer.renderToString(coinbaseWalletSvg);
const defaultSvgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  defaultSvgString,
)}`;

export function useLogo({
  size,
  logo = defaultSvgDataUri,
  logoSize,
  logoBackgroundColor,
  logoMargin,
  logoBorderRadius,
}: RenderLogoProps) {
  const svgLogo = useMemo(() => {
    const transformedLogo = React.isValidElement(logo)
      ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
          ReactDOMServer.renderToString(logo),
        )}`
      : logo;

    const logoPosition = (size - logoSize - logoMargin * 2) / 2;
    const logoBackgroundSize = logoSize + logoMargin * 2;

    return (
      <g transform={`translate(${logoPosition}, ${logoPosition})`}>
        <defs>
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
            rx={logoBorderRadius}
            ry={logoBorderRadius}
            fill={logoBackgroundColor}
          />
        </g>
        <g transform={`translate(${logoMargin}, ${logoMargin})`}>
          <image
            data-testid="qr-code-logo"
            width={logoSize}
            height={logoSize}
            preserveAspectRatio="xMidYMid slice"
            href={String(transformedLogo)}
            clipPath="url(#clip-logo)"
          />
        </g>
      </g>
    );
  }, [logo, logoBackgroundColor, logoBorderRadius, logoMargin, logoSize, size]);
  return svgLogo;
}
