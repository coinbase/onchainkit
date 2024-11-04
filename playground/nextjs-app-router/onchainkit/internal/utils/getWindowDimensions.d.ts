export type WindowSizes = Record<'sm' | 'md' | 'lg', {
    width: string;
    height: string;
}>;
export declare const popupSizes: WindowSizes;
export declare const getWindowDimensions: (size: keyof typeof popupSizes) => {
    width: number;
    height: number;
};
//# sourceMappingURL=getWindowDimensions.d.ts.map