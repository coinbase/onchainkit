import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getStorageKey } from '@/lib/hooks';
import { getSlicedAddress } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useConnectors, useDisconnect } from 'wagmi';
import type { GetConnectorsReturnType } from 'wagmi/actions';

export const WalletPreference = {
  SMART_WALLET: 'smartWalletOnly',
  EOA: 'eoaOnly',
} as const;
export type WalletPreferenceType =
  (typeof WalletPreference)[keyof typeof WalletPreference];

const getConnector = (
  walletType: WalletPreferenceType,
  connectors: GetConnectorsReturnType,
) => {
  if (walletType === WalletPreference.SMART_WALLET) {
    return connectors[0];
  }
  return connectors[1];
};

export function WalletType() {
  const { disconnectAsync } = useDisconnect();
  const connectors = useConnectors();
  const account = useAccount();
  const { connect } = useConnect();

  const [walletType, setWalletType] = useState<WalletPreferenceType>();

  useEffect(() => {
    const storedWalletType = localStorage.getItem(getStorageKey('walletType'));
    if (storedWalletType) {
      setWalletType(storedWalletType as WalletPreferenceType);
    }
  }, []);

  async function handleConnect(value: WalletPreferenceType) {
    setWalletType(value);
    connect(
      {
        connector: getConnector(value, connectors),
      },
      {
        // Set localStorage ONLY when user has connected
        // otherwise, could result in walletType being set to smart wallet when user intended to connect eoa wallet
        onSuccess: () => {
          localStorage.setItem(getStorageKey('walletType'), value);
        },
      },
    );
  }

  async function clearWalletType() {
    localStorage.removeItem(getStorageKey('walletType'));
    setWalletType(undefined);
  }

  async function disconnectAll() {
    await disconnectAsync({ connector: connectors[0] });
    await disconnectAsync({ connector: connectors[1] });
    clearWalletType?.();
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="wallet-type">Wallet Type</Label>
      <RadioGroup
        id="wallet-type"
        value={walletType}
        className="flex items-center justify-between"
        onValueChange={handleConnect}
      >
        <div className="flex items-center gap-2">
          <Label
            htmlFor="wallet-type-smart"
            className="flex cursor-pointer items-center gap-2 rounded-md border p-2 [&:has(:checked)]:bg-muted"
          >
            <RadioGroupItem
              id="wallet-type-smart"
              value={WalletPreference.SMART_WALLET}
            />
            Smart Wallet
          </Label>
          <Label
            htmlFor="wallet-type-eoa"
            className="flex cursor-pointer items-center gap-2 rounded-md border p-2 [&:has(:checked)]:bg-muted"
          >
            <RadioGroupItem id="wallet-type-eoa" value={WalletPreference.EOA} />
            EOA
          </Label>
        </div>
        <button
          type="button"
          className="text-xs hover:underline"
          onClick={disconnectAll}
        >
          Disconnect all
        </button>
      </RadioGroup>
      <div className="text-neutral-500 text-xs">
        {account?.address
          ? `Connected: ${getSlicedAddress(account.address)}`
          : 'Click a type to connect'}
      </div>
    </div>
  );
}
