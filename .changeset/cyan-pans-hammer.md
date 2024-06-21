---
"@coinbase/onchainkit": minor
---

- **feat**: refactor Identity components and add Address component. By @kyhyco #641

Breaking Changes

- `showAddress` has been removed from `Name` component.
- `showAttestion` has been removed from `Name` and `Avatar` components. Add `Badge` in `Name` or `Avatar` children to render attestations.

Features

- `Address` component handles rendering account address.
- `Address` component can be passed into `Identity` component
- Similar to `Name` component, `address` prop can be assigned to `Address` or `Identity` component
