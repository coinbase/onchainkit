import { WalletIsland } from '@coinbase/onchainkit/wallet';
import { AppContext } from '../AppProvider';
import { useContext } from 'react';

export default function WalletIslandDemo() {
  const { isSponsored } = useContext(AppContext);
  return <WalletIsland isSponsored={isSponsored} />;
}
