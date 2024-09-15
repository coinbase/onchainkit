---
'@coinbase/onchainkit': minor
---

- **fix**: removed `mt-4` from `<TransactionButton>`, ensuring the primary component maintains a clean and consistent design without outer margin. By @zizzamia #1258
- **fix**: renamed LifeCycle to Lifecycle. By @zizzamia #1257
- **fix**: `SwapSlippageInput` was visually resetting to default value on error. By @cpcramer #1250
- **fix**: removed context states and use `lifecyclestatus` as the source of truth, also persisted all lifecycle status data (except errors). By @alessey #1249
- **fix**: extracting `SwapMessage` to constants to avoid circular dependency. By @alessey #1255
- **feat**: enhanced Framegear Home component with layout, loading state, and placeholder improvements. By @adarshswaminath #1241

Breaking Changes
wip
