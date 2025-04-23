import { useId, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';
import {
  GRADIENT_END_COORDINATES,
  GRADIENT_START_COORDINATES,
  QR_CODE_SIZE,
  QR_LOGO_BACKGROUND_COLOR,
  QR_LOGO_RADIUS,
  QR_LOGO_SIZE,
  linearGradientStops,
  ockThemeToLinearGradientColorMap,
  ockThemeToRadialGradientColorMap,
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
  value?: string | null;
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

export function QrCodeSvg({
  value,
  size = QR_CODE_SIZE,
  backgroundColor = '#ffffff',
  logo,
  logoSize = QR_LOGO_SIZE,
  logoBackgroundColor = QR_LOGO_BACKGROUND_COLOR,
  logoMargin = 5,
  logoBorderRadius = QR_LOGO_RADIUS,
  quietZone = 12,
  quietZoneBorderRadius = 10,
  ecl = 'Q',
  gradientType = 'radial',
}: QRCodeSVGProps) {
  const gradientRadius = size * 0.55;
  const gradientCenterPoint = size / 2;
  const uid = useId();

  const theme = useTheme();
  const themeName = theme.split('-')[0];

  const isRadialGradient = gradientType === 'radial';
  const fillColor = isRadialGradient ? `url(#radialGrad-${uid})` : '#000000';
  const bgColor = isRadialGradient
    ? backgroundColor
    : `url(#linearGrad-${uid})`;

  const linearGradientColor =
    ockThemeToLinearGradientColorMap[
      themeName as keyof typeof ockThemeToLinearGradientColorMap
    ] ?? ockThemeToLinearGradientColorMap.default;
  const linearColors = [
    linearGradientStops[linearGradientColor].startColor,
    linearGradientStops[linearGradientColor].endColor,
  ];

  const radialGradientColor =
    ockThemeToRadialGradientColorMap[
      themeName as keyof typeof ockThemeToLinearGradientColorMap
    ] ?? ockThemeToRadialGradientColorMap.default;
  const presetGradientForColor =
    presetGradients[radialGradientColor as keyof typeof presetGradients];

  const matrix = useMatrix(ecl, value);
  const corners = useCorners(size, matrix.length, bgColor, fillColor, uid);
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
            id={`radialGrad-${uid}`}
            data-testid="radialGrad"
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
            id={`linearGrad-${uid}`}
            data-testid="linearGrad"
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
