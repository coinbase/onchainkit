import { useMemo } from 'react';

type LogoConfig = {
  hasLogo: boolean;
  logoSize: number;
  logoMargin: number;
  logoBorderRadius: number;
  matrixLength: number;
  dotSize: number;
};

const squareMask = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

const dotMask = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

function getDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
}

function shouldSkipMaskedCell(
  i: number,
  j: number,
  matrixLength: number,
): boolean {
  return Boolean(
    squareMask[i]?.[j] ||
      squareMask[i - matrixLength + CORNER_SIZE]?.[j] ||
      squareMask[i]?.[j - matrixLength + CORNER_SIZE] ||
      dotMask[i]?.[j] ||
      dotMask[i - matrixLength + CORNER_SIZE]?.[j] ||
      dotMask[i]?.[j - matrixLength + CORNER_SIZE],
  );
}

function shouldSkipLogoArea(
  i: number,
  j: number,
  {
    hasLogo,
    logoSize,
    logoMargin,
    logoBorderRadius,
    matrixLength,
    dotSize,
  }: LogoConfig,
): boolean {
  if (!hasLogo) {
    return false;
  }

  const logoAndMarginTotalSize = logoSize + logoMargin * 2;
  const logoSizeInDots = logoAndMarginTotalSize / dotSize;
  const midpoint = Math.floor(matrixLength / 2);
  const isRoundLogo = logoBorderRadius >= logoSize / 2;

  if (isRoundLogo) {
    const logoRadiusInDots = logoSizeInDots / 2;
    const distFromMiddleInDots = getDistance(j, i, midpoint, midpoint);
    return distFromMiddleInDots - 0.5 <= logoRadiusInDots;
  }

  const numDotsOffCenterToHide = Math.ceil(logoSizeInDots / 2);
  return (
    i <= midpoint + numDotsOffCenterToHide &&
    i >= midpoint - numDotsOffCenterToHide &&
    j <= midpoint + numDotsOffCenterToHide &&
    j >= midpoint - numDotsOffCenterToHide
  );
}

function getDotPath(centerX: number, centerY: number, radius: number): string {
  return `
    M ${centerX - radius} ${centerY}
    A ${radius} ${radius} 0 1 1 ${centerX + radius} ${centerY}
    A ${radius} ${radius} 0 1 1 ${centerX - radius} ${centerY}`;
}

export const CORNER_SIZE = 7;

type UseDotsPathProps = {
  matrix: number[][];
  size: number;
  logoSize: number;
  logoMargin: number;
  logoBorderRadius: number;
  hasLogo: boolean;
};

export function useDotsPath({
  matrix,
  size,
  logoSize,
  logoMargin,
  logoBorderRadius,
  hasLogo,
}: UseDotsPathProps): string {
  const dotsPath = useMemo(() => {
    const cellSize = size / matrix.length;
    let path = '';
    const matrixLength = matrix.length;
    const dotSize = size / matrixLength;

    matrix.forEach((row, i) => {
      row.forEach((column, j) => {
        if (
          shouldSkipMaskedCell(i, j, matrixLength) ||
          shouldSkipLogoArea(i, j, {
            hasLogo,
            logoSize,
            logoMargin,
            logoBorderRadius,
            matrixLength,
            dotSize,
          })
        ) {
          return;
        }

        if (column) {
          const centerX = cellSize * j + cellSize / 2;
          const centerY = cellSize * i + cellSize / 2;
          path += getDotPath(centerX, centerY, cellSize / 2);
        }
      });
    });

    return path;
  }, [hasLogo, logoBorderRadius, logoMargin, logoSize, matrix, size]);

  return dotsPath;
}
