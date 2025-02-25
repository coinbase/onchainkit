import { FundCard } from '@coinbase/onchainkit/fund';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import type { PresetAmountInputs } from '../../onchainkit/esm/fund/types';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export default function FundCardDemo() {
  return (
    <div className="mx-auto min-w-[394px] max-w-[800px] gap-8">
      <Wallet>
        <FundCardDemoContent />
      </Wallet>
    </div>
  );
}

export const FundCardDemoContent = () => {
  const presetAmountInputs: PresetAmountInputs = ['10', '20', '100'];

  const { publicKey } = useWallet();

  console.log('publicKey', publicKey);

  return (
    <FundCard
      assetSymbol="SOL"
      walletAddress={publicKey?.toBase58()}
      walletNetwork="solana"
      country="US"
      currency="USD"
      presetAmountInputs={presetAmountInputs}
      onError={(error) => {
        console.log('FundCard onError', error);
      }}
      onStatus={(status) => {
        console.log('FundCard onStatus', status);
      }}
      onSuccess={() => {
        console.log('FundCard onSuccess');
      }}
    />
  );
};

const Wallet = ({ children }: { children: React.ReactNode }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const wallets = useMemo(
    () => [new UnsafeBurnerWalletAdapter()],

    [network],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <div className="flex flex-col">Solana wallet connector</div>
          <div className="pb-4">
            <WalletMultiButton />
            {/* <WalletDisconnectButton /> */}
          </div>

          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
