import { AppchainBridge } from '@coinbase/onchainkit/appchain';
import type { BridgeableToken } from '@coinbase/onchainkit/appchain';
import { useContext } from 'react';
import { baseSepolia } from 'wagmi/chains';
import { AppContext } from '../AppProvider';
import { LRDS_CHAIN } from '../custom-chains/LRDS';
export default function AppchainBridgeDemo() {
  const { appChainChainId } = useContext(AppContext);

  if (!appChainChainId) {
    return <div>AppchainChainId is not set</div>;
  }

  const bridgeableTokens = [
    {
      address: '0x9A7bE36dF8221F5a3971693f5d71d2c471785478',
      remoteToken: '0x4200000000000000000000000000000000000006',
      name: 'Blocklords',
      symbol: 'LRDS',
      decimals: 18,
      chainId: 288669036,
      image: 'https://onchainkit.xyz/favicon/48x48.png?v4-19-24',
      isCustomGasToken: true,
    },
  ] as BridgeableToken[];

  return (
    <div className="mx-auto">
      <div className="relative flex h-full w-full flex-col items-center">
        <AppchainBridge
          chain={baseSepolia}
          appchain={{
            chain: LRDS_CHAIN,
            icon: (
              <img
                src="https://onchainkit.xyz/favicon/48x48.png?v4-19-24"
                alt="LRDS"
              />
            ),
          }}
          bridgeableTokens={bridgeableTokens}
        />
      </div>
    </div>
  );
}
