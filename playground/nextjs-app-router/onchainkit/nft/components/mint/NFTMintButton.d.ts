import { type TransactionButtonReact } from '../../../transaction';
type NFTMintButtonReact = {
    className?: string;
    label?: string;
} & Pick<TransactionButtonReact, 'disabled' | 'pendingOverride' | 'successOverride' | 'errorOverride'>;
export declare function NFTMintButton({ className, label, disabled, pendingOverride, successOverride, errorOverride, }: NFTMintButtonReact): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=NFTMintButton.d.ts.map