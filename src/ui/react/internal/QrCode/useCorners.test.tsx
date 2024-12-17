import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCorners } from './useCorners';
import { CORNER_SIZE } from './useDotsPath';

describe('useCorners', () => {
  const defaultProps = {
    size: 300,
    matrixLength: 30,
    backgroundColor: '#ffffff',
    fillColor: '#000000',
  };

  it('should return SVG group with correct corner elements', () => {
    const { result } = renderHook(() =>
      useCorners(
        defaultProps.size,
        defaultProps.matrixLength,
        defaultProps.backgroundColor,
        defaultProps.fillColor,
        'test-uid',
      ),
    );

    const svgGroup = result.current;

    expect(svgGroup.type).toBe('g');

    const children = svgGroup.props.children;
    expect(children).toHaveLength(6);

    const rects = children.filter(
      (child: JSX.Element) => child.type === 'rect',
    );
    expect(rects).toHaveLength(3);

    const circles = children.filter(
      (child: JSX.Element) => child.type === 'circle',
    );
    expect(circles).toHaveLength(3);
  });

  it('should calculate correct dimensions based on input size', () => {
    const { result } = renderHook(() =>
      useCorners(
        defaultProps.size,
        defaultProps.matrixLength,
        defaultProps.backgroundColor,
        defaultProps.fillColor,
        'test-uid',
      ),
    );

    const children = result.current.props.children;
    const firstRect = children[0];
    const firstCircle = children[3];

    const expectedRectSize =
      (defaultProps.size / defaultProps.matrixLength) * CORNER_SIZE;
    expect(firstRect.props.width).toBe(expectedRectSize);
    expect(firstRect.props.height).toBe(expectedRectSize);

    const expectedCircleRadius =
      (defaultProps.size / defaultProps.matrixLength) * 2;
    expect(firstCircle.props.r).toBe(expectedCircleRadius);
  });

  it('should apply correct colors', () => {
    const { result } = renderHook(() =>
      useCorners(
        defaultProps.size,
        defaultProps.matrixLength,
        defaultProps.backgroundColor,
        defaultProps.fillColor,
        'test-uid',
      ),
    );

    const children = result.current.props.children;
    const rect = children[0];
    const circle = children[3];

    expect(rect.props.fill).toBe(defaultProps.fillColor);
    expect(circle.props.stroke).toBe(defaultProps.backgroundColor);
  });

  it('should memoize result when props are unchanged', () => {
    const { result, rerender } = renderHook(() =>
      useCorners(
        defaultProps.size,
        defaultProps.matrixLength,
        defaultProps.backgroundColor,
        defaultProps.fillColor,
        'test-uid',
      ),
    );

    const firstRender = result.current;
    rerender();
    const secondRender = result.current;

    expect(firstRender).toBe(secondRender);
  });
});
