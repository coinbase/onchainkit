'use client';

import { Avatar } from '@/identity';
import { portfolioSvg } from '@/internal/svg/portfolioSvg';
import { getDefaultDraggableStartingPosition } from '../utils/getDefaultDraggableStartingPosition';
import { ConnectWallet } from './ConnectWallet';
import { Wallet } from './Wallet';
import { WalletAdvancedAddressDetails } from './WalletAdvancedAddressDetails';
import { WalletAdvancedTokenHoldings } from './WalletAdvancedTokenHoldings';
import { WalletAdvancedTransactionActions } from './WalletAdvancedTransactionActions';
import { WalletAdvancedWalletActions } from './WalletAdvancedWalletActions';
import { WalletDropdown } from './WalletDropdown';

export function WalletIsland({
  startingPosition = getDefaultDraggableStartingPosition(),
  isSponsored,
}: {
  startingPosition?: { x: number; y: number };
  isSponsored?: boolean;
}) {
  return (
    <Wallet
      draggable={true}
      draggableStartingPosition={startingPosition}
      isSponsored={isSponsored}
    >
      <ConnectWallet
        className="!rounded-full m-0 flex h-14 w-14 min-w-14 flex-col items-center justify-center p-0"
        disconnectedLabel={<div className="h-5 w-5">{portfolioSvg}</div>}
      >
        <Avatar className="pointer-events-none h-14 w-14" />
      </ConnectWallet>
      <WalletDropdown>
        <WalletAdvancedWalletActions />
        <WalletAdvancedAddressDetails />
        <WalletAdvancedTransactionActions />
        <WalletAdvancedTokenHoldings />
      </WalletDropdown>
    </Wallet>
  );
}
