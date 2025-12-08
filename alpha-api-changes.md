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

### Component Enhancements

All existing component APIs remain **backward compatible**. However, several components now support new render prop patterns:

#### New Render Props Support
- **ConnectWallet**: Added render prop for custom button rendering
- **SignatureButton**: Added render prop for custom button rendering

```tsx
// ConnectWallet render prop (NEW)
<ConnectWallet
  render={({ label, onClick, context, status, isLoading }) => (
    <CustomButton onClick={onClick} loading={isLoading}>
      {label}
    </CustomButton>
  )}
/>

// SignatureButton render prop (NEW)
<SignatureButton
  render={({ label, onClick, context }) => (
    <CustomButton onClick={onClick}>
      {label}
    </CustomButton>
  )}
/>
```

#### Component API Compatibility
No breaking changes to:

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

## Styling System Changes

### Internal Styling System Upgrade

#### Internal Changes (No User Action Required)
- **OnchainKit Build**: Now uses Tailwind CSS v4 internally
- **Pre-built Styles**: All styles are compiled and distributed as CSS
- **Self-contained**: No impact on user's own Tailwind setup

**Note**: You don't need to upgrade your own Tailwind CSS version. OnchainKit's styles are pre-built and imported via `@coinbase/onchainkit/styles.css`.

### Scoped Styling System

#### New Features
- **Class Prefixing**: All OnchainKit classes automatically prefixed with `ock-`
- **CSS Variable Scoping**: Theme variables use `--ock-` prefix
- **Data Attribute Theming**: Themes applied via `data-ock-theme` attributes

#### Breaking Changes for Custom Styling
```css
/* v0.x - Global CSS variables */
:root {
  --text-primary: #000000;
  --bg-primary: #ffffff;
}

/* v1.0 - Scoped CSS variables */
[data-ock-theme='default-light'] {
  --ock-text-foreground: #000000;
  --ock-background: #ffffff;
}
```

#### New Scoped Color System
- `ock-foreground`, `ock-foreground-muted`, `ock-foreground-inverse`
- `ock-background`, `ock-background-hover`, `ock-background-active`
- `ock-primary`, `ock-secondary`, `ock-error`, `ock-warning`, `ock-success`

### Theme Configuration Changes

#### v0.x Theme Application
```tsx
// Applied globally
<html className="dark">
```

#### v1.0 Theme Application
```tsx
// Applied via data attributes
<html data-ock-theme="default-dark">
```

## Configuration Changes

### Package.json Structure

#### Package Exports
All existing exports remain the same with no additions or removals.

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
- **Custom theming**: CSS variables need `--ock-` prefix migration (if customizing OnchainKit themes)

### High Impact Changes
- **React version**: Must upgrade to React 19
- **Build system**: Projects using custom builds may need updates
- **Styling conflicts**: Existing CSS may conflict with new scoped system

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
| User's Tailwind v3/v4 | ✅ | ✅ | ✅ (no impact) |
| Global CSS variables | ✅ | ❌ | ❌ |
| Scoped CSS variables | ❌ | ✅ | ⚠️ (new system) |
| Render props | ❌ | ✅ | ✅ (additive) |

## Summary

OnchainKit v1.0.0 is a **major version** with breaking changes primarily focused on:

1. **Provider consolidation** (MiniKitProvider → OnchainKitProvider)
2. **Dependency management** (explicit peer dependencies)
3. **React 19 requirement** (React 18 support removed)
4. **Build system modernization** (Vite-based)

The **component and hook APIs remain backward compatible**, making the upgrade process straightforward for most applications.