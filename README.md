# OnchainKit Monorepo

## Overview

This monorepo contains the source code for the OnchainKit project.

## Requirements

- Node.js v18
- pnpm v10

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/coinbase/onchainkit.git
```

2. Install dependencies

```bash
pnpm install
```

## Running packages

To run a script in a single package, use the following command:

```bash
pnpm [-F | --filter] <package-name> <script-name>
```

To run a script in all packages, use the following command:

```bash
pnpm run <script-name>
```

### Shorthands

We provide shorthands to filter by project in the root `package.json`.

The following shorthands are available:

- `pnpm f:ock`: `pnpm --filter @coinbase/onchainkit`
- `pnpm f:play`: `pnpm --filter playground`
- `pnpm f:create`: `pnpm --filter create-onchain`

If you create a new project, feel free to add a shorthand to the root `package.json`.
