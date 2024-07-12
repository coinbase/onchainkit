---
"@coinbase/onchainkit": patch
---
- **feat**: Added `chain` option to `useName` function for L2 chain name resolution support. By @kirkas #781
- **feat**: Added `chain` option to `<Name>` component for L2 chain name resolution support. By @kirkas #781
- **fix**: Modified `getName` to return a rejected promise instead of an error. By @kirkas #781
- **fix**: Disabled `retry` in `getNewReactQueryTestProvider` to run tests faster and avoid timeouts. By @kirkas #781