'use client';
import {
  PropsWithChildren,
  useLayoutEffect,
  useMemo,
  Children,
  isValidElement,
  cloneElement,
} from 'react';
import type { CSSProperties, ReactElement } from 'react';
import { useIsInMiniApp } from '../hooks/useIsInMiniApp';
import { useMiniKit } from '../hooks/useMiniKit';

export type SafeAreaInsetsProps = PropsWithChildren<{
  asChild?: boolean;
}>;

/**
 * Renders children with safe area padding when running inside a Mini App.
 *
 * - Reads inset values from `MiniKit` `context.client.safeAreaInsets` and exposes them as
 *   CSS custom properties on `:root`/`html`:
 *   `--ock-minikit-safeareainsets-top|right|bottom|left`.
 * - Uses those variables directly as pixel values via `var(..., 0px)`.
 * - When `asChild` is true, expects a single React element and merges the padding into the
 *   child's `style`. Otherwise, wraps `children` in a `div` that has the padding applied.
 * - If no `children` are provided, the component renders nothing but still ensures the
 *   CSS variables are set on `:root`.
 * - When not inside a Mini App, returns `children` unchanged and does not set variables.
 *
 * @param props
 * @param props.children React children to render.
 * @param props.asChild When true, merges safe-area padding into the single child's `style` instead of wrapping.
 */
export function SafeAreaInsets({ children, asChild }: SafeAreaInsetsProps) {
  const { context } = useMiniKit();
  const { isInMiniApp } = useIsInMiniApp();

  const safeAreaInsets = useMemo(() => {
    const { top, bottom, left, right } = context?.client?.safeAreaInsets || {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };

    return { top, bottom, left, right };
  }, [context]);

  useLayoutEffect(() => {
    if (!isInMiniApp) {
      return;
    }

    Object.entries(safeAreaInsets).forEach(([key, value]) => {
      document.documentElement.style.setProperty(
        `--ock-minikit-safeareainsets-${key}`,
        `${value}px`,
      );
    });
  }, [safeAreaInsets, isInMiniApp]);

  const paddingStyles: CSSProperties = useMemo(() => {
    return {
      paddingTop: 'var(--ock-minikit-safeareainsets-top, 0px)',
      paddingRight: 'var(--ock-minikit-safeareainsets-right, 0px)',
      paddingBottom: 'var(--ock-minikit-safeareainsets-bottom, 0px)',
      paddingLeft: 'var(--ock-minikit-safeareainsets-left, 0px)',
    };
  }, []);

  if (!isInMiniApp) {
    return children;
  }

  if (!children) {
    return null;
  }

  if (asChild) {
    if (!isValidElement(children)) {
      console.warn(
        'SafeAreaInsets: children is not a valid element. Returning children as is.',
      );
      return children;
    }

    const onlyChild = Children.only(children) as ReactElement<{
      style?: CSSProperties;
    }>;

    const mergedStyle: CSSProperties = {
      ...onlyChild.props.style,
      ...paddingStyles,
    };

    return cloneElement(onlyChild, { style: mergedStyle });
  }

  return <div style={paddingStyles}>{children}</div>;
}
