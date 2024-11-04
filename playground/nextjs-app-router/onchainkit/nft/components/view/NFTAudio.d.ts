import type { NFTError } from '../../types';
type NFTAudioReact = {
    className?: string;
    onLoading?: (mediaUrl: string) => void;
    onLoaded?: () => void;
    onError?: (error: NFTError) => void;
};
export declare function NFTAudio({ className, onLoading, onLoaded, onError, }: NFTAudioReact): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=NFTAudio.d.ts.map