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

    const arr = Array.from(
      QRCode.create(value, { errorCorrectionLevel }).modules.data,
    );

    const sqrt = Math.sqrt(arr.length);

    return arr.reduce<number[][]>(
      (rows, key, index) =>{
        index % sqrt === 0
          ? rows.push([key])
          : rows[rows.length - 1].push(key);
        return rows;
      },
      [],
    );
  }, [errorCorrectionLevel, value]);
  return matrix;
}
