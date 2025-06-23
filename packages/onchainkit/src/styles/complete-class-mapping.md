# Complete OnchainKit Class Migration Mapping

## Instructions
- Process replacements in the order listed (longest to shortest within each category)
- This avoids substring matching issues during find-and-replace
- Check the checkbox when completed for tracking progress

## Summary
**OLD PATTERN**: Classes used clean semantic names (e.g., `text-foreground`, `bg-primary`)  
**NEW PATTERN**: Classes now use ock-prefixed names (e.g., `text-ock-foreground`, `bg-ock-primary`)

## Text Utilities
- [x] text-foreground-muted → text-ock-foreground-muted
- [x] text-foreground-inverse → text-ock-foreground-inverse
- [x] text-foreground-disabled → text-ock-foreground-disabled
- [x] text-foreground → text-ock-foreground
- [x] text-primary → text-ock-primary
- [x] text-success → text-ock-success
- [x] text-warning → text-ock-warning
- [x] text-error → text-ock-error

## Background Utilities
- [x] bg-background-alternate-active → bg-ock-background-alternate-active
- [x] bg-background-alternate-hover → bg-ock-background-alternate-hover
- [x] bg-background-inverse-active → bg-ock-background-inverse-active
- [x] bg-background-inverse-hover → bg-ock-background-inverse-hover
- [x] bg-background-alternate → bg-ock-background-alternate
- [x] bg-background-reverse → bg-ock-background-reverse
- [x] bg-background-inverse → bg-ock-background-inverse
- [x] bg-background-active → bg-ock-background-active
- [x] bg-background-hover → bg-ock-background-hover
- [x] bg-background → bg-ock-background
- [x] bg-primary-disabled → bg-ock-primary-disabled
- [x] bg-primary-washed → bg-ock-primary-washed
- [x] bg-primary-active → bg-ock-primary-active
- [x] bg-primary-hover → bg-ock-primary-hover
- [x] bg-primary → bg-ock-primary
- [x] bg-secondary-active → bg-ock-secondary-active
- [x] bg-secondary-hover → bg-ock-secondary-hover
- [x] bg-secondary → bg-ock-secondary
- [x] bg-success-background → bg-ock-success-background
- [x] bg-success → bg-ock-success
- [x] bg-warning → bg-ock-warning
- [x] bg-error → bg-ock-error

## Border Utilities
- [x] border-background-alternate-active → border-ock-background-alternate-active
- [x] border-background-alternate-hover → border-ock-background-alternate-hover
- [x] border-background-alternate → border-ock-background-alternate
- [x] border-background-inverse-active → border-ock-background-inverse-active
- [x] border-background-inverse-hover → border-ock-background-inverse-hover
- [x] border-background-inverse → border-ock-background-inverse
- [x] border-background-reverse → border-ock-background-reverse
- [x] border-background-active → border-ock-background-active
- [x] border-background-hover → border-ock-background-hover
- [x] border-background → border-ock-background
- [x] border-foreground-muted → border-ock-foreground-muted
- [x] border-foreground-inverse → border-ock-foreground-inverse
- [x] border-foreground-disabled → border-ock-foreground-disabled
- [x] border-foreground → border-ock-foreground
- [x] border-primary-disabled → border-ock-primary-disabled
- [x] border-primary-washed → border-ock-primary-washed
- [x] border-primary-active → border-ock-primary-active
- [x] border-primary-hover → border-ock-primary-hover
- [x] border-primary → border-ock-primary
- [x] border-secondary-active → border-ock-secondary-active
- [x] border-secondary-hover → border-ock-secondary-hover
- [x] border-secondary → border-ock-secondary
- [x] border-success-background → border-ock-success-background
- [x] border-success → border-ock-success
- [x] border-warning → border-ock-warning
- [x] border-error → border-ock-error
- [x] border-border → border-ock-line
- [x] border-l-background-alternate-active → border-l-ock-background-alternate-active
- [x] border-l-background-alternate-hover → border-l-ock-background-alternate-hover
- [x] border-l-background-alternate → border-l-ock-background-alternate
- [x] border-l-background-inverse-active → border-l-ock-background-inverse-active
- [x] border-l-background-inverse-hover → border-l-ock-background-inverse-hover
- [x] border-l-background-inverse → border-l-ock-background-inverse
- [x] border-l-background-reverse → border-l-ock-background-reverse
- [x] border-l-background-active → border-l-ock-background-active
- [x] border-l-background-hover → border-l-ock-background-hover
- [x] border-l-background → border-l-ock-background
- [x] border-l-foreground-muted → border-l-ock-foreground-muted
- [x] border-l-foreground-inverse → border-l-ock-foreground-inverse
- [x] border-l-foreground-disabled → border-l-ock-foreground-disabled
- [x] border-l-foreground → border-l-ock-foreground
- [x] border-l-primary-disabled → border-l-ock-primary-disabled
- [x] border-l-primary-washed → border-l-ock-primary-washed
- [x] border-l-primary-active → border-l-ock-primary-active
- [x] border-l-primary-hover → border-l-ock-primary-hover
- [x] border-l-primary → border-l-ock-primary
- [x] border-l-secondary-active → border-l-ock-secondary-active
- [x] border-l-secondary-hover → border-l-ock-secondary-hover
- [x] border-l-secondary → border-l-ock-secondary
- [x] border-l-success-background → border-l-ock-success-background
- [x] border-l-success → border-l-ock-success
- [x] border-l-warning → border-l-ock-warning
- [x] border-l-error → border-l-ock-error
- [x] border-l-border → border-l-ock-line
- [x] border-r-background-alternate-active → border-r-ock-background-alternate-active
- [x] border-r-background-alternate-hover → border-r-ock-background-alternate-hover
- [x] border-r-background-alternate → border-r-ock-background-alternate
- [x] border-r-background-inverse-active → border-r-ock-background-inverse-active
- [x] border-r-background-inverse-hover → border-r-ock-background-inverse-hover
- [x] border-r-background-inverse → border-r-ock-background-inverse
- [x] border-r-background-reverse → border-r-ock-background-reverse
- [x] border-r-background-active → border-r-ock-background-active
- [x] border-r-background-hover → border-r-ock-background-hover
- [x] border-r-background → border-r-ock-background
- [x] border-r-foreground-muted → border-r-ock-foreground-muted
- [x] border-r-foreground-inverse → border-r-ock-foreground-inverse
- [x] border-r-foreground-disabled → border-r-ock-foreground-disabled
- [x] border-r-foreground → border-r-ock-foreground
- [x] border-r-primary-disabled → border-r-ock-primary-disabled
- [x] border-r-primary-washed → border-r-ock-primary-washed
- [x] border-r-primary-active → border-r-ock-primary-active
- [x] border-r-primary-hover → border-r-ock-primary-hover
- [x] border-r-primary → border-r-ock-primary
- [x] border-r-secondary-active → border-r-ock-secondary-active
- [x] border-r-secondary-hover → border-r-ock-secondary-hover
- [x] border-r-secondary → border-r-ock-secondary
- [x] border-r-success-background → border-r-ock-success-background
- [x] border-r-success → border-r-ock-success
- [x] border-r-warning → border-r-ock-warning
- [x] border-r-error → border-r-ock-error
- [x] border-r-border → border-r-ock-line
- [x] border-t-background-alternate-active → border-t-ock-background-alternate-active
- [x] border-t-background-alternate-hover → border-t-ock-background-alternate-hover
- [x] border-t-background-alternate → border-t-ock-background-alternate
- [x] border-t-background-inverse-active → border-t-ock-background-inverse-active
- [x] border-t-background-inverse-hover → border-t-ock-background-inverse-hover
- [x] border-t-background-inverse → border-t-ock-background-inverse
- [x] border-t-background-reverse → border-t-ock-background-reverse
- [x] border-t-background-active → border-t-ock-background-active
- [x] border-t-background-hover → border-t-ock-background-hover
- [x] border-t-background → border-t-ock-background
- [x] border-t-foreground-muted → border-t-ock-foreground-muted
- [x] border-t-foreground-inverse → border-t-ock-foreground-inverse
- [x] border-t-foreground-disabled → border-t-ock-foreground-disabled
- [x] border-t-foreground → border-t-ock-foreground
- [x] border-t-primary-disabled → border-t-ock-primary-disabled
- [x] border-t-primary-washed → border-t-ock-primary-washed
- [x] border-t-primary-active → border-t-ock-primary-active
- [x] border-t-primary-hover → border-t-ock-primary-hover
- [x] border-t-primary → border-t-ock-primary
- [x] border-t-secondary-active → border-t-ock-secondary-active
- [x] border-t-secondary-hover → border-t-ock-secondary-hover
- [x] border-t-secondary → border-t-ock-secondary
- [x] border-t-success-background → border-t-ock-success-background
- [x] border-t-success → border-t-ock-success
- [x] border-t-warning → border-t-ock-warning
- [x] border-t-error → border-t-ock-error
- [x] border-t-border → border-t-ock-line
- [x] border-b-background-alternate-active → border-b-ock-background-alternate-active
- [x] border-b-background-alternate-hover → border-b-ock-background-alternate-hover
- [x] border-b-background-alternate → border-b-ock-background-alternate
- [x] border-b-background-inverse-active → border-b-ock-background-inverse-active
- [x] border-b-background-inverse-hover → border-b-ock-background-inverse-hover
- [x] border-b-background-inverse → border-b-ock-background-inverse
- [x] border-b-background-reverse → border-b-ock-background-reverse
- [x] border-b-background-active → border-b-ock-background-active
- [x] border-b-background-hover → border-b-ock-background-hover
- [x] border-b-background → border-b-ock-background
- [x] border-b-foreground-muted → border-b-ock-foreground-muted
- [x] border-b-foreground-inverse → border-b-ock-foreground-inverse
- [x] border-b-foreground-disabled → border-b-ock-foreground-disabled
- [x] border-b-foreground → border-b-ock-foreground
- [x] border-b-primary-disabled → border-b-ock-primary-disabled
- [x] border-b-primary-washed → border-b-ock-primary-washed
- [x] border-b-primary-active → border-b-ock-primary-active
- [x] border-b-primary-hover → border-b-ock-primary-hover
- [x] border-b-primary → border-b-ock-primary
- [x] border-b-secondary-active → border-b-ock-secondary-active
- [x] border-b-secondary-hover → border-b-ock-secondary-hover
- [x] border-b-secondary → border-b-ock-secondary
- [x] border-b-success-background → border-b-ock-success-background
- [x] border-b-success → border-b-ock-success
- [x] border-b-warning → border-b-ock-warning
- [x] border-b-error → border-b-ock-error
- [x] border-b-border → border-b-ock-line

## Fill/SVG Utilities
- [x] fill-foreground-muted → fill-ock-foreground-muted
- [x] fill-foreground-inverse → fill-ock-foreground-inverse
- [x] fill-foreground-disabled → fill-ock-foreground-disabled
- [x] fill-foreground → fill-ock-foreground
- [x] fill-primary → fill-ock-primary
- [x] fill-success → fill-ock-success
- [x] fill-warning → fill-ock-warning
- [x] fill-error → fill-ock-error
- [x] stroke-foreground-muted → stroke-ock-foreground-muted
- [x] stroke-foreground-inverse → stroke-ock-foreground-inverse
- [x] stroke-foreground-disabled → stroke-ock-foreground-disabled
- [x] stroke-foreground → stroke-ock-foreground
- [x] stroke-primary → stroke-ock-primary
- [x] stroke-success → stroke-ock-success
- [x] stroke-warning → stroke-ock-warning
- [x] stroke-error → stroke-ock-error

## Layout Utilities (CORRECTED - THESE WERE WRONG)
- [x] rounded-default → rounded-ock-default ⚠️ **MAJOR MISSING CLASSES** 
- [x] rounded-inner → rounded-ock-inner ⚠️ **MAJOR MISSING CLASSES**
- [x] shadow-default → shadow-ock-default ⚠️ **MAJOR MISSING CLASSES**

## State Modifiers (Hover/Active/Focus)
- [x] hover:bg-background-alternate-active → hover:bg-ock-background-alternate-active
- [x] hover:bg-background-alternate-hover → hover:bg-ock-background-alternate-hover
- [x] hover:bg-background-inverse-active → hover:bg-ock-background-inverse-active
- [x] hover:bg-background-inverse-hover → hover:bg-ock-background-inverse-hover
- [x] hover:bg-background-alternate → hover:bg-ock-background-alternate
- [x] hover:bg-background-reverse → hover:bg-ock-background-reverse
- [x] hover:bg-background-inverse → hover:bg-ock-background-inverse
- [x] hover:bg-background-active → hover:bg-ock-background-active
- [x] hover:bg-background-hover → hover:bg-ock-background-hover
- [x] hover:bg-background → hover:bg-ock-background
- [x] hover:bg-primary-disabled → hover:bg-ock-primary-disabled
- [x] hover:bg-primary-washed → hover:bg-ock-primary-washed
- [x] hover:bg-primary-active → hover:bg-ock-primary-active
- [x] hover:bg-primary-hover → hover:bg-ock-primary-hover
- [x] hover:bg-primary → hover:bg-ock-primary
- [x] hover:text-foreground-muted → hover:text-ock-foreground-muted
- [x] hover:text-foreground-inverse → hover:text-ock-foreground-inverse
- [x] hover:text-foreground-disabled → hover:text-ock-foreground-disabled
- [x] hover:text-foreground → hover:text-ock-foreground
- [x] hover:text-primary → hover:text-ock-primary
- [x] active:bg-background-alternate-active → active:bg-ock-background-alternate-active
- [x] active:bg-background-alternate-hover → active:bg-ock-background-alternate-hover
- [x] active:bg-background-inverse-active → active:bg-ock-background-inverse-active
- [x] active:bg-background-inverse-hover → active:bg-ock-background-inverse-hover
- [x] active:bg-background-alternate → active:bg-ock-background-alternate
- [x] active:bg-background-reverse → active:bg-ock-background-reverse
- [x] active:bg-background-inverse → active:bg-ock-background-inverse
- [x] active:bg-background-active → active:bg-ock-background-active
- [x] active:bg-background-hover → active:bg-ock-background-hover
- [x] active:bg-background → active:bg-ock-background
- [x] active:bg-primary-disabled → active:bg-ock-primary-disabled
- [x] active:bg-primary-washed → active:bg-ock-primary-washed
- [x] active:bg-primary-active → active:bg-ock-primary-active
- [x] active:bg-primary-hover → active:bg-ock-primary-hover
- [x] active:bg-primary → active:bg-ock-primary
- [x] focus:bg-background-alternate-active → focus:bg-ock-background-alternate-active
- [x] focus:bg-background-alternate-hover → focus:bg-ock-background-alternate-hover
- [x] focus:bg-background-inverse-active → focus:bg-ock-background-inverse-active
- [x] focus:bg-background-inverse-hover → focus:bg-ock-background-inverse-hover
- [x] focus:bg-background-alternate → focus:bg-ock-background-alternate
- [x] focus:bg-background-reverse → focus:bg-ock-background-reverse
- [x] focus:bg-background-inverse → focus:bg-ock-background-inverse
- [x] focus:bg-background-active → focus:bg-ock-background-active
- [x] focus:bg-background-hover → focus:bg-ock-background-hover
- [x] focus:bg-background → focus:bg-ock-background
- [x] focus:bg-primary-disabled → focus:bg-ock-primary-disabled
- [x] focus:bg-primary-washed → focus:bg-ock-primary-washed
- [x] focus:bg-primary-active → focus:bg-ock-primary-active
- [x] focus:bg-primary-hover → focus:bg-ock-primary-hover
- [x] focus:bg-primary → focus:bg-ock-primary

## Complex Selectors
- [x] [&_path]:fill-foreground-muted → [&_path]:fill-ock-foreground-muted
- [x] [&_path]:fill-foreground-inverse → [&_path]:fill-ock-foreground-inverse
- [x] [&_path]:fill-foreground-disabled → [&_path]:fill-ock-foreground-disabled
- [x] [&_path]:fill-foreground → [&_path]:fill-ock-foreground
- [x] [&_path]:fill-primary → [&_path]:fill-ock-primary
- [x] data-[state=active]:bg-background-alternate-active → data-[state=active]:bg-ock-background-alternate-active
- [x] data-[state=active]:bg-background-alternate-hover → data-[state=active]:bg-ock-background-alternate-hover
- [x] data-[state=active]:bg-background-inverse-active → data-[state=active]:bg-ock-background-inverse-active
- [x] data-[state=active]:bg-background-inverse-hover → data-[state=active]:bg-ock-background-inverse-hover
- [x] data-[state=active]:bg-background-alternate → data-[state=active]:bg-ock-background-alternate
- [x] data-[state=active]:bg-background-reverse → data-[state=active]:bg-ock-background-reverse
- [x] data-[state=active]:bg-background-inverse → data-[state=active]:bg-ock-background-inverse
- [x] data-[state=active]:bg-background-active → data-[state=active]:bg-ock-background-active
- [x] data-[state=active]:bg-background-hover → data-[state=active]:bg-ock-background-hover
- [x] data-[state=active]:bg-background → data-[state=active]:bg-ock-background
- [x] data-[state=active]:bg-primary-disabled → data-[state=active]:bg-ock-primary-disabled
- [x] data-[state=active]:bg-primary-washed → data-[state=active]:bg-ock-primary-washed
- [x] data-[state=active]:bg-primary-active → data-[state=active]:bg-ock-primary-active
- [x] data-[state=active]:bg-primary-hover → data-[state=active]:bg-ock-primary-hover
- [x] data-[state=active]:bg-primary → data-[state=active]:bg-ock-primary

## Special Cases & Notes
- [x] `.ock-scrollbar` - Keep as-is (intentionally prefixed)

## Files That May Need Special Attention
- [x] `packages/onchainkit/src/styles/theme.ts` - Already updated
- [x] `packages/onchainkit/src/styles/tailwind-base.css` - Already updated

## Total Count
**Estimated classes to update**: ~500+ class references across the entire codebase 

**Critical Missing Classes Found:**
- ✅ `border-background` (found in 13+ files) → `border-ock-background`  
- ✅ `border-background-active` (found in 8+ files) → `border-ock-background-active`
- ✅ `ring-foreground` (found in Earn.tsx) → `ring-ock-foreground`
- ✅ All border directional variants (border-l-, border-r-, border-t-, border-b-)
- ✅ All ring color utilities
- ✅ All border color variants (foreground, primary, secondary, error, warning, success)

**Note**: The original estimate was significantly understated. The comprehensive analysis revealed extensive usage of border utilities with color tokens throughout the codebase. 

## Ring Utilities
- [x] ring-background-alternate-active → ring-ock-background-alternate-active
- [x] ring-background-alternate-hover → ring-ock-background-alternate-hover
- [x] ring-background-alternate → ring-ock-background-alternate
- [x] ring-background-inverse-active → ring-ock-background-inverse-active
- [x] ring-background-inverse-hover → ring-ock-background-inverse-hover
- [x] ring-background-inverse → ring-ock-background-inverse
- [x] ring-background-reverse → ring-ock-background-reverse
- [x] ring-background-active → ring-ock-background-active
- [x] ring-background-hover → ring-ock-background-hover
- [x] ring-background → ring-ock-background
- [x] ring-foreground-muted → ring-ock-foreground-muted
- [x] ring-foreground-inverse → ring-ock-foreground-inverse
- [x] ring-foreground-disabled → ring-ock-foreground-disabled
- [x] ring-foreground → ring-ock-foreground
- [x] ring-primary-disabled → ring-ock-primary-disabled
- [x] ring-primary-washed → ring-ock-primary-washed
- [x] ring-primary-active → ring-ock-primary-active
- [x] ring-primary-hover → ring-ock-primary-hover
- [x] ring-primary → ring-ock-primary
- [x] ring-secondary-active → ring-ock-secondary-active
- [x] ring-secondary-hover → ring-ock-secondary-hover
- [x] ring-secondary → ring-ock-secondary
- [x] ring-success-background → ring-ock-success-background
- [x] ring-success → ring-ock-success
- [x] ring-warning → ring-ock-warning
- [x] ring-error → ring-ock-error
- [x] ring-border → ring-ock-line

## 🚨 CRITICAL ADDITIONAL MISSING CLASSES DISCOVERED (Nov 2024)

### Based on Tailwind CSS Theme Documentation Analysis

From the [Tailwind CSS Theme documentation](https://tailwindcss.com/docs/theme), theme variables affect many more utility classes beyond just colors. We missed several critical categories:

### Border Radius Utilities - **MAJOR GAP FOUND**
**Status**: ❌ **INCOMPLETE - 80+ instances found**
- [x] rounded-default → rounded-ock-default (found in ~80+ files)
- [x] rounded-inner → rounded-ock-inner (found in ~8 files)
- [x] Any directional rounded classes if they exist (rounded-t-default, etc.)

### Shadow Utilities - **MAJOR GAP FOUND** 
**Status**: ❌ **INCOMPLETE - 10+ instances found**
- [x] shadow-default → shadow-ock-default (found in ~10 files)

### SVG Fill Background Classes - **CRITICAL BUG FOUND**
**Status**: ❌ **INCOMPLETE - 3 instances found**
- [x] fill-background-alternate → fill-ock-background-alternate (found in defaultNFTSvg.tsx)
- [x] fill-background-reverse → fill-ock-background-reverse (found in defaultNFTSvg.tsx)

### Font Family Utilities - **ALREADY COMPLETE**
**Status**: ✅ **COMPLETE** 
- [x] font-ock → font-ock (already correctly implemented - this is the target, not a migration)

### Summary of Critical Issues Found:
1. **~80+ instances** of `rounded-default` need to be `rounded-ock-default`
2. **~8 instances** of `rounded-inner` need to be `rounded-ock-inner`  
3. **~10 instances** of `shadow-default` need to be `shadow-ock-default`
4. **3 instances** of `fill-background-*` need to be `fill-ock-background-*`

### Total Additional Classes to Fix: ~100+ instances

**REVISED MIGRATION STATUS**: ~85% Complete (not 99% as previously reported)

### Files Most Affected:
- AppchainBridge components (multiple rounded-default)
- Swap components (multiple rounded-default, shadow-default)  
- Wallet components (multiple rounded-default)
- Fund components (multiple rounded-default)
- NFT components (multiple rounded-default)
- Buy components (multiple rounded-default)
- Internal SVG components (fill-background-*)

### Theme Variables That Drive These Classes:
Based on `tailwind-base.css`:
- `--ock-radius-default` → `rounded-ock-default` 
- `--ock-radius-inner` → `rounded-ock-inner`
- `--ock-shadow-default` → `shadow-ock-default`
- `--ock-font-family` → `font-ock` (already correct)

### Priority Order for Fixes:
1. **HIGH**: `rounded-default` → `rounded-ock-default` (80+ instances)
2. **MEDIUM**: `shadow-default` → `shadow-ock-default` (10+ instances)  
3. **MEDIUM**: `rounded-inner` → `rounded-ock-inner` (8 instances)
4. **HIGH**: `fill-background-*` → `fill-ock-background-*` (3 instances, critical bugs) 