import type { Address } from 'viem';
import type { ContractType, NFTPrice } from '../nft/types';
import type { Fee, QuoteWarning, SwapQuote, Transaction } from '../swap/types';
import type { Token } from '../token/types';
export type AddressOrETH = Address | 'ETH';
/**
 * Note: exported as public Type
 */
export type APIError = {
    code: string;
    error: string;
    message: string;
};
/**
 * Note: exported as public Type
 */
export type BuildPayTransactionParams = {
    address: Address;
    chargeId?: string;
    productId?: string;
};
/**
 * Note: exported as public Type
 */
export type BuildPayTransactionResponse = PayTransaction | APIError;
/**
 * Note: exported as public Type
 */
export type BuildSwapTransaction = {
    approveTransaction?: Transaction;
    fee: Fee;
    quote: SwapQuote;
    transaction: Transaction;
    warning?: QuoteWarning;
};
/**
 * Note: exported as public Type
 */
export type BuildSwapTransactionParams = GetSwapQuoteParams & {
    fromAddress: Address;
};
/**
 * Note: exported as public Type
 */
export type BuildSwapTransactionResponse = BuildSwapTransaction | APIError;
export type CreateProductChargeParams = {
    sender: Address;
    productId: string;
};
export type GetAPIParamsForToken = GetSwapQuoteParams | BuildSwapTransactionParams;
export type GetQuoteAPIParams = {
    amount: string;
    amountReference?: string;
    from: AddressOrETH | '';
    to: AddressOrETH | '';
    v2Enabled?: boolean;
    slippagePercentage?: string;
};
export type GetSwapAPIParams = GetQuoteAPIParams & {
    fromAddress: Address;
};
/**
 * Note: exported as public Type
 */
export type GetSwapQuoteParams = {
    amount: string;
    amountReference?: string;
    from: Token;
    isAmountInDecimals?: boolean;
    maxSlippage?: string;
    to: Token;
    useAggregator: boolean;
};
/**
 * Note: exported as public Type
 */
export type GetSwapQuoteResponse = SwapQuote | APIError;
/**
 * Note: exported as public Type
 */
export type GetTokensOptions = {
    limit?: string;
    page?: string;
    search?: string;
};
/**
 * Note: exported as public Type
 */
export type GetTokensResponse = Token[] | APIError;
export type HydrateChargeAPIParams = {
    sender: Address;
    chargeId: string;
};
export type PayTransaction = {
    id: string;
    callData: {
        deadline: string;
        feeAmount: string;
        id: string;
        operator: Address;
        prefix: Address;
        recipient: Address;
        recipientAmount: string;
        recipientCurrency: Address;
        refundDestination: Address;
        signature: Address;
    };
    metaData: {
        chainId: number;
        contractAddress: Address;
        sender: Address;
        settlementCurrencyAddress: Address;
    };
};
export type RawTransactionData = {
    data: string;
    from: string;
    gas: string;
    gasPrice: string;
    to: string;
    value: string;
};
export type SwapAPIParams = GetQuoteAPIParams | GetSwapAPIParams;
export type GetTokenDetailsParams = {
    contractAddress: Address;
    tokenId?: string;
};
export type TokenDetails = {
    name: string;
    description: string;
    imageUrl: string;
    animationUrl: string;
    mimeType: string;
    ownerAddress: Address;
    lastSoldPrice: NFTPrice;
    contractType: ContractType;
};
export type GetTokenDetailsResponse = TokenDetails | APIError;
export type GetMintDetailsParams = {
    contractAddress: Address;
    takerAddress?: Address;
    tokenId?: string;
};
export type MintDetails = {
    name: string;
    description: string;
    imageUrl: string;
    animationUrl: string;
    mimeType: string;
    contractType: ContractType;
    price: NFTPrice;
    mintFee: NFTPrice;
    maxMintsPerWallet: number;
    isEligibleToMint: boolean;
    creatorAddress: Address;
    totalTokens: string;
    totalOwners: string;
    network: string;
};
export type GetMintDetailsResponse = MintDetails | APIError;
export type BuildMintTransactionParams = {
    mintAddress: Address;
    takerAddress: Address;
    tokenId?: string;
    quantity: number;
    network?: string;
};
type MintTransaction = {
    call_data: {
        data: Address;
        to: Address;
        from: Address;
        value: string;
    };
};
export type BuildMintTransactionResponse = MintTransaction | APIError;
export {};
//# sourceMappingURL=types.d.ts.map