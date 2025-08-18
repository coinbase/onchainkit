# OnchainKit v1.0.0 API Changes

This document outlines all API changes, additions, and removals between OnchainKit v0.38.19 and v1.0.0.

## Breaking Changes

### Provider API

#### Removed
- **`MiniKitProvider`** - Standalone MiniKit provider

#### Changed  
- **`OnchainKitProvider`** - Now includes MiniKit configuration

**v0.x:**
```tsx
<MiniKitProvider apiKey="..." chain={base} config={{...}}>
```

**v1.0:**
```tsx
<OnchainKitProvider 
  apiKey="..." 
  chain={base} 
  config={{...}}
  miniKit={{ enabled: true, autoConnect: true }}
>
```

### Dependencies

#### Updated
- **React**: `^18 || ^19` → `^19` (React 18 support removed)
- **@farcaster/frame-sdk** → **@farcaster/miniapp-sdk** (breaking dependency change)

#### Added Peer Dependencies
- **viem**: `^2.27` (now required as peer dependency)
- **wagmi**: `^2.16` (now required as peer dependency)

### Build System

#### Changed Scripts
- **v0.x**: `"build": "pnpm clean && pnpm bundle:prod"`
- **v1.0**: `"build": "pnpm clean && vite build"`

#### Removed Scripts
- `bundle:dev`
- `bundle:prod`

#### Updated Scripts
- **dev**: `NODE_ENV=development vite build --watch` (updated Vite integration)

## New Features

### Package Exports

#### Added
- **`./utils`** - New utils export path
  ```tsx
  import { formatAmount } from "@coinbase/onchainkit/utils";
  ```

### Component Enhancements

All existing component APIs remain **backward compatible**. No breaking changes to:

- **Identity Module**: `Address`, `Avatar`, `Badge`, `EthBalance`, `Identity`, `Name`, `Socials`, `IdentityCard`
- **Wallet Module**: `Wallet`, `ConnectWallet`, `WalletDropdown`, etc.
- **Transaction Module**: `Transaction`, `TransactionButton`, `TransactionStatus`, etc.
- **Swap Module**: `Swap`, `SwapAmountInput`, `SwapButton`, etc.
- **All other modules**: `Buy`, `Checkout`, `Earn`, `Fund`, `NFT`, `Signature`

### Hook API Compatibility

All hooks maintain backward compatibility:

- **Identity Hooks**: `useAddress`, `useAvatar`, `useName`, etc.
- **Wallet Hooks**: `useWalletContext`, `usePortfolio`
- **Transaction Hooks**: `useTransactionContext`
- **Swap Hooks**: `useSwapContext`
- **MiniKit Hooks**: All hooks unchanged

### Type System

#### Enhanced Types
- Updated type names for better consistency
- **v0.x**: `IsBaseOptions`, `IsEthereumOptions`
- **v1.0**: `IsBaseParams`, `IsEthereumParams`

#### New Type Categories
- Better TypeScript integration across all modules
- Enhanced generic type support

## Infrastructure Changes

### Dependencies

#### Added
- **@floating-ui/react**: `^0.27.13`
- **@radix-ui/react-dialog**: `^1.1.14`
- **@radix-ui/react-popover**: `^1.1.14`
- **@radix-ui/react-tabs**: `^1.1.3`
- **@radix-ui/react-toast**: `^1.2.14`
- **usehooks-ts**: `^3.1.1`

#### Updated
- **tailwind-merge**: `^2.3.0` → `^3.2.0`
- **@tanstack/react-query**: Requires `^5`
- **React/React-DOM**: `^18` → `19.1.0` (development)

### Development Dependencies

#### Added
- **@tailwindcss/cli**: `^4.1.4`
- **@tailwindcss/postcss**: `^4.1.4`
- **postcss-import**: `^16.1.0`
- **postcss-load-config**: `^6.0.1`

#### Updated
- **tailwindcss**: `^3.4.3` → `^4.1.6`
- **@testing-library/react**: `^14.2.0` → `^16.3.0`
- **@types/react**: `^18` → `19.1.2`
- **@types/react-dom**: `^18` → `19.1.3`

#### Removed
- **packemon**: `3.3.1` (replaced with Vite)

## Configuration Changes

### Package.json Structure

#### Updated Exports
All existing exports remain the same, with the addition of:
```json
"./utils": {
  "types": "./dist/utils/index.d.ts",
  "module": "./dist/utils/index.js",
  "import": "./dist/utils/index.js",
  "default": "./dist/utils/index.js"
}
```

#### Build Configuration
- Transitioned from custom build scripts to Vite
- Simplified build pipeline
- Enhanced TypeScript integration

### Workspace Configuration

#### Updated
- **pnpm-workspace.yaml**: Added `templates/*` to workspace packages

#### Enhanced Filters
- Added `f:minikit-example` filter shortcut

## Migration Impact

### Low Impact Changes
- **Component APIs**: No breaking changes
- **Hook APIs**: No breaking changes  
- **Import paths**: All existing imports work
- **TypeScript**: Enhanced but backward compatible

### Medium Impact Changes
- **Provider setup**: Requires migration from MiniKitProvider
- **Dependencies**: Must add peer dependencies
- **Farcaster SDK**: Requires package update

### High Impact Changes
- **React version**: Must upgrade to React 19
- **Build system**: Projects using custom builds may need updates

## Compatibility Matrix

| Feature | v0.x | v1.0 | Compatible |
|---------|------|------|------------|
| Component APIs | ✅ | ✅ | ✅ |
| Hook APIs | ✅ | ✅ | ✅ |
| Import paths | ✅ | ✅ | ✅ |
| MiniKitProvider | ✅ | ❌ | ❌ |
| OnchainKitProvider | ✅ | ✅ | ⚠️ (enhanced) |
| React 18 | ✅ | ❌ | ❌ |
| React 19 | ✅ | ✅ | ✅ |
| Viem/Wagmi as deps | Optional | Required | ⚠️ |

## Summary

OnchainKit v1.0.0 is a **major version** with breaking changes primarily focused on:

1. **Provider consolidation** (MiniKitProvider → OnchainKitProvider)
2. **Dependency management** (explicit peer dependencies)
3. **React 19 requirement** (React 18 support removed)
4. **Build system modernization** (Vite-based)

The **component and hook APIs remain backward compatible**, making the upgrade process straightforward for most applications.