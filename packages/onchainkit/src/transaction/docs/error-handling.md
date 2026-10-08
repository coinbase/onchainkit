# Error Handling & UX Guidelines

This guide explains how OnchainKit surfaces errors and how to translate them into
clear, user-friendly messages. It is based on the actual TypeScript types in the
library source.

---

## The `TransactionError` Type

All `onError` callbacks in OnchainKit receive a `TransactionError` object, which
is an alias for `APIError` ([`src/api/types.ts`](../api/types.ts)):

```ts
// src/api/types.ts
export type APIError = {
  code: string;    // error code, e.g. 'UNCAUGHT_TRANSACTION_ERROR'
  error: string;   // long message (internal, not for users)
  message: string; // short message (safe to log)
};

export type TransactionError = APIError;
```

The `<Transaction>` component exposes `onError` with this exact type
([`src/transaction/types.ts`](../transaction/types.ts)):

```ts
// TransactionProps (excerpt)
onError?: (e: TransactionError) => void;
```

Note: **`TransactionError` does not have a numeric `.code` field** — it has a
`string` `.code`. There is no `.code === 4001` on this object. Wallet-level
rejections (EIP-1193 code `4001`) surface inside the `.error` or `.message`
string, not as a numeric property.

---

## Checking the Lifecycle Status

For richer state management, prefer `onStatus` over `onError`. It receives a
`LifecycleStatus` union ([`src/transaction/types.ts`](../transaction/types.ts)):

```ts
export type LifecycleStatus =
  | { statusName: 'init';                    statusData: null }
  | { statusName: 'error';                   statusData: TransactionError }
  | { statusName: 'transactionIdle';         statusData: null }
  | { statusName: 'buildingTransaction';     statusData: null }
  | { statusName: 'transactionPending';      statusData: null }
  | { statusName: 'transactionLegacyExecuted'; statusData: { transactionHashList: Address[] } }
  | { statusName: 'success';                 statusData: { transactionReceipts: TransactionReceipt[] } }
  | { statusName: 'reset';                   statusData: null };
```

Usage:

```tsx
import { Transaction } from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';

<Transaction
  chainId={base.id}
  calls={calls}
  onStatus={(status: LifecycleStatus) => {
    if (status.statusName === 'error') {
      console.log(status.statusData.code);    // string, e.g. 'UNCAUGHT_TRANSACTION_ERROR'
      console.log(status.statusData.message); // short human-readable message
    }
  }}
  onError={(e) => {
    // e: TransactionError = { code: string, error: string, message: string }
    handleError(e);
  }}
/>
```

---

## Error Categories and Recommended UX

OnchainKit errors fall into five categories. Each surfaces differently through
the `TransactionError.code` string or the `error`/`message` content.

### 1. Wallet Not Connected

**How it surfaces:** Components disable themselves; hooks from wagmi throw before
reaching OnchainKit. Check with `useAccount()` before rendering onchain actions.

**Recommended message:**
> "Connect your wallet to continue."

```tsx
import { useAccount } from 'wagmi';

function ActionButton() {
  const { isConnected } = useAccount();
  return (
    <button disabled={!isConnected}>
      {isConnected ? 'Send' : 'Connect wallet to continue'}
    </button>
  );
}
```

---

### 2. Wrong Network

**How it surfaces:** Wagmi's `useChainId()` returns an unexpected value.
The `<Transaction chainId={base.id}>` prop will guard this automatically.

**Recommended message:**
> "Switch to Base to continue."

```tsx
import { useChainId, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';

function NetworkGuard({ children }: { children: React.ReactNode }) {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  if (chainId !== base.id) {
    return (
      <div>
        <p>Switch to Base to use this app.</p>
        <button onClick={() => switchChain({ chainId: base.id })}>
          Switch to Base
        </button>
      </div>
    );
  }
  return <>{children}</>;
}
```

---

### 3. User Rejected / Cancelled

**How it surfaces:** The `TransactionError.message` string contains text such as
`"User rejected"`. There is no numeric code — check the `message` or `error`
field with a string match:

```tsx
function classifyTransactionError(e: TransactionError): string {
  const msg = (e.message ?? '').toLowerCase();
  const detail = (e.error ?? '').toLowerCase();

  if (msg.includes('user rejected') || detail.includes('user rejected')) {
    return 'REJECTED';
  }
  if (msg.includes('insufficient funds') || detail.includes('insufficient funds')) {
    return 'INSUFFICIENT_FUNDS';
  }
  if (msg.includes('execution reverted') || detail.includes('execution reverted')) {
    return 'REVERTED';
  }
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout')) {
    return 'RPC_ERROR';
  }
  return e.code ?? 'UNKNOWN';
}
```

**Recommended message for rejection:**
> "Transaction cancelled."

Do **not** show an error icon or prompt a retry — the user intentionally cancelled.

---

### 4. Insufficient Funds

**How it surfaces:** Surfaces in `TransactionError.message` as
`"insufficient funds"` from the underlying RPC call (EVM standard).

**Recommended message:**
> "Insufficient ETH to cover this transaction and gas fees."

Offer a direct path to fund the wallet:

```tsx
import { FundButton } from '@coinbase/onchainkit/fund';

// When classifyTransactionError(e) === 'INSUFFICIENT_FUNDS':
<div>
  <p>Insufficient ETH to cover this transaction and gas fees.</p>
  <FundButton />
</div>
```

---

### 5. RPC / Network Errors

**How it surfaces:** Provider or network failures appear in
`TransactionError.message` as timeout, fetch, or network-related strings.

**Recommended message:**
> "Network error. Check your connection and try again."

Consider implementing exponential backoff before prompting the user to retry
manually.

---

## Centralised Error Handler

Import `TransactionError` from OnchainKit and build a single utility:

```tsx
import type { TransactionError } from '@coinbase/onchainkit/transaction';

export type ErrorCategory =
  | 'REJECTED'
  | 'INSUFFICIENT_FUNDS'
  | 'REVERTED'
  | 'RPC_ERROR'
  | 'UNKNOWN';

export function classifyTransactionError(e: TransactionError): ErrorCategory {
  const msg = (e.message ?? '').toLowerCase();
  const detail = (e.error ?? '').toLowerCase();
  const combined = `${msg} ${detail}`;

  if (combined.includes('user rejected')) return 'REJECTED';
  if (combined.includes('insufficient funds')) return 'INSUFFICIENT_FUNDS';
  if (combined.includes('execution reverted')) return 'REVERTED';
  if (combined.includes('network') || combined.includes('fetch') || combined.includes('timeout')) {
    return 'RPC_ERROR';
  }
  return 'UNKNOWN';
}

export const USER_MESSAGES: Record<ErrorCategory, string> = {
  REJECTED:           'Transaction cancelled.',
  INSUFFICIENT_FUNDS: 'Insufficient ETH for this transaction and gas fees.',
  REVERTED:           'Transaction failed on-chain. Check your inputs and try again.',
  RPC_ERROR:          'Network error. Check your connection and try again.',
  UNKNOWN:            'Something went wrong. Please try again.',
};
```

Usage in any component:

```tsx
import { Transaction } from '@coinbase/onchainkit/transaction';
import { classifyTransactionError, USER_MESSAGES } from '@/lib/onchainErrors';

<Transaction
  chainId={base.id}
  calls={calls}
  onError={(e) => {
    const category = classifyTransactionError(e);
    if (category !== 'REJECTED') {
      showToast(USER_MESSAGES[category]);
    }
    // REJECTED = user intentionally cancelled, no toast needed
  }}
/>
```

---

## When to Retry vs. Prompt the User

| Error category | Strategy |
|---|---|
| `REJECTED` | Do nothing — user chose to cancel |
| `INSUFFICIENT_FUNDS` | Show `<FundButton>`, do not retry |
| `REVERTED` | Prompt to check inputs, do not auto-retry |
| `RPC_ERROR` | Auto-retry with exponential backoff (max 3×), then prompt |
| `UNKNOWN` | Show "Try again" button, log `e.code` + `e.error` for debugging |

---

## Related Resources

- [`TransactionError` type source](../api/types.ts)
- [`LifecycleStatus` type source](../transaction/types.ts)
- [`<Transaction>` component docs](https://onchainkit.xyz/transaction/transaction)
- [`<FundButton>` component docs](https://onchainkit.xyz/fund/fund-button)
- [`<Wallet>` component docs](https://onchainkit.xyz/wallet/wallet)
