import { AppchainBridge } from '@coinbase/onchainkit/appchain';
import type { BridgeableToken } from '@coinbase/onchainkit/appchain';
import { useContext } from 'react';
import { base } from 'wagmi/chains';
import { AppContext } from '../AppProvider';
import { defineChain } from 'viem';

export const LRDS_CHAIN = defineChain({
  id: 84530008,
  name: 'Blocklords',
  nativeCurrency: {
    name: 'Blocklords',
    symbol: 'LRDS',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://lordchain-rpc.appchain.base.org'],
    },
  },
});



export default function AppchainBridgeDemo() {
  const { appChainChainId } = useContext(AppContext);

  if (!appChainChainId) {
    return <div>AppchainChainId is not set</div>;
  }

  const _lrds_bridgeableTokens = [
    {
      address: '0xb676f87a6e701f0de8de5ab91b56b66109766db1',
      remoteToken: '0x4200000000000000000000000000000000000006',
      name: 'Blocklords',
      symbol: 'LRDS',
      decimals: 18,
      chainId: 845320005,
      image: 'https://s2.coinmarketcap.com/static/img/coins/200x200/29203.png',
      isCustomGasToken: true,
    },
  ] as BridgeableToken[];

  const _b3_bridgeableTokens = [
    {
      name: 'ETH',
      address: '',
      symbol: 'ETH',
      decimals: 18,
      image:
        'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
      chainId: 84532,
    },
    {
      name: 'RunChainsDMC',
      address: '0x4AC38D58d44f67c71BD1CE8eBad9a4D2b0FD3320',
      symbol: 'RCDMC',
      decimals: 18,
      image: 'https://img.cryptorank.io/coins/weth1701090834118.png',
      chainId: 84532,
      remoteToken: '0x8D4e2e4fd51f80A055ecb36833EC381D40B3C7e6',
    },
  ] as BridgeableToken[];

  const LRDS_APPCHAIN = {
    chain: LRDS_CHAIN,
    icon: (
      <img
        src="https://s2.coinmarketcap.com/static/img/coins/200x200/29203.png"
        alt="LRDS"
      />
    ),
  };

  return (
    <div className="mx-auto">
      <div className="relative flex h-full w-[500px] flex-col items-center">
        <AppchainBridge
          chain={base}
          appchain={LRDS_APPCHAIN}
          bridgeableTokens={_lrds_bridgeableTokens}
        />
      </div>
    </div>
  );
}
