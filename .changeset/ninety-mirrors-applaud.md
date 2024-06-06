---
"@coinbase/onchainkit": minor
---

- **feat**: standardized `getAvatar()`. By @roushou #464
- **feat**: `TokenImage` with no image renders partial token symbol and deterministic dark color. By @kyhyco #468
- **feat**: converted `TokeSearch` to css and add modifier styles. By @kyhyco #460
- **docs**: added contribution guide. By @kyhyco #459

Breaking changes
- Changed the definition of `getAvatar(...)`, from `getAvatar(ensName: string)` to `getAvatar(params: { ensName: string })`.
- Changed `TokenImage` props from
```ts
export type TokenImageReact = {
  src: string | null;
  size?: number;
};
```
to
```ts
export type TokenImageReact = {
  token: Token;
  size?: number;
};
```

