import { type Address } from 'viem';
import type { UseCommerceContractsParams } from '../types';
export declare const useCommerceContracts: ({ chargeHandler, productId, }: UseCommerceContractsParams) => (address: Address) => Promise<{
    chargeId: string;
    contracts: import("viem").ContractFunctionParameters[];
    insufficientBalance: boolean;
    priceInUSDC: string;
    error?: undefined;
} | {
    chargeId: string;
    contracts: null;
    insufficientBalance: boolean;
    error: unknown;
    priceInUSDC?: undefined;
}>;
//# sourceMappingURL=useCommerceContracts.d.ts.map