import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getSlicedAddress } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useConnectors, useDisconnect } from 'wagmi';

export enum WalletPreference {
  SMART_WALLET = 'smartWalletOnly',
  EOA = 'eoaOnly',
}

export function WalletType() {
  // const { walletType, setWalletType, clearWalletType } = useContext(AppContext);
  const { disconnectAsync } = useDisconnect();
  const connectors = useConnectors();
  const account = useAccount();
  const { connect } = useConnect();

  const [walletType, setWalletType] = useState<WalletPreference>();

  // Connect to wallet if walletType changes
  useEffect(() => {
    if (walletType === WalletPreference.SMART_WALLET) {
      connect({ connector: connectors[0] });
    } else if (walletType === WalletPreference.EOA) {
      connect({ connector: connectors[1] });
    }
  }, [connect, connectors, walletType]);

  async function clearWalletType() {
    localStorage.removeItem('walletType');
    setWalletType?.(undefined);
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
        onValueChange={(value) => setWalletType?.(value as WalletPreference)}
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
