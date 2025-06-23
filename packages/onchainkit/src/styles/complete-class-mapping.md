# Complete OnchainKit Class Migration Mapping

## Instructions
- Process replacements in the order listed (longest to shortest within each category)
- This avoids substring matching issues during find-and-replace
- Check the checkbox when completed for tracking progress

## Text Utilities
- [x] text-ock-text-foreground-muted → text-foreground-muted
- [x] text-ock-text-foreground → text-foreground
- [x] text-ock-text-disabled → text-foreground-disabled
- [x] text-ock-text-inverse → text-foreground-inverse
- [x] text-ock-text-primary → text-primary
- [x] text-ock-text-success → text-success
- [x] text-ock-text-warning → text-warning
- [x] text-ock-text-error → text-error
- [x] text-ock-line-default → text-border
- [x] text-ock-text-muted → text-foreground-muted

## Background Utilities (Ordered by Length)
- [x] bg-ock-bg-alternate-active → bg-background-alternate-active
- [x] bg-ock-bg-alternate-hover → bg-background-alternate-hover
- [x] bg-ock-bg-default-reverse → bg-background-reverse
- [x] bg-ock-bg-default-active → bg-background-active
- [x] bg-ock-bg-default-hover → bg-background-hover
- [x] bg-ock-bg-inverse-active → bg-background-inverse-active
- [x] bg-ock-bg-inverse-hover → bg-background-inverse-hover
- [x] bg-ock-bg-primary-disabled → bg-primary-disabled
- [x] bg-ock-bg-primary-active → bg-primary-active
- [x] bg-ock-bg-primary-washed → bg-primary-washed
- [x] bg-ock-bg-primary-hover → bg-primary-hover
- [x] bg-ock-bg-secondary-active → bg-secondary-active
- [x] bg-ock-bg-secondary-hover → bg-secondary-hover
- [x] bg-ock-bg-alternate → bg-background-alternate
- [x] bg-ock-bg-default → bg-background
- [x] bg-ock-bg-inverse → bg-background-inverse
- [x] bg-ock-bg-primary → bg-primary
- [x] bg-ock-bg-secondary → bg-secondary
- [x] bg-ock-bg-success → bg-success
- [x] bg-ock-bg-warning → bg-warning
- [x] bg-ock-bg-error → bg-error

## Border Utilities (Ordered by Length)
- [x] border-ock-bg-default-reverse → border-background-reverse
- [x] border-ock-bg-default-active → border-background-active
- [x] border-l-ock-bg-default → border-l-background
- [x] border-t-ock-bg-primary → border-t-primary
- [x] border-ock-bg-default → border-background
- [x] border-ock-line-default → border-border
- [x] border-ock-line-primary → border-primary
- [x] border-ock-line-inverse → border-border-inverse
- [x] border-ock-line-heavy → border-border-heavy

## Fill/SVG Utilities (Ordered by Length)
- [x] fill-ock-icon-color-foreground-muted → fill-foreground-muted
- [x] fill-ock-bg-default-reverse → fill-background-reverse
- [x] fill-ock-icon-color-foreground → fill-foreground
- [x] fill-ock-icon-color-inverse → fill-foreground-inverse
- [x] fill-ock-icon-color-primary → fill-primary
- [x] fill-ock-icon-color-success → fill-success
- [x] fill-ock-icon-color-warning → fill-warning
- [x] fill-ock-icon-color-error → fill-error
- [x] fill-ock-bg-alternate → fill-background-alternate
- [x] fill-ock-bg-primary → fill-primary
- [x] fill-ock-bg-error → fill-error
- [x] fill-ock-icon-primary → fill-primary

## Layout Utilities
- [x] rounded-ock-defaultpx-4 → rounded-default px-4  # Note: This appears to be a concatenation error
- [x] rounded-ock-default → rounded-default
- [x] rounded-ock-inner → rounded-inner
- [x] shadow-ock-default → shadow-default

## State Modifiers (Complex Patterns)
- [x] hover:bg-ock-bg-default-hover → hover:bg-background-hover
- [x] hover:bg-ock-bg-default-active → hover:bg-background-active
- [x] hover:bg-ock-bg-inverse → hover:bg-background-inverse
- [x] active:bg-ock-bg-default-active → active:bg-background-active
- [x] active:bg-ock-bg-default-hover → active:bg-background-hover
- [x] focus-visible:ring-ock-text-foreground → focus-visible:ring-foreground
- [x] data-[state=active]:bg-ock-bg-primary → data-[state=active]:bg-primary

## Complex Selectors (Advanced Patterns)
- [x] [&_path]:fill-ock-icon-color-foreground-muted → [&_path]:fill-foreground-muted
- [x] [&_path]:hover:fill-ock-icon-color-foreground → [&_path]:hover:fill-foreground
- [x] [&_path]:fill-ock-icon-color-foreground → [&_path]:fill-foreground

## CSS Classes and Utilities
- [ ] ock-bg-secondary-active → bg-secondary-active
- [ ] ock-text-foreground → text-foreground
- [ ] ock-border-line-default → border-border
- [ ] ock-bg-default → bg-background
- [ ] ock-text-muted → text-foreground-muted
- [ ] ock-bg-muted → bg-background-hover
- [ ] ock-scrollbar → scrollbar (this is a custom utility, may need special handling)
- [ ] placeholder-ock-default → placeholder-foreground-muted

## Font Utilities
- [ ] font-ock → font-ock  # Keep as-is (already updated in theme.ts)

## Radius Utilities (in @theme inline)
- [ ] radius-ock-default → radius-default
- [ ] radius-ock-inner → radius-inner

## CSS Variable References (in CSS files)
- [ ] --ock-radius-default → --radius-default
- [ ] --ock-radius-inner → --radius-inner
- [ ] --ock-font-family → --font-family
- [ ] --ock-text-foreground → --foreground
- [ ] --ock-text-foreground-muted → --foreground-muted
- [ ] --ock-text-inverse → --foreground-inverse
- [ ] --ock-text-disabled → --foreground-disabled
- [ ] --ock-bg-default → --background
- [ ] --ock-bg-default-hover → --background-hover
- [ ] --ock-bg-default-active → --background-active
- [ ] --ock-bg-alternate → --background-alternate
- [ ] --ock-bg-alternate-hover → --background-alternate-hover
- [ ] --ock-bg-alternate-active → --background-alternate-active
- [ ] --ock-bg-inverse → --background-inverse
- [ ] --ock-bg-inverse-hover → --background-inverse-hover
- [ ] --ock-bg-inverse-active → --background-inverse-active
- [ ] --ock-bg-default-reverse → --background-reverse
- [ ] --ock-bg-primary → --primary
- [ ] --ock-bg-primary-hover → --primary-hover
- [ ] --ock-bg-primary-active → --primary-active
- [ ] --ock-bg-primary-washed → --primary-washed
- [ ] --ock-bg-primary-disabled → --primary-disabled
- [ ] --ock-bg-secondary → --secondary
- [ ] --ock-bg-secondary-hover → --secondary-hover
- [ ] --ock-bg-secondary-active → --secondary-active
- [ ] --ock-bg-error → --error
- [ ] --ock-bg-warning → --warning
- [ ] --ock-bg-success → --success
- [ ] --ock-icon-color-foreground → --foreground
- [ ] --ock-icon-color-foreground-muted → --foreground-muted
- [ ] --ock-icon-color-inverse → --foreground-inverse
- [ ] --ock-icon-color-primary → --primary
- [ ] --ock-icon-color-error → --error
- [ ] --ock-icon-color-success → --success
- [ ] --ock-icon-color-warning → --warning
- [ ] --ock-line-default → --border
- [ ] --ock-line-heavy → --border-heavy
- [ ] --ock-line-inverse → --border-inverse
- [ ] --ock-line-primary → --primary
- [ ] --ock-shadow-default → --shadow-default

## CSS Variable Usage (var() functions)
- [ ] var(--ock-text-foreground-muted) → var(--foreground-muted)
- [ ] var(--ock-shadow-default) → var(--shadow-default)
- [ ] var(--ock-font-family) → var(--font-family)
- [ ] var(--ock-radius-default) → var(--radius-default)
- [ ] var(--ock-radius-inner) → var(--radius-inner)

## Special Cases Requiring Manual Review
- [ ] hover:border-[--ock-line-primary] → hover:border-[--primary]
- [ ] hover:border-[${'border-ock-bg-default-active'}] → hover:border-[${border-background-active}]
- [ ] .placeholder-ock-default::placeholder → .placeholder-foreground-muted::placeholder

## Notes
1. Some patterns like `rounded-ock-defaultpx-4` appear to be concatenation errors and should be split
2. The `ock-scrollbar` class is a custom utility and may need special handling
3. Template literal patterns with `${}` need careful manual review
4. Test files with class assertions need updating to match new class names
5. CSS custom properties in `--color-*` format in @theme inline are already updated

## Files Requiring Special Attention
- NFTAudio.tsx - Complex border combinations
- SwapSettingsSlippageInput.tsx - Multiple state modifiers  
- AppchainBridgeAddressInput.tsx - Mixed old/new patterns
- Test files - Class assertions need updating 