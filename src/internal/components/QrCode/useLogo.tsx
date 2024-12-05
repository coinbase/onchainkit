import React, { useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';
import { cbwSvg } from '../../svg/cbwSvg';

type RenderLogoProps = {
  size: number;
  logo: { uri: string } | React.ReactNode | undefined;
  logoSize: number;
  logoBackgroundColor: string;
  logoMargin: number;
  logoBorderRadius: number;
};

const defaultSvgString = ReactDOMServer.renderToString(cbwSvg);
const defaultSvgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  defaultSvgString,
)}`;

export function useLogo({
  size,
  logo,
  logoSize,
  logoBackgroundColor,
  logoMargin,
  logoBorderRadius,
}: RenderLogoProps) {
  const svgLogo = useMemo(() => {
    let logoUri = defaultSvgDataUri;
    if (React.isValidElement(logo)) {
      logoUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        ReactDOMServer.renderToString(logo),
      )}`;
    }
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
            width={logoSize}
            height={logoSize}
            preserveAspectRatio="xMidYMid slice"
            href={logoUri}
            clipPath="url(#clip-logo)"
          />
        </g>
      </g>
    );
  }, [logo, logoBackgroundColor, logoBorderRadius, logoMargin, logoSize, size]);
  return svgLogo;
}
