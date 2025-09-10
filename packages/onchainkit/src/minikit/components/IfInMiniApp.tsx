import { getOnchainKitConfig } from '@/core/OnchainKitConfig';
import { PropsWithChildren, ReactNode } from 'react';
import { useIsInMiniApp } from '../hooks/useIsInMiniApp';

export function IfInMiniApp({
  fallback,
  children,
}: PropsWithChildren<{ fallback: ReactNode }>) {
  const { isInMiniApp } = useIsInMiniApp();
  const miniKit = getOnchainKitConfig('miniKit');

  if (miniKit?.enabled && isInMiniApp) {
    return children;
  }

  return fallback || null;
}
