import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { baseSepolia } from 'viem/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { SwapProvider } from './SwapProvider.js';
import { SwapToggleButton } from './SwapToggleButton.js';
import { jsx } from 'react/jsx-runtime';
const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http()
  }
});
const meta = {
  title: 'Swap/ToggleButton',
  decorators: [Story => /*#__PURE__*/jsx(WagmiProvider, {
    config: wagmiConfig,
    children: /*#__PURE__*/jsx(QueryClientProvider, {
      client: new QueryClient(),
      children: /*#__PURE__*/jsx(SwapProvider, {
        address: "0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1",
        experimental: {
          useAggregator: true
        },
        children: /*#__PURE__*/jsx(Story, {})
      })
    })
  })],
  component: SwapToggleButton,
  tags: ['autodocs']
};
const Basic = {};
export { Basic, meta as default };
//# sourceMappingURL=SwapToggleButton.stories.js.map
