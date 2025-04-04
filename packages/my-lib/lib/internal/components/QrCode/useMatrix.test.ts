import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useMatrix } from './useMatrix';

describe('useMatrix', () => {
  it('returns empty array when value is empty', () => {
    const { result } = renderHook(() => useMatrix('L', ''));
    expect(result.current).toEqual([]);
  });

  it('generates correct QR matrix for simple value', () => {
    const { result } = renderHook(() => useMatrix('L', 'test'));

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current.length).toBeGreaterThan(0);
    expect(result.current[0].length).toBe(result.current.length);

    expect(
      result.current.every((row) =>
        row.every((cell) => cell === 0 || cell === 1),
      ),
    ).toBe(true);
  });

  it('generates different matrices for different error correction levels', () => {
    const { result: resultL } = renderHook(() => useMatrix('L', 'test'));
    const { result: resultH } = renderHook(() => useMatrix('H', 'test'));

    expect(resultL.current).not.toEqual(resultH.current);
  });

  it('memoizes result for same inputs', () => {
    const { result, rerender } = renderHook(
      ({ value, level }) => useMatrix(level, value),
      {
        initialProps: { value: 'test', level: 'L' as const },
      },
    );

    const firstResult = result.current;
    rerender({ value: 'test', level: 'L' });

    expect(result.current).toBe(firstResult); // Same reference
  });
});
