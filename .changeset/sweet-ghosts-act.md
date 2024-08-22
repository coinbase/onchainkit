---
"@coinbase/onchainkit": minor
---

- **feat**: Moved the `onError` and `onSuccess` lifecycle listeners from the `<SwapButton>` component to the `<Swap>` component. By @zizzamia #1139

Breaking Changes
OnchainKit standardizes lifecycle listeners with three callbacks: `onError`, `onSuccess`, and `onStatus`. The `onError` and `onSuccess` callbacks handle only the `error` and `success` states, respectively. In contrast, the `onStatus` callback provides more granular phases of each component's experience.

Before, we used `onError` and `onSuccess` in the `<SwapButton />` component.
```ts
const handleOnError = useCallback((error) => {
  console.log(error);
}, []);

const handleOnSuccess = useCallback((response) => {
  console.log(response);
}, []);

...

<Swap address={address}>
  <SwapAmountInput
    label="Sell"
    swappableTokens={swappableTokens}
    token={ETHToken}
    type="from"
  />
  <SwapToggleButton />
  <SwapAmountInput
    label="Buy"
    swappableTokens={swappableTokens}
    token={USDCToken}
    type="to"
  />
  <SwapButton
    onError={handleOnError}
    onSuccess={handleOnSuccess}
  />
  <SwapMessage />
</Swap> 
```

After, we use `onStatus` in the `<Swap />` component.
```ts
const handleOnStatus = useCallback((lifeCycleStatus: LifeCycleStatus) => {
  console.log('Status:', lifeCycleStatus);
}, []);

...

<Swap
  address={address}
  onStatus={handleOnStatus}
>
  <SwapAmountInput
    label="Sell"
    swappableTokens={swappableTokens}
    token={ETHToken}
    type="from"
  />
  <SwapToggleButton />
  <SwapAmountInput
    label="Buy"
    swappableTokens={swappableTokens}
    token={USDCToken}
    type="to"
  />
  <SwapButton />
  <SwapMessage />
</Swap>
```
