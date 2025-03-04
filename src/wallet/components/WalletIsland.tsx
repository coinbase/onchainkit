'use client';

import { Avatar } from '@/identity';
import { portfolioSvg } from '@/internal/svg/portfolioSvg';
import { useAccount } from 'wagmi';
import { getDefaultDraggableStartingPosition } from '../utils/getDefaultDraggableStartingPosition';
import { ConnectWallet } from './ConnectWallet';
import { ConnectWalletText } from './ConnectWalletText';
import { Wallet } from './Wallet';
import { WalletAdvanced } from './WalletAdvanced';
import { WalletAdvancedAddressDetails } from './WalletAdvancedAddressDetails';
import { WalletAdvancedTokenHoldings } from './WalletAdvancedTokenHoldings';
import { WalletAdvancedTransactionActions } from './WalletAdvancedTransactionActions';
import { WalletAdvancedWalletActions } from './WalletAdvancedWalletActions';

export function WalletIsland({
  startingPosition = getDefaultDraggableStartingPosition(),
}: {
  startingPosition?: { x: number; y: number };
}) {
  const { status } = useAccount();

  return (
    <Wallet draggable={true} draggableStartingPosition={startingPosition}>
      <ConnectWallet className="!rounded-full m-0 flex h-14 w-14 min-w-14 flex-col items-center justify-center p-0">
        <ConnectWalletText>
          <div className="h-5 w-5">{portfolioSvg}</div>
        </ConnectWalletText>
        {status === 'connected' ? (
          <Avatar className="pointer-events-none h-14 w-14" />
        ) : (
          <div className="h-5 w-5">{portfolioSvg}</div>
        )}
      </ConnectWallet>
      <WalletAdvanced>
        <WalletAdvancedWalletActions />
        <WalletAdvancedAddressDetails />
        <WalletAdvancedTransactionActions />
        <WalletAdvancedTokenHoldings />
      </WalletAdvanced>
    </Wallet>
  );
}
