---
"@coinbase/onchainkit": minor
---

- **feat**: Moved the `onError` and `onSuccess` lifecycle listeners from the `<SwapButton>` component to the `<Swap>` component. By @zizzamia 

Breaking Changes
OnchainKit standardizes lifecycle listeners with three callbacks: `onError`, `onSuccess`, and `onStatus`. The `onError` and `onSuccess` callbacks handle only the `error` and `success` states, respectively. In contrast, the `onStatus` callback provides more granular phases of each component's experience.

Before
```ts
...
```

After
```ts
...
```
