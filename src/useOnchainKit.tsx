import { useContext } from 'react';
import { OnchainKitContext } from './OnchainKitProvider';

export function useOnchainKit() {
  const context = useContext(OnchainKitContext);
  if (context === null) {
    throw Error('useOnchainKit must be used within an OnchainKitProvider');
  }
  return context;
}
