import { useMemo } from 'react';
// import { Circle, G, Rect } from 'react-native-svg';

import { CORNER_SIZE } from './useDotsPath';

export function useCorners(
  size: number,
  matrixLength: number,
  backgroundColor: string,
  fillColor: string,
) {
  const dotSize = size / matrixLength;
  const rectSize = dotSize * CORNER_SIZE;
  const circleRadius = dotSize * 2;
  const circleStrokeWidth = dotSize + 1;
  const corners = useMemo(
    () => (
      <g>
        <rect
          x={0}
          y={0}
          rx={9.5}
          ry={9.5}
          width={rectSize}
          height={rectSize}
          fill={fillColor}
          id="Corner"
        />
        <rect
          x={0}
          y={size - rectSize}
          rx={9.5}
          ry={9.5}
          width={rectSize}
          height={rectSize}
          fill={fillColor}
          id="Corner"
        />
        <rect
          x={size - rectSize}
          y={0}
          rx={9.5}
          ry={9.5}
          width={rectSize}
          height={rectSize}
          fill={fillColor}
          id="Corner"
        />
        <circle
          cx={rectSize / 2}
          cy={rectSize / 2}
          r={circleRadius}
          stroke={backgroundColor}
          strokeWidth={circleStrokeWidth}
          fill="none"
        />
        <circle
          cx={rectSize / 2}
          cy={size - rectSize / 2}
          r={circleRadius}
          stroke={backgroundColor}
          strokeWidth={circleStrokeWidth}
          fill="none"
        />
        <circle
          cx={size - rectSize / 2}
          cy={rectSize / 2}
          r={circleRadius}
          stroke={backgroundColor}
          strokeWidth={circleStrokeWidth}
          fill="none"
        />
      </g>
    ),
    [
      backgroundColor,
      circleRadius,
      circleStrokeWidth,
      fillColor,
      rectSize,
      size,
    ],
  );
  return corners;
}
