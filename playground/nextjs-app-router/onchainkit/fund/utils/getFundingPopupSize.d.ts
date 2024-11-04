import { type popupSizes } from '../../internal/utils/getWindowDimensions';
type PopupSize = {
    height: number;
    width: number;
};
/**
 * Gets the appropriate popup dimensions for the given size and funding URL.
 */
export declare function getFundingPopupSize(size: keyof typeof popupSizes, fundingUrl?: string): PopupSize;
export {};
//# sourceMappingURL=getFundingPopupSize.d.ts.map