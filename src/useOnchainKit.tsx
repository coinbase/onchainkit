import { useContext } from 'react';
import { OnchainKitContext } from './core-react/OnchainKitProvider';

export function useOnchainKit() {
  return useContext(OnchainKitContext);
}
