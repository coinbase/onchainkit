# Onchainkit Playground

Sandbox environment to stage new releases of OnchainKit on different popular web frameworks.

We plan to test on 3 frameworks:

1. NextJS (app router)
2. NextJS (pages router)
3. Vite

**For now, only #1 is fully functional.**

## Getting Started

Navigate to NextJS (app router) demo app

```bash
cd nextjs-app-router
```

Intall dependencies and run app

```bash
bun install && bun run dev
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
