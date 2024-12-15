import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDotsPath } from './useDotsPath';

describe('useDotsPath', () => {
  const defaultProps = {
    matrix: [
      [1, 0, 1],
      [0, 1, 0],
      [1, 0, 1],
    ],
    size: 300,
    logoSize: 60,
    logoMargin: 5,
    logoBorderRadius: 0,
    hasLogo: false,
  };

  it('should generate path for simple matrix without logo', () => {
    const { result } = renderHook(() => useDotsPath(defaultProps));

    expect(result.current).toContain('M');
    expect(result.current).toContain('A');
  });

  it('should skip logo area when hasLogo is true', () => {
    const withLogo = {
      ...defaultProps,
      hasLogo: true,
      matrix: [
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
      ],
    };

    const { result: withLogoResult } = renderHook(() => useDotsPath(withLogo));
    const { result: withoutLogoResult } = renderHook(() =>
      useDotsPath({ ...withLogo, hasLogo: false }),
    );

    expect(withLogoResult.current.length).toBeLessThan(
      withoutLogoResult.current.length,
    );
  });

  it('should handle round logos', () => {
    const withRoundLogo = {
      ...defaultProps,
      size: 300,
      hasLogo: true,
      logoBorderRadius: 40,
      logoSize: 60,
      logoMargin: 5,
      matrix: Array(25).fill(Array(25).fill(1)),
    };

    const { result: roundLogoResult } = renderHook(() =>
      useDotsPath(withRoundLogo),
    );
    const { result: squareLogoResult } = renderHook(() =>
      useDotsPath({ ...withRoundLogo, logoBorderRadius: 0 }),
    );

    expect(roundLogoResult.current).not.toBe(squareLogoResult.current);
  });

  it('should skip masked cells in corners', () => {
    const largeMatrix = Array(21).fill(Array(21).fill(1));
    const { result } = renderHook(() =>
      useDotsPath({
        ...defaultProps,
        matrix: largeMatrix,
      }),
    );

    const points = result.current.split('M').filter(Boolean);

    expect(points.length).toBeLessThan(21 * 21);
  });

  it('should handle empty matrix', () => {
    const { result } = renderHook(() =>
      useDotsPath({
        ...defaultProps,
        matrix: [],
      }),
    );

    expect(result.current).toBe('');
  });
});
