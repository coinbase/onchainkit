import { useContext } from 'react';
import { OnchainKitContext } from './OnchainKitProvider';

export function useOnchainKit() {
  return useContext(OnchainKitContext);
}
