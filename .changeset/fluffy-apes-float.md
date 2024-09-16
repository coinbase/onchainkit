---
'@coinbase/onchainkit': minor
---

- **feat**: re-typed walletCapabilities object in `OnchainKitConfig`. By @0xAlec #1238
- **fix**: removed `mt-4` from `<TransactionButton>`, ensuring the primary component maintains a clean and consistent design without outer margin. By @zizzamia #1258
- **fix**: renamed LifeCycle to Lifecycle. By @zizzamia #1257
- **fix**: `SwapSlippageInput` was visually resetting to default value on error. By @cpcramer #1250
- **fix**: removed context states and use `lifecyclestatus` as the source of truth, also persisted all lifecycle status data (except errors). By @alessey #1249
- **fix**: extracting `SwapMessage` to constants to avoid circular dependency. By @alessey #1255
- **feat**: enhanced Framegear Home component with layout, loading state, and placeholder improvements. By @adarshswaminath #1241

Breaking Changes

Removed `walletCapabilities` from the `OnchainKitConfig` and improved the internal types by using the native Viem wallet capabilities type. This update ensures that wallet capabilities are now used solely as read info, avoiding accidental changes to wallet capabilities.

The `<TransactionButton>` will no longer have a preset margin, allowing you to customize your app's spacing. Please check your app to see if you need to add a 4px margin. We aim to provide more neutral spacing, giving you the flexibility to add margin as needed.

The `LifeCycleStatus` type is now renamed `LifecycleStatus`. This update aligns with React's lifecycle naming best practices, ensuring a smoother experience with your app. Please take note of this improvement.