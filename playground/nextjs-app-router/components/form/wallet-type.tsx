import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getSlicedAddress } from '@/lib/utils';
import { useContext } from 'react';
import { useAccount, useConnectors, useDisconnect } from 'wagmi';
import { AppContext } from '../AppProvider';

export enum WalletPreference {
  SMART_WALLET = 'smartWalletOnly',
  EOA = 'EOA',
}

export function WalletType() {
  const { walletType, setWalletType, clearWalletType } = useContext(AppContext);
  const { disconnectAsync } = useDisconnect();
  const connectors = useConnectors();
  const account = useAccount();

  async function disconnectAll() {
    await disconnectAsync({ connector: connectors[0] });
    await disconnectAsync({ connector: connectors[1] });
    clearWalletType?.();
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="wallet-type" className="font-medium text-sm">
          Wallet Type
        </Label>
        <button
          type="button"
          className="text-blue-600 text-xs hover:underline"
          onClick={disconnectAll}
        >
          Disconnect all
        </button>
      </div>
      <RadioGroup
        id="wallet-type"
        value={walletType}
        className="flex items-center space-x-2"
        onValueChange={(value) => setWalletType?.(value as WalletPreference)}
      >
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
      </RadioGroup>
      <div className="text-neutral-500 text-xs">
        {account?.address
          ? `Connected: ${getSlicedAddress(account.address)}`
          : 'Click a type to connect'}
      </div>
    </div>
  );
}
