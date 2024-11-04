import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { base, baseSepolia } from 'viem/chains';
import { OnchainKitProvider } from '../../OnchainKitProvider.js';
import { Avatar } from './Avatar.js';
import { Badge } from './Badge.js';
import { jsx } from 'react/jsx-runtime';
const meta = {
  title: 'Identity/Avatar',
  component: Avatar,
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
const Loading = {
  args: {
    loadingComponent: /*#__PURE__*/jsx("div", {
      children: "..."
    })
  }
};
const Fallback = {
  args: {
    address: '0x1234567891234567881234567891234567891234',
    defaultComponent: /*#__PURE__*/jsx("div", {
      style: {
        width: '32px',
        height: '32px',
        border: '3px solid red',
        borderRadius: '50%'
      }
    })
  }
};
const WithBadge = {
  decorators: [Story => {
    return /*#__PURE__*/jsx(QueryClientProvider, {
      client: new QueryClient(),
      children: /*#__PURE__*/jsx(OnchainKitProvider, {
        chain: base,
        schemaId: "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9",
        children: /*#__PURE__*/jsx(Story, {})
      })
    });
  }],
  args: {
    children: /*#__PURE__*/jsx(Badge, {})
  }
};
const Base = {
  args: {
    address: '0x8c8F1a1e1bFdb15E7ed562efc84e5A588E68aD73',
    chain: base
  }
};
const BaseSepolia = {
  args: {
    address: '0xf75ca27C443768EE1876b027272DC8E3d00B8a23',
    chain: baseSepolia
  }
};
const BaseDefaultToMainnet = {
  args: {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    chain: base
  }
};
const BaseSepoliaDefaultToMainnet = {
  args: {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    chain: baseSepolia
  }
};
const BaseDefaultProfile = {
  args: {
    address: '0xdb39F11c909bFA976FdC27538152C1a0E4f0fCcA',
    chain: base
  }
};
const BaseSepoliaDefaultProfile = {
  args: {
    address: '0x8c8F1a1e1bFdb15E7ed562efc84e5A588E68aD73',
    chain: baseSepolia
  }
};
export { Base, BaseDefaultProfile, BaseDefaultToMainnet, BaseSepolia, BaseSepoliaDefaultProfile, BaseSepoliaDefaultToMainnet, Basic, Fallback, Loading, WithBadge, meta as default };
//# sourceMappingURL=Avatar.stories.js.map
