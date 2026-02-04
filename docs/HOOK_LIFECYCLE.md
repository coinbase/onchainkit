# OnchainKit Hook Lifecycle & State Management

> Understanding loading, pending, and completion states in OnchainKit hooks and components.

## Overview

OnchainKit hooks and components expose various states to help you build responsive UIs. This guide explains when states change, what they mean, and how to use them effectively.

## State Management Patterns

OnchainKit uses two primary patterns for exposing states:

1. **React Query States** - For data-fetching hooks (identity, etc.)
2. **Lifecycle Status** - For action components (transactions, swaps)

---

## 1. React Query States (Identity Hooks)

Identity hooks like `useName` and `useAvatar` are built on `@tanstack/react-query` and return standard query result objects.

### Available States

| Property | Type | Description |
|----------|------|-------------|
| `data` | `T | undefined` | The resolved data when successful |
| `isLoading` | `boolean` | `true` during initial fetch (no cached data) |
| `isFetching` | `boolean` | `true` during any fetch (including refetch) |
| `isSuccess` | `boolean` | `true` when data is available |
| `isError` | `boolean` | `true` when query failed |
| `error` | `Error | null` | Error object if failed |
| `status` | `'loading' | 'error' | 'success'` | Current status string |

### useName Example

```tsx
import { useName } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';

function UserName({ address }: { address: string }) {
  const { data: name, isLoading, isError, error } = useName({
    address,
    chain: base,
  });

  // Loading state - show skeleton
  if (isLoading) {
    return <span className="animate-pulse bg-gray-200 w-24 h-4" />;
  }

  // Error state - show fallback
  if (isError) {
    console.error('Failed to fetch name:', error);
    return <span>{address.slice(0, 6)}...{address.slice(-4)}</span>;
  }

  // Success state - show name
  return <span>{name}</span>;
}
```

### useAvatar Example

```tsx
import { useAvatar } from '@coinbase/onchainkit/identity';

function UserAvatar({ ensName }: { ensName: string }) {
  const { data: avatarUrl, isLoading, isSuccess } = useAvatar({
    ensName,
  });

  if (isLoading) {
    return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (isSuccess && avatarUrl) {
    return <img src={avatarUrl} alt={ensName} className="w-10 h-10 rounded-full" />;
  }

  // No avatar found - show placeholder
  return <div className="w-10 h-10 rounded-full bg-blue-500" />;
}
```

---

## 2. Transaction Lifecycle States

The `<Transaction />` component tracks operations through a detailed lifecycle.

### LifecycleStatus States

| State | Description | When It Occurs |
|-------|-------------|----------------|
| `init` | Component mounted | Initial render |
| `error` | Transaction failed | Any error (user rejection, network, etc.) |
| `transactionIdle` | Ready for user action | Waiting for button click |
| `buildingTransaction` | Preparing transaction | Resolving calls, estimating gas |
| `transactionPending` | Transaction submitted | Waiting for confirmation |
| `transactionLegacyExecuted` | Legacy transaction complete | EOA transaction confirmed |
| `success` | Transaction confirmed | Receipt received |

### Monitoring with onStatus

```tsx
import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';

function MyTransaction({ calls }) {
  const handleStatus = (status) => {
    switch (status.statusName) {
      case 'init':
        console.log('Transaction component ready');
        break;
      case 'buildingTransaction':
        console.log('Preparing transaction...');
        break;
      case 'transactionPending':
        console.log('Transaction submitted, waiting for confirmation...');
        break;
      case 'success':
        console.log('Transaction confirmed!', status.statusData);
        break;
      case 'error':
        console.error('Transaction failed:', status.statusData);
        break;
    }
  };

  return (
    <Transaction calls={calls} onStatus={handleStatus}>
      <TransactionButton />
    </Transaction>
  );
}
```

### When to Update UI

| State | Safe Actions |
|-------|--------------|
| `init` | Show initial UI, enable button |
| `buildingTransaction` | Show loading indicator, disable button |
| `transactionPending` | Show pending state, disable interactions |
| `success` | Update data, show confirmation, redirect |
| `error` | Show error message, enable retry |

---

## 3. Swap Component States

The Swap component manages its own internal states but exposes them through callbacks.

### Key States

| State | Meaning | UI Recommendation |
|-------|---------|-------------------|
| Validating | Checking token balances/allowances | Show subtle loading |
| Ready | Can execute swap | Enable swap button |
| Pending | Swap transaction in progress | Show pending indicator |
| Success | Swap completed | Show confirmation, update balances |
| Error | Swap failed | Show error, enable retry |

---

## 4. Wallet Connection States

Wallet state is managed by wagmi's `useAccount` hook (commonly used with OnchainKit).

### Connection States

```tsx
import { useAccount } from 'wagmi';

function WalletStatus() {
  const { address, isConnecting, isConnected, isDisconnected } = useAccount();

  if (isConnecting) {
    return <span>Connecting...</span>;
  }

  if (isDisconnected) {
    return <span>Not connected</span>;
  }

  if (isConnected) {
    return <span>Connected: {address}</span>;
  }
}
```

---

## 5. Best Practices

### 1. Always Handle Loading States

```tsx
// Bad - jarring experience
function Profile({ address }) {
  const { data: name } = useName({ address });
  return <span>{name}</span>; // Shows "undefined" briefly
}

// Good - smooth experience
function Profile({ address }) {
  const { data: name, isLoading } = useName({ address });

  if (isLoading) return <Skeleton />;
  return <span>{name || 'Anonymous'}</span>;
}
```

### 2. Provide Error Fallbacks

```tsx
function Avatar({ address }) {
  const { data: name } = useName({ address });
  const { data: avatar, isError } = useAvatar({ ensName: name });

  if (isError || !avatar) {
    return <Jazzicon address={address} />; // Fallback to generated avatar
  }

  return <img src={avatar} alt={name} />;
}
```

### 3. Disable Actions During Pending States

```tsx
function SendTransaction({ calls }) {
  const [isPending, setIsPending] = useState(false);

  return (
    <Transaction
      calls={calls}
      onStatus={(status) => {
        setIsPending(status.statusName === 'transactionPending');
      }}
    >
      <TransactionButton disabled={isPending} />
    </Transaction>
  );
}
```

---

## Quick Reference

### Identity Hooks Return Values

```typescript
interface QueryResult<T> {
  data: T | undefined;
  isLoading: boolean;      // Initial load (no cache)
  isFetching: boolean;     // Any fetch in progress
  isSuccess: boolean;      // Data available
  isError: boolean;        // Query failed
  error: Error | null;
}
```

### Transaction Lifecycle Status

```typescript
type LifecycleStatusName =
  | 'init'
  | 'error'
  | 'transactionIdle'
  | 'buildingTransaction'
  | 'transactionPending'
  | 'transactionLegacyExecuted'
  | 'success';
```

### Safe UI Update Points

| Hook/Component | Show Loading | Enable Actions | Update Data |
|----------------|--------------|----------------|-------------|
| `useName` | `isLoading` | `isSuccess` | `isSuccess` |
| `useAvatar` | `isLoading` | `isSuccess` | `isSuccess` |
| `<Transaction>` | `buildingTransaction` | `init`, `error` | `success` |
| `<Swap>` | Pending state | Ready state | Success state |

---

*For detailed API documentation, visit [docs.base.org/builderkits/onchainkit](https://docs.base.org/builderkits/onchainkit)*
