import QRCode from 'qrcode';
import { useMemo } from 'react';

export function useMatrix(
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H',
  value?: string | null,
) {
  const matrix = useMemo(() => {
    if (!value) {
      return [];
    }

    const transformedValue = `ethereum:${value}`;

    const arr = Array.from(
      QRCode.create(transformedValue, { errorCorrectionLevel }).modules.data,
    );

    const sqrt = Math.sqrt(arr.length);

    return arr.reduce<number[][]>((rows, key, index) => {
      index % sqrt === 0 ? rows.push([key]) : rows[rows.length - 1].push(key);
      return rows;
    }, []);
  }, [errorCorrectionLevel, value]);
  return matrix;
}
