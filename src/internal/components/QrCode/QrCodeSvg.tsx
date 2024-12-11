import { useMemo } from 'react';
import { useOnchainKit } from '../../../core-react/useOnchainKit';
import {
  GRADIENT_END_COORDINATES,
  GRADIENT_START_COORDINATES,
  linearGradientStops,
  ockThemeToLinearGradientColorMap,
  ockThemeToRadiamGradientColorMap,
  presetGradients,
} from './gradientConstants';
import { useCorners } from './useCorners';
import { useDotsPath } from './useDotsPath';
import { useLogo } from './useLogo';
import { useMatrix } from './useMatrix';

function coordinateAsPercentage(coordinate: number) {
  return `${coordinate * 100}%`;
}

export type QRCodeSVGProps = {
  value: string;
  size?: number;
  backgroundColor?: string;
  logo?: React.ReactNode;
  logoSize?: number;
  logoBackgroundColor?: string;
  logoMargin?: number;
  logoBorderRadius?: number;
  quietZone?: number;
  quietZoneBorderRadius?: number;
  ecl?: 'L' | 'M' | 'Q' | 'H';
  gradientType?: 'radial' | 'linear';
};

export function QRCodeSVG({
  value,
  size = 100,
  backgroundColor = '#ffffff',
  logo,
  logoSize = size * 0.2,
  logoBackgroundColor = 'transparent',
  logoMargin = 5,
  logoBorderRadius = 0,
  quietZone = 12,
  quietZoneBorderRadius = 10,
  ecl = 'Q',
  gradientType = 'radial',
}: QRCodeSVGProps) {
  const gradientRadius = size * 0.55;
  const gradientCenterPoint = size / 2;

  const { config } = useOnchainKit();
  const ockTheme = (config?.appearance?.theme ?? 'default') as
    | 'default'
    | 'base'
    | 'cyberpunk'
    | 'hacker';

  const isRadialGradient = gradientType === 'radial';
  const fillColor = isRadialGradient ? 'url(#radialGrad)' : '#000000';
  const bgColor = isRadialGradient
    ? backgroundColor
    : `url(#${gradientType}Grad)`;

  const linearGradientColor = ockThemeToLinearGradientColorMap[
    ockTheme
  ] as keyof typeof linearGradientStops;
  const linearColors = [
    linearGradientStops[linearGradientColor].startColor,
    linearGradientStops[linearGradientColor].endColor,
  ];

  const presetGradientForColor =
    presetGradients[
      ockThemeToRadiamGradientColorMap[ockTheme] as keyof typeof presetGradients
    ];

  const matrix = useMatrix(value, ecl);
  const corners = useCorners(size, matrix.length, bgColor, fillColor);
  const { x: x1, y: y1 } = GRADIENT_START_COORDINATES;
  const { x: x2, y: y2 } = GRADIENT_END_COORDINATES;

  const viewBox = useMemo(() => {
    return [
      -quietZone,
      -quietZone,
      size + quietZone * 2,
      size + quietZone * 2,
    ].join(' ');
  }, [quietZone, size]);

  const svgLogo = useLogo({
    size,
    logo,
    logoSize,
    logoBackgroundColor,
    logoMargin,
    logoBorderRadius,
  });

  const path = useDotsPath({
    matrix,
    size,
    logoSize,
    logoMargin,
    logoBorderRadius,
    hasLogo: !!logo,
  });

  if (!path || !value) {
    return null;
  }

  return (
    <svg viewBox={viewBox} width={size} height={size}>
      <title>QR Code</title>
      <defs>
        {isRadialGradient ? (
          <radialGradient
            id="radialGrad"
            rx={gradientRadius}
            ry={gradientRadius}
            cx={gradientCenterPoint}
            cy={gradientCenterPoint}
            gradientUnits="userSpaceOnUse"
          >
            {presetGradientForColor.map(([gradientColor, offset]) => (
              <stop
                key={`${gradientColor}${offset}`}
                offset={offset}
                stopColor={gradientColor}
                stopOpacity={1}
              />
            ))}
          </radialGradient>
        ) : (
          <linearGradient
            id="linearGrad"
            x1={coordinateAsPercentage(x1)}
            y1={coordinateAsPercentage(y1)}
            x2={coordinateAsPercentage(x2)}
            y2={coordinateAsPercentage(y2)}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor={linearColors[0]} />
            <stop offset="1" stopColor={linearColors[1]} />
          </linearGradient>
        )}
      </defs>
      <g>
        <rect
          rx={quietZoneBorderRadius}
          ry={quietZoneBorderRadius}
          x={-quietZone}
          y={-quietZone}
          width={size + quietZone * 2}
          height={size + quietZone * 2}
          fill={backgroundColor}
          stroke={bgColor}
          strokeWidth={2}
        />
      </g>
      <g>
        <path
          d={path}
          fill={fillColor}
          strokeLinecap="butt"
          stroke={fillColor}
          strokeWidth={0}
          opacity={0.6}
        />
        {corners}
        {svgLogo}
      </g>
    </svg>
  );
}
