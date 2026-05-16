# Error Handling & UX Guidelines

This guide covers how OnchainKit surfaces errors and how to translate them into
clear, user-friendly messages. Understanding these patterns helps you build apps
that respond gracefully to every failure scenario.

---

## Error Categories

OnchainKit errors fall into five categories. Each has a different cause, expected
frequency, and recommended UX response.

### 1. Wallet Not Connected

**When it happens:** User triggers an onchain action before connecting a wallet.

**How it surfaces:** Components like `<Transaction>` and `<Swap>` disable
themselves when no wallet is connected. If you call hooks directly, wagmi throws
`ConnectorNotConnectedError`.

**Recommended message:**
> "Connect your wallet to continue."

**Pattern:**
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

**Guidance:**
- Show the `<Wallet>` connect button prominently; don't just disable actions silently.
- Never show a generic "Something went wrong" for this case — the user just needs to connect.

---

### 2. Wrong Network

**When it happens:** User is connected to a chain that isn't Base or Base Sepolia.

**How it surfaces:** Transactions fail with RPC errors or wagmi's
`ChainMismatchError`. The `useChainId()` hook returns an unexpected chain ID.

**Recommended message:**
> "You're on the wrong network. Switch to Base to continue."

**Pattern:**
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

**Guidance:**
- Detect the mismatch *before* the user hits "Send" — show a persistent banner.
- If `switchChain` is unavailable (e.g. hardware wallet), show a manual instruction instead.

---

### 3. User Rejected / Cancelled

**When it happens:** User dismisses the wallet confirmation popup.

**How it surfaces:** The wallet throws `UserRejectedRequestError` (EIP-1193 code
`4001`). OnchainKit propagates this via the `onError` callback on `<Transaction>`.

**Recommended message:**
> "Transaction cancelled."  *(no retry prompt needed — the user chose to cancel)*

**Pattern:**
```tsx
import { Transaction } from '@coinbase/onchainkit/transaction';

<Transaction
  calls={calls}
  onError={(error) => {
    if (error.code === 4001 || error.message?.includes('User rejected')) {
      showToast('Transaction cancelled.');   // quiet, no alarm
    } else {
      showToast('Transaction failed. Please try again.');
    }
  }}
/>
```

**Guidance:**
- Keep the message short and neutral — the user intentionally cancelled.
- Do **not** auto-retry or show an error icon for rejections.
- Log rejections only for analytics, not for error tracking.

---

### 4. Insufficient Funds

**When it happens:** User's balance is too low to cover the transaction value + gas.

**How it surfaces:** The RPC returns an error with message containing
`"insufficient funds"` or code `-32000`. This can be caught in `onError`.

**Recommended message:**
> "Insufficient ETH balance to cover this transaction and gas fees."

**Pattern:**
```tsx
function parseTransactionError(error: Error): string {
  const msg = error.message?.toLowerCase() ?? '';

  if (msg.includes('insufficient funds')) {
    return 'Insufficient ETH for this transaction and gas fees.';
  }
  if (msg.includes('user rejected') || (error as any).code === 4001) {
    return 'Transaction cancelled.';
  }
  if (msg.includes('nonce too low')) {
    return 'Transaction conflict detected. Please wait a moment and try again.';
  }
  if (msg.includes('execution reverted')) {
    return 'Transaction failed on-chain. Check your inputs and try again.';
  }
  return 'Transaction failed. Please try again.';
}
```

**Guidance:**
- Show the user's current ETH balance alongside the error when possible.
- Offer a direct link to fund their wallet (e.g. via `<FundButton>`).

---

### 5. RPC / Network Errors

**When it happens:** The RPC endpoint is unreachable, rate-limited, or returns an
unexpected response.

**How it surfaces:** `fetch` failures, `Error: could not detect network`, or
HTTP `429 Too Many Requests` from the RPC provider.

**Recommended message:**
> "Network error. Check your connection and try again."

**Pattern:**
```tsx
function isRpcError(error: Error): boolean {
  const msg = error.message?.toLowerCase() ?? '';
  return (
    msg.includes('network') ||
    msg.includes('fetch') ||
    msg.includes('timeout') ||
    msg.includes('429') ||
    msg.includes('could not detect')
  );
}
```

**Guidance:**
- Implement exponential backoff for automatic retries on RPC errors — don't spam the user with prompts.
- Consider switching to a fallback RPC URL for production apps (see the [build-app guide](https://docs.base.org/get-started/build-app)).

---

## Error Decision Tree

Use this quick reference to decide what message and action to show:

| Error type | User sees | Action offered |
|---|---|---|
| Not connected | "Connect your wallet to continue." | Show `<Wallet>` connect button |
| Wrong network | "Switch to Base to continue." | "Switch to Base" button |
| User rejected | "Transaction cancelled." | None (user chose this) |
| Insufficient funds | "Insufficient ETH for gas fees." | "Add funds" / `<FundButton>` |
| Execution reverted | "Transaction failed on-chain." | "Try again" button |
| RPC / network | "Network error. Try again." | "Retry" button (with backoff) |
| Unknown | "Something went wrong. Try again." | "Retry" + support link |

---

## Consistent Error Handling Across the App

Rather than duplicating `onError` logic in every component, centralise it:

```tsx
// lib/onchainErrors.ts
export type OnchainErrorCode =
  | 'NOT_CONNECTED'
  | 'WRONG_NETWORK'
  | 'USER_REJECTED'
  | 'INSUFFICIENT_FUNDS'
  | 'REVERTED'
  | 'RPC_ERROR'
  | 'UNKNOWN';

export function classifyError(error: Error): OnchainErrorCode {
  const msg = error.message?.toLowerCase() ?? '';
  const code = (error as any).code;

  if (code === 4001 || msg.includes('user rejected')) return 'USER_REJECTED';
  if (msg.includes('insufficient funds'))              return 'INSUFFICIENT_FUNDS';
  if (msg.includes('execution reverted'))              return 'REVERTED';
  if (msg.includes('network') || msg.includes('fetch')) return 'RPC_ERROR';
  return 'UNKNOWN';
}

export const USER_MESSAGES: Record<OnchainErrorCode, string> = {
  NOT_CONNECTED:      'Connect your wallet to continue.',
  WRONG_NETWORK:      'Switch to Base to continue.',
  USER_REJECTED:      'Transaction cancelled.',
  INSUFFICIENT_FUNDS: 'Insufficient ETH for this transaction and gas fees.',
  REVERTED:           'Transaction failed on-chain. Check your inputs and try again.',
  RPC_ERROR:          'Network error. Check your connection and try again.',
  UNKNOWN:            'Something went wrong. Please try again.',
};
```

Then use it in any component:

```tsx
import { classifyError, USER_MESSAGES } from '@/lib/onchainErrors';
import { Transaction } from '@coinbase/onchainkit/transaction';

<Transaction
  calls={calls}
  onError={(error) => {
    const code = classifyError(error);
    if (code !== 'USER_REJECTED') {   // don't toast for intentional cancels
      showToast(USER_MESSAGES[code]);
    }
  }}
/>
```

---

## When to Retry vs. Prompt the User

| Situation | Strategy |
|---|---|
| RPC timeout / 429 | Auto-retry with exponential backoff (max 3 attempts) |
| User rejected | Do nothing — user chose to cancel |
| Insufficient funds | Prompt to add funds, do not retry |
| Execution reverted | Prompt user to check inputs, do not auto-retry |
| Unknown error | Show "Try again" button, log to error tracker |

---

## Related Resources

- [`<Transaction>` component](https://onchainkit.xyz/transaction/transaction)
- [`<Wallet>` component](https://onchainkit.xyz/wallet/wallet)
- [`<FundButton>` component](https://onchainkit.xyz/fund/fund-button)
- [Base network faucet](https://docs.base.org/docs/tools/network-faucets)
