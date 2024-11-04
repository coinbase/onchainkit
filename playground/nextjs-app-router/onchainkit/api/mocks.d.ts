export declare const MOCK_VALID_CHARGE_ID = "1b03e80d-4e87-46fd-9772-422a1b693fb7";
export declare const MOCK_INVALID_CHARGE_ID = "00000000-0000-0000-0000-000000000000";
export declare const MOCK_VALID_PAYER_ADDRESS = "0x98fAbEA34A3A377916EBF7793f37E11EE98D29Eb";
export declare const MOCK_HYDRATE_CHARGE_SUCCESS_RESPONSE: {
    id: number;
    jsonrpc: string;
    result: {
        id: string;
        callData: {
            deadline: string;
            feeAmount: string;
            id: string;
            operator: string;
            prefix: string;
            recipient: string;
            recipientAmount: string;
            recipientCurrency: string;
            refundDestination: string;
            signature: string;
        };
        metaData: {
            chainId: number;
            contractAddress: string;
            sender: string;
            settlementCurrencyAddress: string;
        };
    };
};
export declare const MOCK_VALID_PRODUCT_ID = "1b03e80d-4e87-46fd-9772-422a1b693fb7";
export declare const MOCK_CREATE_PRODUCT_CHARGE_SUCCESS_RESPONSE: {
    id: number;
    jsonrpc: string;
    result: {
        id: string;
        callData: {
            deadline: string;
            feeAmount: string;
            id: string;
            operator: string;
            prefix: string;
            recipient: string;
            recipientAmount: string;
            recipientCurrency: string;
            refundDestination: string;
            signature: string;
        };
        metaData: {
            chainId: number;
            contractAddress: string;
            sender: string;
            settlementCurrencyAddress: string;
        };
    };
};
export declare const MOCK_HYDRATE_CHARGE_INVALID_CHARGE_ERROR_RESPONSE: {
    id: number;
    jsonrpc: string;
    error: {
        code: number;
        message: string;
    };
};
//# sourceMappingURL=mocks.d.ts.map