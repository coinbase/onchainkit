# Subscribe Component

The Subscribe component enables apps to accept subscriptions using spend permissions. Users can approve recurring payments that apps can collect within the specified limits and intervals.

## Features

- **Simple API**: Similar to Stripe payment links - just specify amount, token, interval, and spender
- **ERC-712 Signatures**: Secure spend permission signatures using existing wallet infrastructure
- **Multi-chain Support**: Works on all chains where SpendPermissionManager is deployed
- **Flexible Intervals**: Support for arbitrary duration combinations (days, weeks, months, etc.)
- **Automatic Allowance Calculation**: Calculates total allowance based on subscription length
- **Component Composition**: Individual components for maximum flexibility

## Basic Usage

```tsx
import { Subscribe } from '@coinbase/onchainkit/subscribe';
import { usdcToken } from '@coinbase/onchainkit/token';

function MyApp() {
  return (
    <Subscribe
      amount="10"
      token={usdcToken}
      interval={{ days: 30 }}
      spender="0x742d35Cc6635C0532925a3b8D4DDEC5764B72d32"
      onSuccess={(result) => {
        console.log('Subscription approved!', result.signature);
        // Send signature to your backend for processing
      }}
      onError={(error) => {
        console.error('Subscription failed:', error);
      }}
    />
  );
}
```

**Note:** Without `subscriptionLength`, this creates an unlimited subscription where the spender can collect $10 every 30 days until the user revokes the permission.

## Advanced Usage

### Limited Subscription Length

```tsx
<Subscribe
  amount="15"
  token={usdcToken}
  interval={{ months: 1 }}
  subscriptionLength={{ years: 1 }}  // 12 payments total
  spender="0x742d35Cc6635C0532925a3b8D4DDEC5764B72d32"
  buttonText="Subscribe for 1 Year"
  onSuccess={(result) => {
    // result.metadata contains all subscription details
    console.log('Total allowance:', result.spendPermission.allowance);
  }}
/>
```

### Complex Intervals

```tsx
<Subscribe
  amount="5"
  token={usdcToken}
  interval={{ weeks: 2, days: 3 }}  // Every 17 days
  spender="0x742d35Cc6635C0532925a3b8D4DDEC5764B72d32"
/>
```

### With Extra Data

```tsx
// Include order number or user ID for tracking
const orderData = `0x${Buffer.from(JSON.stringify({
  orderId: 'order-12345',
  userId: 'user-67890'
})).toString('hex')}`;

<Subscribe
  amount="20"
  token={usdcToken}
  interval={{ days: 30 }}
  spender="0x742d35Cc6635C0532925a3b8D4DDEC5764B72d32"
  extraData={orderData}
  salt="auto" // Explicitly use timestamp-based salt for uniqueness
  onSuccess={(result) => {
    // Access the extraData in the spend permission
    console.log('Extra data:', result.spendPermission.extraData);
    console.log('Metadata:', result.metadata.extraData);
    console.log('Generated salt:', result.spendPermission.salt);
  }}
/>
```

### Custom Components

```tsx
import {
  SubscribeProvider,
  SubscribeButton,
  SubscribeStatus
} from '@coinbase/onchainkit/subscribe';

function CustomSubscribe() {
  return (
    <SubscribeProvider
      amount="25"
      token={usdcToken}
      interval={{ days: 7 }}
      spender="0x742d35Cc6635C0532925a3b8D4DDEC5764B72d32"
      onSuccess={(result) => handleSuccess(result)}
    >
      <div className="my-custom-layout">
        <h2>Premium Subscription</h2>
        <p>$25 weekly for premium features</p>
        <SubscribeButton text="Start Premium" />
        <SubscribeStatus />
      </div>
    </SubscribeProvider>
  );
}
```

### Subscription Status Management

```tsx
import { useSubscriptionStatus } from '@coinbase/onchainkit/subscribe';

function SubscriptionManager({ spendPermission }) {
  const { status, isLoading, refetch } = useSubscriptionStatus({
    spendPermission,
    refreshInterval: 30000, // Check every 30 seconds
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Subscription Status</h3>
      <p>Active: {status?.isActive ? 'Yes' : 'No'}</p>
      <p>Current Period Spent: {status?.currentPeriodSpent ? 'Yes' : 'No'}</p>
      <p>Total Spent: {status?.totalSpent.toString()}</p>
      {status?.nextPeriodStart && (
        <p>Next Period: {new Date(status.nextPeriodStart * 1000).toLocaleDateString()}</p>
      )}
      <button onClick={refetch}>Refresh Status</button>
    </div>
  );
}
```

## Props

### Subscribe

| Prop                 | Type                                         | Required | Description                                                                          |
|----------------------|----------------------------------------------|----------|--------------------------------------------------------------------------------------|
| `amount`             | `string`                                     | Yes      | Amount to charge per period                                                          |
| `token`              | `Token`                                      | Yes      | Token object (use constants from `@coinbase/onchainkit/token`)                       |
| `interval`           | `Duration`                                   | Yes      | Subscription interval duration                                                       |
| `spender`            | `Address`                                    | Yes      | Address authorized to spend user's tokens                                            |
| `subscriptionLength` | `Duration`                                   | No       | Total subscription duration (defaults to unlimited recurring payments)               |
| `buttonText`         | `string`                                     | No       | Custom button text (defaults to "Subscribe")                                         |
| `className`          | `string`                                     | No       | Custom CSS classes                                                                   |
| `disabled`           | `boolean`                                    | No       | Disable the subscribe button                                                         |
| `extraData`          | `Hex`                                        | No       | Additional data to include in spend permission (e.g., order ID, user ID)             |
| `salt`               | `bigint \| 'auto'`                           | No       | Salt for spend permission uniqueness (defaults to 0, use 'auto' for timestamp-based) |
| `onSuccess`          | `(result: SubscribeSuccessResult) => void`   | No       | Success callback                                                                     |
| `onError`            | `(error: APIError) => void`                  | No       | Error callback                                                                       |
| `onStatus`           | `(status: SubscribeLifecycleStatus) => void` | No       | Status change callback                                                               |

### Duration

```tsx
type Duration = {
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  weeks?: number;
  months?: number;
  years?: number;
};
```

Examples:

- `{ days: 30 }` - Monthly
- `{ months: 1 }` - Monthly (equivalent to 30 days)
- `{ weeks: 1 }` - Weekly
- `{ days: 7 }` - Weekly (alternative)
- `{ weeks: 2, days: 3 }` - Every 17 days
- `{ years: 1 }` - Annually (equivalent to 365 days)

**Note:** Coinbase Wallet requires intervals to be divisible by whole days (86400 seconds). Time units are rounded:

- ✅ **Days**: Exact values
- ✅ **Weeks**: 7 days each
- ✅ **Months**: Rounded to 30 days each
- ✅ **Years**: Rounded to 365 days each

## Performance Considerations

### Stabilizing Props

To prevent unnecessary permission refetches, ensure that object props like `interval` are stable across renders:

```tsx
import { useMemo } from 'react';

function MyComponent() {
  // ✅ Good: Stable interval object
  const interval = useMemo(() => ({ days: 30 }), []);

  // ❌ Bad: New object on every render causes refetch
  // const interval = { days: 30 };

  return (
    <Subscribe
      amount="10"
      token={usdcToken}
      interval={interval}
      spender="0x742d35Cc6635C0532925a3b8D4DDEC5764B72d32"
    />
  );
}
```

### Dynamic Intervals

For dynamic intervals, use proper dependencies:

```tsx
function DynamicSubscription({ planType }) {
  const interval = useMemo(() => {
    switch (planType) {
      case 'weekly': return { days: 7 };
      case 'monthly': return { days: 30 };
      case 'yearly': return { years: 1 };
      default: return { days: 30 };
    }
  }, [planType]);

  return (
    <Subscribe
      amount="10"
      token={usdcToken}
      interval={interval}
      spender="0x742d35Cc6635C0532925a3b8D4DDEC5764B72d32"
    />
  );
}
```

## Working with Extra Data

The `extraData` parameter allows you to attach custom information to spend permissions. This is useful for tracking orders, user IDs, subscription plans, or any other metadata your application needs.

### Encoding Custom Data

**Note:** The examples below use Node.js `Buffer`. For browser environments, you'll need to use a polyfill or `TextEncoder`:

```tsx
// Browser-compatible encoding function
function encodeToHex(data: string): `0x${string}` {
  return `0x${Array.from(new TextEncoder().encode(data))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')}`;
}

// Simple string data
const simpleData = `0x${Buffer.from('order-12345').toString('hex')}`;

// JSON data for complex objects
const complexData = `0x${Buffer.from(JSON.stringify({
  orderId: 'sub-12345',
  userId: 'user-67890',
  planType: 'premium',
  createdAt: Date.now()
})).toString('hex')}`;

// Use in Subscribe component
    <Subscribe
      amount="25"
      token={usdcToken}
      interval={{ months: 1 }}
      spender="0x742d35Cc6635C0532925a3b8D4DDEC5764B72d32"
      extraData={complexData}
      onSuccess={(result) => {
        // The extraData is available in both places:
        console.log('In spend permission:', result.spendPermission.extraData);
        console.log('In metadata:', result.metadata.extraData);

        // Decode the data for your backend
        const decoded = JSON.parse(
          Buffer.from(result.metadata.extraData.slice(2), 'hex').toString()
        );
        console.log('Decoded:', decoded);
      }}
    />
```

### Dynamic Extra Data

```tsx
function SubscriptionFlow({ orderId, userId }) {
  // Generate dynamic extraData based on current context
  const extraData = useMemo(() => {
    const data = {
      orderId,
      userId,
      timestamp: Date.now(),
      version: '1.0'
    };
    return `0x${Buffer.from(JSON.stringify(data)).toString('hex')}`;
  }, [orderId, userId]);

  return (
    <Subscribe
      amount="10"
      token={usdcToken}
      interval={{ days: 30 }}
      spender="0x742d35Cc6635C0532925a3b8D4DDEC5764B72d32"
      extraData={extraData}
      onSuccess={(result) => {
        // Send to backend with all context
        processSubscription({
          signature: result.signature,
          spendPermission: result.spendPermission,
          orderContext: JSON.parse(
            Buffer.from(result.metadata.extraData.slice(2), 'hex').toString()
          )
        });
      }}
    />
  );
}
```

## Backend Integration

After receiving the signature from `onSuccess`, your backend should:

1. **Approve the spend permission** by calling `SpendPermissionManager.approveWithSignature()`
2. **Collect payments** periodically by calling `SpendPermissionManager.spend()`

```solidity
// Example backend contract interaction
ISpendPermissionManager manager = ISpendPermissionManager(0xf85210B21cC50302F477BA56686d2019dC9b67Ad);

// 1. Approve the permission
manager.approveWithSignature(spendPermission, signature);

// 2. Later, collect payment
manager.spend(spendPermission, spender, amount);
```

## Supported Chains

The Subscribe component works on all chains where SpendPermissionManager is deployed:

**Mainnets:**

- Base
- Ethereum
- Optimism
- Arbitrum
- Polygon
- Zora
- Binance Smart Chain
- Avalanche
- LORDCHAIN
- Metacade

**Testnets:**

- Base Sepolia
- Optimism Sepolia
- Ethereum Sepolia

## Error Handling

Common errors and their meanings:

- `"Request denied."` - User rejected the signature request
- `"Wallet not connected"` - User needs to connect their wallet
- `"Subscription interval must be at least 1 minute"` - Interval too short
- `"Amount must be greater than 0"` - Invalid amount specified
- `"Subscription length results in too many periods"` - Total periods exceed 1000

## Security Considerations

- Users retain full control and can revoke permissions at any time
- Spend permissions are limited to the exact token, amount, and time constraints specified
- Apps cannot make arbitrary contract calls from user accounts
- All signatures use ERC-712 for secure, readable authorization
