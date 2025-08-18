# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Plan & Review

### Before starting work
- Write a plan to .claude/tasks/TASK_NAME.md
- The plan should be a detailed implementation plan and the reasoning behind the plan, the tasks to implement the plan, and a briefdescription of each task
- Don't over plan, keep things simple and focused
- After you write the plan, ask me to review it. Do not continue until I approve the plan
- If it's clear that the task is too trivial to require a plan, you may skip the step of creating the written TASK_NAME.md. You should still start by explaining the plan of attack, and asking for approval before starting

### While implementing
- Update the plan as you go
- After you complete a task, mark it as done, and add a brief description of the changes you made

## Development Commands

### Building and Development
- `pnpm install` - Install dependencies across all packages
- `pnpm build` - Build all packages
- `pnpm f:ock build` - Build OnchainKit package only  
- `pnpm f:play dev:watch` - Start playground in watch mode with OnchainKit rebuilding automatically
- `pnpm f:play dev` - Start playground development server only

### Testing and Quality
- `pnpm f:ock test` - Run tests for OnchainKit package
- `pnpm f:ock test:watch` - Run tests in watch mode
- `pnpm f:ock test:coverage` - Run tests with coverage
- `pnpm f:ock lint` - Run ESLint on OnchainKit package
- `pnpm f:ock typecheck` - Run TypeScript type checking

### Package Filters
The monorepo uses pnpm workspaces with these shortcuts:
- `pnpm f:ock` - `@coinbase/onchainkit` package
- `pnpm f:play` - `playground` package  
- `pnpm f:create` - `create-onchain` package
- `pnpm f:manifest` - `miniapp-manifest-generator` package

## Architecture Overview

This is a monorepo containing multiple packages organized as pnpm workspaces:

### Core Package (`packages/onchainkit/`)
The main OnchainKit React component library with modular exports:
- `/api` - API utilities for blockchain operations
- `/buy` - Buy/funding components and hooks
- `/checkout` - E-commerce checkout components  
- `/earn` - Yield/staking components (Morpho integration)
- `/fund` - Onramp funding components
- `/identity` - ENS/Basename identity components
- `/minikit` - Farcaster MiniKit integration
- `/swap` - Token swap components
- `/transaction` - Transaction components and utilities
- `/wallet` - Wallet connection components

### Supporting Packages
- `packages/playground/` - Next.js demo app for testing components
- `packages/create-onchain/` - CLI tool for bootstrapping apps (`npm create onchain`)
- `packages/miniapp-manifest-generator/` - Tool for generating Farcaster MiniApp manifests

### Templates and Examples
- `templates/` - Starter templates for different use cases
- `examples/` - Example implementations

## Key Development Patterns

### Component Structure
Components follow a consistent pattern with:
- Main component file (e.g., `Swap.tsx`)
- Provider component for context (e.g., `SwapProvider.tsx`) 
- Hook files in `/hooks` subdirectory
- Utility functions in `/utils` subdirectory
- Type definitions in `types.ts`

### Testing Strategy
- Comprehensive test coverage with Vitest
- Component tests using React Testing Library
- Mock data in `/mocks` directories where needed

### Build System
- Vite for building the main package
- Module exports for tree-shaking optimization
- TypeScript with strict configuration
- PostCSS with Tailwind CSS preprocessing

### Styling
- Tailwind CSS with custom theme configuration
- CSS-in-JS for component-specific styles
- Responsive design patterns throughout

## Development Workflow

1. Use `pnpm f:play dev:watch` for component development - this runs the playground with OnchainKit rebuilding automatically
2. View changes at http://localhost:3000
3. Run tests with `pnpm f:ock test` before committing
4. Use `pnpm f:ock lint` and `pnpm f:ock typecheck` to ensure code quality

## Package Management
- Uses pnpm v10 with workspaces
- Node.js v20 required
- Peer dependencies: React 19, Viem 2.27+, Wagmi 2.16+
