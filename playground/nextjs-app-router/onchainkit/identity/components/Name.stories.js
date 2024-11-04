import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { baseSepolia, optimism } from 'viem/chains';
import { Name } from './Name.js';
import { jsx } from 'react/jsx-runtime';
const meta = {
  title: 'Identity/Name',
  component: Name,
  decorators: [Story => {
    return /*#__PURE__*/jsx(QueryClientProvider, {
      client: new QueryClient(),
      children: /*#__PURE__*/jsx(Story, {})
    });
  }],
  tags: ['autodocs'],
  args: {
    address: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1'
  }
};
const Basic = {};
const BaseSepolia = {
  args: {
    address: '0xe5546B2Bd78408DB7908F86251e7f694CF6397b9',
    chain: baseSepolia
  }
};

// This should default to ENS domain
const BaseSepoliaWithoutDomain = {
  args: {
    address: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1',
    chain: baseSepolia
  }
};
const UnsupportedChain = {
  args: {
    address: '0x8c8F1a1e1bFdb15E7ed562efc84e5A588E68aD73',
    chain: optimism
  }
};
export { BaseSepolia, BaseSepoliaWithoutDomain, Basic, UnsupportedChain, meta as default };
//# sourceMappingURL=Name.stories.js.map
