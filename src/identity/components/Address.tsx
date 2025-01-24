'use client';

import { copyToClipboard } from '@/internal/utils/copyToClipboard';
import { useState } from 'react';
import { border, cn, color, pressable, text } from '../../styles/theme';
import type { AddressReact } from '../types';
import { getSlicedAddress } from '../utils/getSlicedAddress';
import { useIdentityContext } from './IdentityProvider';

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
    await copyToClipboard({
      copyValue: accountAddress,
      onSuccess: () => {
        setCopyText('Copied');
        setTimeout(() => setCopyText('Copy'), 2000);
      },
      onError: (err: unknown) => {
        console.error('Failed to copy address:', err);
        setCopyText('Failed to copy');
        setTimeout(() => setCopyText('Copy'), 2000);
      },
    });
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
