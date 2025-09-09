# OnchainKit Templates

This directory contains starter templates for different frameworks and use cases. These templates are used by the `create-onchain` CLI tool to bootstrap new projects.

## Adding a New Template

When adding a new template, follow these steps to ensure it's properly integrated:

### 1. Template Structure

Templates should follow this structure:
```
templates/
└── your-template-name/
    ├── package.json          # Project dependencies and scripts
    ├── README.md            # Usage instructions for the template
    ├── .gitignore           # Files to ignore (gets renamed to _gitignore in CLI)
    ├── .template.env        # Environment variable template (optional)
    └── src/                 # Source code files
```

### 2. Package.json Requirements

Your template's `package.json` must:
- Use `"workspace:*"` for `@coinbase/onchainkit` dependency (gets replaced with `"latest"` during CLI packaging)
- Include required OnchainKit peer dependencies: `@tanstack/react-query`, `viem`, `wagmi`
- Include appropriate dev/build scripts for your framework
- Follow naming convention: descriptive name like `onchainkit-{framework}`

Example:
```json
{
  "name": "onchainkit-vite-react",
  "dependencies": {
    "@coinbase/onchainkit": "workspace:*",
    "@tanstack/react-query": "^5.81.5",
    "react": "^19.1.1",
    "react-dom": "^19.1.1", 
    "viem": "^2.31.6",
    "wagmi": "^2.16.3"
  }
}
```

### 3. CLI Integration

All templates in this directory are automatically included in the CLI build process. The copy script:

1. **Discovers all templates**: Any directory in `/templates` is automatically detected
2. **Processes files**: Handles `.gitignore` renaming and `package.json` dependency replacement
3. **Respects .gitignore rules**: Files matching patterns in the template's `.gitignore` are excluded

### 4. File Processing Rules

The copy script handles these files specially:

- **`.gitignore`**: Renamed to `_gitignore` (npm/CLI compatibility requirement)
- **`package.json`**: `workspace:*` dependencies automatically replaced with `"latest"`
- **`.template.env`**: Always preserved, never ignored (even if matches .gitignore patterns)
- **Other files**: Copied if not excluded by `.gitignore` rules

### 5. Analytics Integration

For new templates to be tracked in usage analytics:

1. **Update analytics types** in `packages/create-onchain/src/analytics.ts`:
   ```typescript
   template: 'onchainkit-nextjs' | 'minikit-nextjs' | 'your-new-template';
   ```

### 6. Testing Your Template

1. **Build the create-onchain package**:
   ```bash
   cd packages/create-onchain
   pnpm build
   ```

2. **Test locally**:
   ```bash
   pnpm create onchain test-project
   # Select your new template from the list
   ```

3. **Verify the generated project**:
   - Check `package.json` has correct dependencies (`latest` instead of `workspace:*`)
   - Ensure all source files copied correctly
   - Verify `.gitignore` was renamed to `_gitignore`
   - Test that `npm install` and dev scripts work

### 7. Template Documentation

Ensure your template includes:
- Clear `README.md` with getting started instructions
- Comments in key files explaining framework-specific patterns
- Environment variable documentation if using `.template.env`
- Build and development command documentation

## Current Templates

- **`onchainkit-nextjs`**: Full-featured Next.js app with OnchainKit
- **`minikit-nextjs`**: Next.js app with Farcaster MiniKit integration  
- **`onchainkit-vite-react`**: Minimal Vite + React setup with OnchainKit

## Build Process

Templates are processed during the CLI build via `packages/create-onchain/scripts/copy-templates.js`:

1. **Discovery**: Finds all directories in `/templates`
2. **File filtering**: Respects each template's `.gitignore` rules  
3. **Processing**: Handles special files (package.json, .gitignore, .template.env)
4. **Output**: Copies processed templates to `/packages/create-onchain/templates`

The processed templates are then packaged with the CLI for distribution via npm.