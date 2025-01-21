'use client';
import { useIdentityContext } from '@/core-react/identity/providers/IdentityProvider';
import type { AddressReact } from '@/core-react/identity/types';
import { getSlicedAddress } from '@/core/identity/utils/getSlicedAddress';
import { useState } from 'react';
import { border, cn, color, pressable, text } from '../../../../styles/theme';

export function Address({
  address = null,
  className,
  isSliced = true,
  hasCopyAddressOnClick = true,
}: AddressReact) {
  const [copyText, setCopyText] = useState('Copy');
  const { address: contextAddress } = useIdentityContext();
  const accountAddress = address ?? contextAddress;

  if (!accountAddress) {
    console.error(
      'Address: an Ethereum address must be provided to the Identity or Address component.',
    );
    return null;
  }

  const addressContent = isSliced
    ? getSlicedAddress(accountAddress)
    : accountAddress;

  // Non-interactive version
  if (!hasCopyAddressOnClick) {
    return (
      <span
        data-testid="ockAddress"
        className={cn(color.foregroundMuted, text.label2, className)}
      >
        {addressContent}
      </span>
    );
  }

  // Interactive version with copy functionality
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(accountAddress);
      setCopyText('Copied');
      setTimeout(() => setCopyText('Copy'), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
      setCopyText('Failed to copy');
      setTimeout(() => setCopyText('Copy'), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <span
      data-testid="ockAddress"
      className={cn(
        color.foregroundMuted,
        text.label2,
        className,
        'group relative cursor-pointer',
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Copy address ${accountAddress}`}
    >
      {addressContent}
      <button
        type="button"
        className={cn(
          pressable.alternate,
          text.legal,
          color.foreground,
          border.default,
          border.radius,
          'absolute top-full left-[0%] z-10 mt-0.5 px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100',
        )}
        aria-live="polite"
      >
        {copyText}
      </button>
    </span>
  );
}
