import type { NFTError } from '../../types';
type NFTImageReact = {
    className?: string;
    square?: boolean;
    onLoading?: (mediaUrl: string) => void;
    onLoaded?: () => void;
    onError?: (error: NFTError) => void;
};
export declare function NFTImage({ className, square, onLoading, onLoaded, onError, }: NFTImageReact): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NFTImage.d.ts.map