/// <reference types="react" />
export type SocialPlatform = 'twitter' | 'github' | 'farcaster' | 'website';
export declare const PLATFORM_CONFIG: Record<SocialPlatform, {
    href: (value: string) => string;
    icon: React.ReactNode;
}>;
export declare function GetSocialPlatformDetails({ platform, value, }: {
    platform: SocialPlatform;
    value: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=getSocialPlatformDetails.d.ts.map