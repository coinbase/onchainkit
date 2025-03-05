'use client';
import type { SwapDefaultReact } from '../types';
import { Swap } from './Swap';

/**
 * @deprecated Use the `Swap` component instead with no 'children' props.
 */
export function SwapDefault({
  config,
  className,
  disabled,
  experimental,
  from,
  isSponsored = false,
  onError,
  onStatus,
  onSuccess,
  title = 'Swap',
  to,
}: SwapDefaultReact) {
  return (
    <Swap
      className={className}
      onStatus={onStatus}
      onSuccess={onSuccess}
      onError={onError}
      config={config}
      isSponsored={isSponsored}
      title={title}
      experimental={experimental}
      to={to}
      from={from}
      disabled={disabled}
    />
  );
}
