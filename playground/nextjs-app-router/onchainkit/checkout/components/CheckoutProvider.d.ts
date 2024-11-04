/// <reference types="react" />
import type { CheckoutContextType, CheckoutProviderReact } from '../types';
export declare const CheckoutContext: import("react").Context<CheckoutContextType>;
export declare function useCheckoutContext(): CheckoutContextType;
export declare function CheckoutProvider({ chargeHandler, children, isSponsored, onStatus, productId, }: CheckoutProviderReact): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CheckoutProvider.d.ts.map