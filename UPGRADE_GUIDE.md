# OnchainKit v1.0.0 Upgrade Guide

This guide will help you upgrade from OnchainKit v0.x to v1.0.0. The v1.0.0 release includes breaking changes that require code updates.

## 📋 Prerequisites

Before upgrading, ensure your project meets these requirements:

- **React**: v19 (upgraded from v18 || v19)
- **Node.js**: v20 or higher
- **TypeScript**: v5.8+ (recommended)

## 🚀 Quick Start

### 1. Update Dependencies

Update your package.json to use the new version and add required peer dependencies:

```bash
npm install @coinbase/onchainkit@1.0.0 viem@^2.27 wagmi@^2.16
```

Or with pnpm:
```bash
pnpm add @coinbase/onchainkit@1.0.0 viem@^2.27 wagmi@^2.16
```

### 2. Update Your Provider Setup

**Before (v0.x):**
```tsx
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

export function Providers({ children }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: { mode: "auto" },
        wallet: { preference: "all" }
      }}
    >
      {children}
    </MiniKitProvider>
  );
}
```

**After (v1.0):**
```tsx
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";

export function RootProvider({ children }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "dark", // or "light" or "auto"
        },
        wallet: {
          display: "modal", // or "dropdown"
          preference: "all",
        },
      }}
      miniKit={{
        enabled: true,
        autoConnect: true,
        notificationProxyUrl: undefined, // optional
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}
```

### 3. Update Package Dependencies

The Farcaster SDK has been updated:

**Before (v0.x):**
```json
{
  "dependencies": {
    "@farcaster/frame-sdk": "^0.1.8"
  }
}
```

**After (v1.0):**
```json
{
  "dependencies": {
    "@farcaster/miniapp-sdk": "^0.1.8"
  }
}
```

## 🔄 Breaking Changes

### Provider Consolidation

The `MiniKitProvider` has been consolidated into `OnchainKitProvider` with MiniKit configuration:

- ✅ **New**: Use `OnchainKitProvider` with `miniKit` config
- ❌ **Removed**: `MiniKitProvider` as a separate provider

### Peer Dependencies

v1.0.0 requires explicit peer dependencies for better version control:

- **Added**: `viem: "^2.27"`
- **Added**: `wagmi: "^2.16"`
- **Updated**: `react: "^19"` (no longer supports React 18)

### SDK Dependency Change

Farcaster integration has moved to the newer SDK:

- **Before**: `@farcaster/frame-sdk`
- **After**: `@farcaster/miniapp-sdk`

## 📦 New Features in v1.0.0

### Utils Export
v1.0.0 adds a new utils export for utility functions:

```tsx
import { formatAmount } from "@coinbase/onchainkit/utils";
```

### Enhanced Build Configuration
- Simplified build scripts
- Updated to Vite-based build system
- Better TypeScript integration

### Improved Dependencies
- Updated to latest Radix UI components
- Enhanced Tailwind CSS integration
- Better PostCSS configuration

## 🔧 Migration Steps

### Step 1: Update Dependencies
```bash
npm install @coinbase/onchainkit@1.0.0 react@19 react-dom@19 viem@^2.27 wagmi@^2.16
```

### Step 2: Update Provider
Replace `MiniKitProvider` with `OnchainKitProvider` and add MiniKit configuration.

### Step 3: Update Package References
Change `@farcaster/frame-sdk` to `@farcaster/miniapp-sdk` in your package.json.

### Step 4: Update Imports
If you're using the new utils, add the utils import:
```tsx
import { formatAmount } from "@coinbase/onchainkit/utils";
```

### Step 5: Test Your Application
Run your application and verify all components work as expected.

## 🎯 Component API Compatibility

Most component APIs remain the same between v0.x and v1.0.0:

- ✅ **Identity components**: No breaking changes
- ✅ **Wallet components**: No breaking changes  
- ✅ **Transaction components**: No breaking changes
- ✅ **Swap components**: No breaking changes
- ✅ **All other components**: Backward compatible

## 🆘 Troubleshooting

### Common Issues

**Issue**: Build fails with peer dependency warnings
**Solution**: Ensure you've installed the required peer dependencies:
```bash
npm install viem@^2.27 wagmi@^2.16
```

**Issue**: MiniKitProvider not found
**Solution**: Replace with OnchainKitProvider and add miniKit config

**Issue**: React 18 compatibility errors
**Solution**: Upgrade to React 19:
```bash
npm install react@19 react-dom@19
```

**Issue**: Frame SDK imports fail
**Solution**: Update to miniapp-sdk:
```bash
npm uninstall @farcaster/frame-sdk
npm install @farcaster/miniapp-sdk@^0.1.8
```

### Getting Help

- 📖 [OnchainKit Documentation](https://onchainkit.xyz/)
- 💬 [Discord Community](https://discord.gg/invite/cdp)
- 🐛 [GitHub Issues](https://github.com/coinbase/onchainkit/issues)

## ✅ Migration Checklist

- [ ] Updated to React 19
- [ ] Installed OnchainKit v1.0.0
- [ ] Added viem and wagmi peer dependencies
- [ ] Replaced MiniKitProvider with OnchainKitProvider
- [ ] Updated @farcaster/frame-sdk to @farcaster/miniapp-sdk
- [ ] Added @coinbase/onchainkit/styles.css import
- [ ] Configured miniKit options in OnchainKitProvider
- [ ] Tested all existing functionality
- [ ] Updated any custom styling or CSS

Congratulations! You've successfully upgraded to OnchainKit v1.0.0 🎉