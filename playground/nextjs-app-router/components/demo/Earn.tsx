import { AppContext } from '@/components/AppProvider';
import { Earn } from '@coinbase/onchainkit/earn';
import { useContext } from 'react';

export function EarnDemo() {
  const { vaultAddress } = useContext(AppContext);

  if (!vaultAddress) {
    return <div>Please set a vault address</div>;
  }

  return <Earn vaultAddress={vaultAddress} />;
}
