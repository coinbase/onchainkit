import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useLogo } from './useLogo';

describe('useLogo', () => {
  const defaultProps = {
    size: 300,
    logo: undefined,
    logoSize: 60,
    logoBackgroundColor: 'white',
    logoMargin: 5,
    logoBorderRadius: 0,
  };

  it('should render default logo when no logo provided', () => {
    const { result } = renderHook(() => useLogo(defaultProps));

    expect(result.current.props.transform).toContain('translate');
    expect(result.current.type).toBe('g');

    const imageElement = result.current.props.children[2].props.children;
    expect(imageElement.props.href).toContain('data:image/svg+xml');
    expect(imageElement.props.href).toContain(encodeURIComponent('<'));
  });

  it('should handle custom React SVG element', () => {
    const customLogo = (
      <svg>
        <title>Custom Logo</title>
        <circle cx="50" cy="50" r="40" />
      </svg>
    );
    const { result } = renderHook(() =>
      useLogo({ ...defaultProps, logo: customLogo }),
    );

    const imageElement = result.current.props.children[2].props.children;
    expect(imageElement.props.href).toContain('data:image/svg+xml');
    expect(imageElement.props.href).toContain(encodeURIComponent('circle'));
  });

  it('should apply correct positioning and sizing', () => {
    const { result } = renderHook(() => useLogo(defaultProps));

    const expectedPosition = (300 - 60 - 5 * 2) / 2;
    expect(result.current.props.transform).toBe(
      `translate(${expectedPosition}, ${expectedPosition})`,
    );

    const backgroundRect = result.current.props.children[1].props.children;
    expect(backgroundRect.props.width).toBe(70);
    expect(backgroundRect.props.height).toBe(70);
  });

  it('should apply border radius correctly', () => {
    const borderRadius = 10;
    const { result } = renderHook(() =>
      useLogo({ ...defaultProps, logoBorderRadius: borderRadius }),
    );

    const clipPathRect =
      result.current.props.children[0].props.children.props.children;
    expect(clipPathRect.props.rx).toBe(borderRadius);
    expect(clipPathRect.props.ry).toBe(borderRadius);

    const backgroundRect = result.current.props.children[1].props.children;
    expect(backgroundRect.props.rx).toBe(borderRadius);
    expect(backgroundRect.props.ry).toBe(borderRadius);
  });

  it('should apply correct background color', () => {
    const backgroundColor = '#ff0000';
    const { result } = renderHook(() =>
      useLogo({ ...defaultProps, logoBackgroundColor: backgroundColor }),
    );

    const backgroundRect = result.current.props.children[1].props.children;
    expect(backgroundRect.props.fill).toBe(backgroundColor);
  });

  it('should preserve aspect ratio in image', () => {
    const { result } = renderHook(() => useLogo(defaultProps));

    const imageElement = result.current.props.children[2].props.children;
    expect(imageElement.props.preserveAspectRatio).toBe('xMidYMid slice');
  });
});
