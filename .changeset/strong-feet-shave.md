---
'@coinbase/onchainkit': minor
---

- **feat**: Added `Theming` support. By @cpcramer #1354
- **docs**: Added `Pay` component docs. By @0xAlec #1400

Breaking Changes

Added a new config parameter to the `OnchainKitProvider`. The config object includes an appearance property with optional `mode` and `theme` parameters, allowing you to customize the appearance of your components.
Updated CSS variables to use the `ock` prefix (e.g., `--ock-bg-default`). We’ve also introduced many new variables to enhance theming customization.
For detailed information and theming instructions, refer to the `Theming Guide` in the documentation.