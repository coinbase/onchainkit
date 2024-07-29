# Onchainkit Demo

Sandbox environment to stage new releases of OnchainKit on different popular web frameworks.

We plan to test on 3 frameworks:

1. NextJS (app router)
2. NextJS (pages router)
3. Vite

**For now, only #1 is fully functional.**

## Getting Started

Navigate to NextJS (app router) demo app

```bash
cd packages/nextjs-app
```

(Optional) Update location of your `"pnpm"."overrides"."@coinbase/onchainkit"` if necessary in `package.json`.
If you place the `onchainkit` repo right next to this one, you can skip this step and use the default.

Intall dependencies and run app (must use `pnpm` for local overrides)

```bash
pnpm install && pnpm run dev
```

## Local development

Whenever you make a change to your local version of OnchainKit, we need to rebuild the package.

Rebuild within a separate terminal tab on the `onchainkit` repo.

```bash
yarn build
```

In a separate terminal tab within `onchainkit-demo/packages/nextjs-app`, cancel your running app and reload.

```bash
pnpm run reload
```
