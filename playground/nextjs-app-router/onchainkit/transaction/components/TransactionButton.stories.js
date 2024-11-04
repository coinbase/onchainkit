import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { baseSepolia } from 'viem/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { TransactionButton } from './TransactionButton.js';
import { TransactionProvider } from './TransactionProvider.js';
import { jsx } from 'react/jsx-runtime';
const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http()
  }
});
const meta = {
  title: 'Transaction/Button',
  decorators: [Story => /*#__PURE__*/jsx(WagmiProvider, {
    config: wagmiConfig,
    children: /*#__PURE__*/jsx(QueryClientProvider, {
      client: new QueryClient(),
      children: /*#__PURE__*/jsx(TransactionProvider, {
        address: "0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1",
        children: /*#__PURE__*/jsx(Story, {})
      })
    })
  })],
  component: TransactionButton,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text'
    }
  }
};
const Basic = {};
export { Basic, meta as default };
//# sourceMappingURL=TransactionButton.stories.js.map
