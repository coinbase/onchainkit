import QRCode from 'qrcode';
import { useMemo } from 'react';

export function useMatrix(
  value: string,
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H',
) {
  const matrix = useMemo(() => {
    if (!value) {
      return [];
    }
    const arr = Array.prototype.slice.call(
      QRCode.create(value, { errorCorrectionLevel }).modules.data,
      0,
    );

    const sqrt = Math.sqrt(arr.length);
    
    return arr.reduce(
      (rows, key, index) =>
        (index % sqrt === 0
          ? rows.push([key])
          : rows[rows.length - 1].push(key)) && rows,
      [],
    );
  }, [errorCorrectionLevel, value]);
  return matrix;
}
