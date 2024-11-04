import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { baseSepolia } from 'viem/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect.js';
import { jsx } from 'react/jsx-runtime';
const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http()
  }
});
const WalletDropdownDisconnect_stories = {
  title: 'Wallet/WalletDropdownDisconnect',
  component: WalletDropdownDisconnect,
  decorators: [Story => /*#__PURE__*/jsx(WagmiProvider, {
    config: wagmiConfig,
    children: /*#__PURE__*/jsx(QueryClientProvider, {
      client: new QueryClient(),
      children: /*#__PURE__*/jsx(Story, {})
    })
  })]
};
const Default = () => /*#__PURE__*/jsx(WalletDropdownDisconnect, {});
const CustomText = () => /*#__PURE__*/jsx(WalletDropdownDisconnect, {
  text: "Log Out"
});
const CustomClass = () => /*#__PURE__*/jsx(WalletDropdownDisconnect, {
  className: "bg-red-500"
});
export { CustomClass, CustomText, Default, WalletDropdownDisconnect_stories as default };
//# sourceMappingURL=WalletDropdownDisconnect.stories.js.map
