import { useState } from 'react';
import { border, cn, color, pressable, text } from '../../styles/theme';
import type { AddressReact } from '../types';
import { getSlicedAddress } from '../utils/getSlicedAddress';
import { useIdentityContext } from './IdentityProvider';

export function Address({
  address = null,
  className,
  isSliced = true,
}: AddressReact) {
  const [copyText, setCopyText] = useState('Copy');
  const { address: contextAddress } = useIdentityContext();
  if (!contextAddress && !address) {
    console.error(
      'Address: an Ethereum address must be provided to the Identity or Address component.',
    );
    return null;
  }

  const accountAddress = address ?? contextAddress;

  const handleClick = () => {
    navigator.clipboard
      .writeText(accountAddress)
      .then(() => {
        setCopyText('Copied');
        setTimeout(() => setCopyText('Copy'), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy address: ', err);
      });
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
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      tabIndex={0}
      role="button"
    >
      {isSliced ? getSlicedAddress(accountAddress) : accountAddress}
      <span
        className={cn(
          pressable.alternate,
          text.legal,
          color.foreground,
          border.default,
          border.radius,
          'absolute top-full left-[0%] z-10 mt-0.5 px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100',
        )}
      >
        {copyText}
      </span>
    </span>
  );
}
