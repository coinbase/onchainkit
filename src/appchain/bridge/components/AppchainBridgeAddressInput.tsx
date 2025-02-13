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
    <div className="flex flex-col w-full">
      <div className="flex items-center">
        {backButton}
        <h2 className="text-lg ock-text-foreground font-medium text-center flex-1 mr-10">
          Send to
        </h2>
      </div>
      <div className="mt-4 px-4">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-ock-line-default">To</span>
          <TextInput
            className="w-full pl-12 p-3 ock-bg-default rounded-lg ock-text-foreground placeholder-ock-default border ock-border-line-default focus:outline-none focus:border-blue-500"
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
            className="mt-4 flex w-full gap-2 p-4 rounded-lg hover:ock-bg-muted transition-colors"
            onClick={() => {
              handleAddressSelect(address as Address);
              setIsAddressModalOpen(false);
            }}
            type="button"
          >
            <Avatar address={address} className="bg-white rounded-full" />
            <span className="text-ock-text-muted flex flex-col gap-1 items-start">
              <OCKAddress
                address={address}
                hasCopyAddressOnClick={false}
                className="font-bold !text-white"
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
