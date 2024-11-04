import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { baseSepolia } from 'viem/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { EthBalance } from './EthBalance.js';
import { jsx } from 'react/jsx-runtime';
const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http()
  }
});
const meta = {
  title: 'Identity/EthBalance',
  component: EthBalance,
  decorators: [Story => {
    return /*#__PURE__*/jsx(WagmiProvider, {
      config: wagmiConfig,
      children: /*#__PURE__*/jsx(QueryClientProvider, {
        client: new QueryClient(),
        children: /*#__PURE__*/jsx(Story, {})
      })
    });
  }],
  tags: ['autodocs'],
  args: {
    address: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1'
  }
};
const Basic = {};
export { Basic, meta as default };
//# sourceMappingURL=EthBalance.stories.js.map
