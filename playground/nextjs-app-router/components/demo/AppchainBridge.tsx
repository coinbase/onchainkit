import { AppchainBridge } from '@coinbase/onchainkit/appchain';
import { useContext } from 'react';
import { defineChain } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import { AppContext } from '../AppProvider';
export default function AppchainBridgeDemo() {
  const { appChainChainId } = useContext(AppContext);

  if (!appChainChainId) {
    return <div>AppchainChainId is not set</div>;
  }

  const B3_CHAIN = defineChain({
    id: 4087967037,
    name: 'B3 Chain',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://b3-sepolia-rpc.l3.base.org'],
      },
    },

    contracts: {
      disputeGameFactory: {
        [84532]: {
          address: '0x0000000000000000000000000000000000000001',
        },
      },
      portal: {
        [84532]: {
          address: '0x48C6Ccb3cB5747FBEa7589556cF74772be12c5f1',
        },
      },
      l2OutputOracle: {
        [84532]: {
          address: '0xA6D24ac223F6d5Ce3784eC0a43F3f66B39618182',
        },
      },
    },
  } as const);

  return (
    <div className="mx-auto">
      <div className="relative flex h-full w-full flex-col items-center">
        <AppchainBridge chain={baseSepolia} appchain={{ chain: B3_CHAIN }} />
      </div>
    </div>
  );
}
