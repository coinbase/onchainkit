'use client';
import { Avatar, Address as OCKAddress } from '@/identity';
import { PressableIcon } from '@/internal/components/PressableIcon';
import { TextInput } from '@/internal/components/TextInput';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { useState } from 'react';
import type { Address } from 'viem';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';

export const AppchainBridgeAddressInput = () => {
  const { setIsAddressModalOpen, handleAddressSelect } =
    useAppchainBridgeContext();
  const [address, setAddress] = useState<Address | null>(null);
  const [isValidAddress, setIsValidAddress] = useState(false);

  const validateAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  const backButton = (
    <PressableIcon
      ariaLabel="Back button"
      onClick={() => {
        setIsAddressModalOpen(false);
      }}
    >
      <div className="p-2">{backArrowSvg}</div>
    </PressableIcon>
  );

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center">
        {backButton}
        <h2 className="ock-text-foreground mr-10 flex-1 text-center font-medium text-lg">
          Send to
        </h2>
      </div>
      <div className="mt-4 px-4">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-ock-line-default">To</span>
          <TextInput
            className="ock-bg-default ock-text-foreground ock-border-line-default w-full rounded-lg border p-3 pl-12 placeholder-ock-default focus:border-blue-500 focus:outline-none"
            placeholder=""
            onChange={(value) => {
              const addr = value as Address;
              setAddress(addr);
              setIsValidAddress(validateAddress(addr));
            }}
            value={address || ''}
          />
        </div>
        {address && !isValidAddress && (
          <p className="mt-2 text-red-500 text-sm">
            Please enter a valid Ethereum address
          </p>
        )}
        {address && isValidAddress && (
          <button
            className="hover:ock-bg-muted mt-4 flex w-full gap-2 rounded-lg p-4 transition-colors"
            onClick={() => {
              handleAddressSelect(address as Address);
              setIsAddressModalOpen(false);
            }}
            type="button"
          >
            <Avatar address={address} className="rounded-full bg-white" />
            <span className="flex flex-col items-start gap-1 text-ock-text-muted">
              <OCKAddress
                address={address}
                hasCopyAddressOnClick={false}
                className="!text-white font-bold"
              />
              <OCKAddress
                address={address}
                isSliced={false}
                hasCopyAddressOnClick={false}
              />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
