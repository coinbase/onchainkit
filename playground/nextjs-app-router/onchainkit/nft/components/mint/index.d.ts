import * as react_jsx_runtime from 'react/jsx-runtime';
import { a as TransactionButtonReact } from '../../../types-CAfIXkWi.js';
import { ReactNode } from 'react';
import 'viem';

type NFTCreatorReact = {
    className?: string;
};
declare function NFTCreator({ className }: NFTCreatorReact): react_jsx_runtime.JSX.Element | null;

type NFTMintButtonReact = {
    className?: string;
    label?: string;
} & Pick<TransactionButtonReact, 'disabled' | 'pendingOverride' | 'successOverride' | 'errorOverride'>;
declare function NFTMintButton({ className, label, disabled, pendingOverride, successOverride, errorOverride, }: NFTMintButtonReact): react_jsx_runtime.JSX.Element | null;

type NFTMintersReact = {
    className?: string;
};
declare function NFTMinters({ className }: NFTMintersReact): react_jsx_runtime.JSX.Element | null;

type NFTQuantitySelectorReact = {
    className?: string;
};
declare function NFTQuantitySelector({ className }: NFTQuantitySelectorReact): react_jsx_runtime.JSX.Element | null;

type NFTAssetCostReact = {
    className?: string;
};
declare function NFTAssetCost({ className }: NFTAssetCostReact): react_jsx_runtime.JSX.Element | null;

type NFTTotalCostReact = {
    className?: string;
    label?: ReactNode;
};
declare function NFTTotalCost({ className, label, }: NFTTotalCostReact): react_jsx_runtime.JSX.Element | null;

type NFTCollectionTitleReact = {
    className?: string;
};
declare function NFTCollectionTitle({ className }: NFTCollectionTitleReact): react_jsx_runtime.JSX.Element | null;

export { NFTAssetCost, NFTCollectionTitle, NFTCreator, NFTMintButton, NFTMinters, NFTQuantitySelector, NFTTotalCost };
