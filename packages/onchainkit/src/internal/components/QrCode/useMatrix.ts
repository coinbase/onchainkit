import QRCode from 'qrcode';
import { useMemo } from 'react';

/**
 * useMatrix generates a QR code matrix from a given value.
 * @param errorCorrectionLevel QR code error correction level (L, M, Q, H)
 * @param value String value to encode in QR code. useMatrix adds an 'ethereum:' prefix to the value as we only support EVM addresseses
 * @returns 2D array representing the QR code matrix, where 1 = black pixel and 0 = white pixel
 */
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
      if (index % sqrt === 0) {
        rows.push([key]);
      } else {
        rows[rows.length - 1].push(key);
      }
      return rows;
    }, []);
  }, [errorCorrectionLevel, value]);
  return matrix;
}
