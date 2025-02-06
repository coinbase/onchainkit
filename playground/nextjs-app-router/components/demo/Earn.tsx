import { useContext } from 'react';
import { AppContext } from '../AppProvider';
import type { Address } from 'viem';
import { Earn } from '@coinbase/onchainkit/earn';

export function EarnDemo() {
  const { earnVaultAddress } = useContext(AppContext);
  return <Earn vaultAddress={earnVaultAddress as Address} />;
}
