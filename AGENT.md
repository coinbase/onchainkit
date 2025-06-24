# OnchainKit Agent Guide

## Commands

- `pnpm f:ock test` - Run all tests in onchainkit package
- `pnpm f:ock test:coverage` - Run tests and generate coverage report
- `pnpm f:ock test filename` - Run single test file (e.g., `pnpm f:ock test swap`)
- `pnpm f:ock build` - Build the onchainkit package
- `pnpm f:ock lint` - Lint with ESLint
- `pnpm f:ock format` - Format with Prettier
- `pnpm build` - Build all packages in monorepo

## Architecture  

- Monorepo with packages: `onchainkit/` (main), `playground/`, `create-onchain/`, `miniapp-manifest-generator/`
- OnchainKit organized by feature modules: `wallet/`, `swap/`, `nft/`, `identity/`, `transaction/`, etc.
- Each module has components, hooks, utilities, types, and tests co-located
- `internal/` contains shared utilities, SVGs, and internal types
- `styles/` contains Tailwind theme and CSS variables

## Code Style

- TypeScript with strict mode, React 19, Vite build
- ESLint + Prettier: 2 spaces, single quotes, trailing commas
- Types: Props end with `Props`, contexts with `ContextType`, responses with `Response`
- Export types through module index files with `export type { ... }`
- CSS variables follow `--ock-*` naming for theming
- Test files use Vitest with `.test.tsx` suffix
- DEPRECATED: JSDoc comments on public types with `@Note: exported as public Type`
  - The current pattern is to refer to the module index file to understand what's exported publically
