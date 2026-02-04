# OnchainKit Component Architecture Guide

> Understanding how OnchainKit components work together to build onchain applications.

## Overview

OnchainKit uses a **hierarchical component model** where a root provider supplies context to child components, which can then be composed together to create complete features. This guide explains how the pieces fit together.

## The Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    OnchainKitProvider                       │
│  (Root context - provides chain, API keys, theme, etc.)     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Wallet    │  │ Transaction │  │        Swap         │ │
│  │  Components │  │  Components │  │     Components      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Identity   │  │  Checkout   │  │    Fund / Mint      │ │
│  │  Components │  │  Components │  │     Components      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 1. OnchainKitProvider (The Foundation)

**Every OnchainKit app starts here.** The provider wraps your application and supplies essential configuration to all child components.

```tsx
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'viem/chains';

function App() {
  return (
    <OnchainKitProvider
      chain={base}                          // Required: Target blockchain
      apiKey={process.env.CDP_API_KEY}      // Required for most components
      config={{
        appearance: {
          mode: 'auto',                     // 'auto' | 'light' | 'dark'
          theme: 'default',                 // 'base' | 'cyberpunk' | 'default' | 'hacker'
        },
        paymaster: 'https://...',           // Optional: Enable gas sponsorship
      }}
    >
      {/* All OnchainKit components go here */}
    </OnchainKitProvider>
  );
}
```

### What the Provider Enables

| Configuration | Components That Need It |
|--------------|------------------------|
| `chain` | All components |
| `apiKey` | Swap, Transaction, Checkout, NFTCard |
| `paymaster` | Transaction (for sponsored gas) |
| `projectId` | FundButton |

---

## 2. Component Families

OnchainKit organizes components into **families** that work together for specific use cases.

### Wallet Family

Handles connection, display, and management of user wallets.

```
Wallet (container)
├── ConnectWallet (connection button)
│   └── Custom children (optional button content)
└── WalletDropdown (expanded menu)
    ├── Identity (user info)
    │   ├── Avatar
    │   ├── Name
    │   ├── Address
    │   └── EthBalance
    ├── WalletDropdownBasename
    ├── WalletDropdownLink (custom links)
    └── WalletDropdownDisconnect
```

**Example:**
```tsx
import {
  Wallet, ConnectWallet, WalletDropdown,
  Identity, Avatar, Name, Address
} from '@coinbase/onchainkit/wallet';

<Wallet>
  <ConnectWallet>
    <Avatar />
    <Name />
  </ConnectWallet>
  <WalletDropdown>
    <Identity>
      <Avatar />
      <Name />
      <Address />
    </Identity>
    <WalletDropdownDisconnect />
  </WalletDropdown>
</Wallet>
```

### Transaction Family

Manages the full transaction lifecycle with status feedback.

```
Transaction (container)
├── TransactionButton (submit action)
├── TransactionSponsor (gas sponsorship indicator)
├── TransactionStatus (status container)
│   ├── TransactionStatusLabel
│   └── TransactionStatusAction
└── TransactionToast (notifications)
    ├── TransactionToastIcon
    ├── TransactionToastLabel
    └── TransactionToastAction
```

**Example:**
```tsx
import {
  Transaction, TransactionButton,
  TransactionStatus, TransactionStatusLabel
} from '@coinbase/onchainkit/transaction';

<Transaction
  calls={[{ to: '0x...', data: '0x...' }]}
  onStatus={(status) => console.log(status)}
>
  <TransactionButton />
  <TransactionStatus>
    <TransactionStatusLabel />
  </TransactionStatus>
</Transaction>
```

### Swap Family

Provides token exchange functionality with two usage patterns:

**Simple (SwapDefault):**
```tsx
import { SwapDefault } from '@coinbase/onchainkit/swap';

<SwapDefault from={[ETH]} to={[USDC]} />
```

**Customizable (Swap):**
```tsx
import {
  Swap, SwapAmountInput, SwapButton,
  SwapToggleButton, SwapMessage
} from '@coinbase/onchainkit/swap';

<Swap>
  <SwapAmountInput type="from" token={ETH} />
  <SwapToggleButton />
  <SwapAmountInput type="to" token={USDC} />
  <SwapButton />
  <SwapMessage />
</Swap>
```

### Identity Family

Displays user identity information from onchain sources (ENS, Basename).

```
Identity (container)
├── Avatar
├── Name
├── Badge (attestation indicator)
└── Address
```

**Example:**
```tsx
import { Identity, Avatar, Name, Badge, Address } from '@coinbase/onchainkit/identity';

<Identity address="0x..." schemaId="0x...">
  <Avatar />
  <Name>
    <Badge />
  </Name>
  <Address />
</Identity>
```

---

## 3. How Components Communicate

### Context Flow

Components communicate through **React Context**:

1. `OnchainKitProvider` creates the root context with chain config, API keys, and theme
2. Family containers (Wallet, Transaction, Swap) create sub-contexts for their children
3. Child components read from these contexts - no prop drilling needed

```
OnchainKitProvider (chain, apiKey, theme)
    │
    ├── Wallet (creates WalletContext)
    │       │
    │       ├── ConnectWallet (reads WalletContext)
    │       └── WalletDropdown (reads WalletContext)
    │
    └── Transaction (creates TransactionContext)
            │
            ├── TransactionButton (reads TransactionContext)
            └── TransactionStatus (reads TransactionContext)
```

### State Sharing

Within a family, components share state automatically:

- **Wallet**: Connection status flows to all children
- **Transaction**: Lifecycle state (pending, success, error) flows to status components
- **Swap**: Token selections and amounts sync between inputs

---

## 4. Combining Components

### Complete App Example

```tsx
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { Wallet, ConnectWallet, WalletDropdown, Identity, Avatar, Name } from '@coinbase/onchainkit/wallet';
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel } from '@coinbase/onchainkit/transaction';
import { SwapDefault } from '@coinbase/onchainkit/swap';
import { base } from 'viem/chains';

function App() {
  return (
    <OnchainKitProvider chain={base} apiKey={process.env.CDP_API_KEY}>
      {/* Wallet Connection */}
      <Wallet>
        <ConnectWallet>
          <Avatar />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity>
            <Avatar />
            <Name />
          </Identity>
        </WalletDropdown>
      </Wallet>

      {/* Token Swap */}
      <SwapDefault from={[ETH]} to={[USDC]} />

      {/* Custom Transaction */}
      <Transaction calls={myContractCalls}>
        <TransactionButton />
        <TransactionStatus>
          <TransactionStatusLabel />
        </TransactionStatus>
      </Transaction>
    </OnchainKitProvider>
  );
}
```

---

## 5. Key Principles

### 1. Always Wrap with Provider
Every OnchainKit component needs `OnchainKitProvider` as an ancestor.

### 2. Use Family Containers
Don't use sub-components standalone - they need their family container:
- ✅ `<Wallet><ConnectWallet /></Wallet>`
- ❌ `<ConnectWallet />` (won't work without Wallet parent)

### 3. Compose Freely Within Families
Sub-components are flexible - use only what you need:
```tsx
// Minimal
<Transaction calls={calls}>
  <TransactionButton />
</Transaction>

// Full-featured
<Transaction calls={calls}>
  <TransactionSponsor />
  <TransactionButton />
  <TransactionStatus>
    <TransactionStatusLabel />
    <TransactionStatusAction />
  </TransactionStatus>
</Transaction>
```

### 4. Customize via Props and className
All components accept `className` for styling. Many accept customization props:
```tsx
<ConnectWallet
  className="my-custom-button"
  onConnect={(address) => handleConnect(address)}
/>
```

---

## Quick Reference

| Family | Container | Key Sub-Components |
|--------|-----------|-------------------|
| Wallet | `<Wallet>` | ConnectWallet, WalletDropdown, Identity |
| Transaction | `<Transaction>` | TransactionButton, TransactionStatus, TransactionToast |
| Swap | `<Swap>` or `<SwapDefault>` | SwapAmountInput, SwapButton, SwapToggleButton |
| Identity | `<Identity>` | Avatar, Name, Badge, Address |
| Checkout | `<Checkout>` | CheckoutButton, CheckoutStatus |
| Fund | `<FundButton>` | (self-contained) |
| Mint | `<NFTCard>`, `<NFTMintCard>` | (self-contained) |

---

*For detailed API documentation, visit [docs.base.org/builderkits/onchainkit](https://docs.base.org/builderkits/onchainkit)*
