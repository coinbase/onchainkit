import { ClassValue } from 'clsx';

declare function cn(...inputs: ClassValue[]): string;
declare const text: {
    readonly body: "ock-font-family font-normal leading-normal";
    readonly caption: "ock-font-family font-semibold text-xs leading-4";
    readonly headline: "ock-font-family font-semibold leading-normal";
    readonly label1: "ock-font-family font-semibold text-sm leading-5";
    readonly label2: "ock-font-family text-sm leading-5";
    readonly legal: "ock-font-family text-xs leading-4";
    readonly title1: "ock-font-family font-semibold text-[1.75rem] leading-9";
    readonly title3: "ock-font-family font-semibold text-xl leading-7";
};
declare const pressable: {
    readonly default: "cursor-pointer ock-bg-default active:bg-[var(--ock-bg-default-active)] hover:bg-[var(--ock-bg-default-hover)]";
    readonly alternate: "cursor-pointer ock-bg-alternate active:bg-[var(--ock-bg-alternate-active)] hover:[var(--ock-bg-alternate-hover)]";
    readonly inverse: "cursor-pointer ock-bg-inverse active:bg-[var(--ock-bg-inverse-active)] hover:bg-[var(--ock-bg-inverse-hover)]";
    readonly primary: "cursor-pointer ock-bg-primary active:bg-[var(--ock-bg-primary-active)] hover:bg-[var(--ock-bg-primary-hover)]";
    readonly secondary: "cursor-pointer ock-bg-secondary active:bg-[var(--ock-bg-secondary-active)] hover:bg-[var(--ock-bg-secondary-hover)]";
    readonly coinbaseBranding: "cursor-pointer bg-[#0052FF] hover:bg-[#0045D8]";
    readonly shadow: "ock-shadow-default";
    readonly disabled: "opacity-[0.38] pointer-events-none";
};
declare const background: {
    readonly default: "ock-bg-default";
    readonly alternate: "ock-bg-alternate";
    readonly inverse: "ock-bg-inverse";
    readonly primary: "ock-bg-primary";
    readonly secondary: "ock-bg-secondary";
    readonly error: "ock-bg-error";
    readonly warning: "ock-bg-warning";
    readonly success: "ock-bg-success";
    readonly washed: "ock-bg-primary-washed";
    readonly disabled: "ock-bg-primary-disabled";
    readonly reverse: "ock-bg-default-reverse";
};
declare const color: {
    readonly inverse: "ock-text-inverse";
    readonly foreground: "ock-text-foreground";
    readonly foregroundMuted: "ock-text-foreground-muted";
    readonly error: "ock-text-error";
    readonly primary: "ock-text-primary";
    readonly success: "ock-text-success";
    readonly warning: "ock-text-warning";
    readonly disabled: "ock-text-disabled";
};
declare const fill: {
    readonly default: "ock-fill-default";
    readonly defaultReverse: "ock-fill-default-reverse";
    readonly inverse: "ock-fill-inverse";
    readonly alternate: "ock-fill-alternate";
};
declare const border: {
    readonly default: "ock-border-default";
    readonly defaultActive: "ock-border-default-active";
    readonly radius: "ock-border-radius";
    readonly radiusInner: "ock-border-radius-inner";
};
declare const placeholder: {
    readonly default: "ock-placeholder-default";
};
declare const icon: {
    readonly primary: "ock-icon-color-primary";
    readonly foreground: "ock-icon-color-foreground";
    readonly foregroundMuted: "ock-icon-color-foreground-muted";
    readonly inverse: "ock-icon-color-inverse";
    readonly error: "ock-icon-color-error";
    readonly success: "ock-icon-color-success";
    readonly warning: "ock-icon-color-warning";
};
declare const line: {
    readonly primary: "ock-line-primary border";
    readonly default: "ock-line-default border";
    readonly heavy: "ock-line-heavy border";
    readonly inverse: "ock-line-inverse border";
};

export { background, border, cn, color, fill, icon, line, placeholder, pressable, text };
