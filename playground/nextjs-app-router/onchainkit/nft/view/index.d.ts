import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

type NFTLastSoldPriceReact = {
    className?: string;
    label?: ReactNode;
};
declare function NFTLastSoldPrice({ className, label, }: NFTLastSoldPriceReact): react_jsx_runtime.JSX.Element | null;

declare function NFTMedia(): react_jsx_runtime.JSX.Element;

type NFTMintDateReact = {
    className?: string;
    label?: ReactNode;
};
declare function NFTMintDate({ className, label, }: NFTMintDateReact): react_jsx_runtime.JSX.Element | null;

type NFTOwnerReact = {
    className?: string;
    label?: ReactNode;
};
declare function NFTOwner({ className, label }: NFTOwnerReact): react_jsx_runtime.JSX.Element | null;

type NFTTitleReact = {
    className?: string;
};
declare function NFTTitle({ className }: NFTTitleReact): react_jsx_runtime.JSX.Element | null;

type NFTNetworkReact = {
    className?: string;
    label?: ReactNode;
};
declare function NFTNetwork({ className, label }: NFTNetworkReact): react_jsx_runtime.JSX.Element | null;

export { NFTLastSoldPrice, NFTMedia, NFTMintDate, NFTNetwork, NFTOwner, NFTTitle };
