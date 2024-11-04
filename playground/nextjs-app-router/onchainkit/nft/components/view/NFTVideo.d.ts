import type { NFTError } from '../../types';
type NFTVideoReact = {
    className?: string;
    square?: boolean;
    onLoading?: (mediaUrl: string) => void;
    onLoaded?: () => void;
    onError?: (error: NFTError) => void;
};
export declare function NFTVideo({ className, square, onLoading, onLoaded, onError, }: NFTVideoReact): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NFTVideo.d.ts.map