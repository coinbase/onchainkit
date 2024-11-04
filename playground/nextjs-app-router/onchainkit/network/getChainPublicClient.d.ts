import type { Chain } from 'viem/chains';
export declare function getChainPublicClient(chain: Chain): {
    account: undefined;
    batch?: {
        multicall?: boolean | {
            batchSize?: number | undefined;
            wait?: number | undefined;
        } | undefined;
    } | undefined;
    cacheTime: number;
    ccipRead?: false | {
        request?: ((parameters: import("viem").CcipRequestParameters) => Promise<`0x${string}`>) | undefined;
    } | undefined;
    chain: Chain;
    key: string;
    name: string;
    pollingInterval: number;
    request: import("viem").EIP1193RequestFn<import("viem").PublicRpcSchema>;
    transport: import("viem").TransportConfig<"http", import("viem").EIP1193RequestFn> & {
        fetchOptions?: Omit<RequestInit, "body"> | undefined;
        url?: string | undefined;
    };
    type: string;
    uid: string;
    call: (parameters: import("viem").CallParameters<Chain>) => Promise<import("viem").CallReturnType>;
    createBlockFilter: () => Promise<{
        id: `0x${string}`;
        request: import("viem").EIP1193RequestFn<readonly [{
            Method: "eth_getFilterChanges";
            Parameters: [filterId: `0x${string}`];
            ReturnType: `0x${string}`[] | import("viem").RpcLog[];
        }, {
            Method: "eth_getFilterLogs";
            Parameters: [filterId: `0x${string}`];
            ReturnType: import("viem").RpcLog[];
        }, {
            Method: "eth_uninstallFilter";
            Parameters: [filterId: `0x${string}`];
            ReturnType: boolean;
        }]>;
        type: "block";
    }>;
    createContractEventFilter: <const abi extends readonly unknown[] | import("viem").Abi, eventName extends import("viem").ContractEventName<abi> | undefined, args extends import("viem").MaybeExtractEventArgsFromAbi<abi, eventName> | undefined, strict extends boolean | undefined = undefined, fromBlock extends bigint | import("viem").BlockTag | undefined = undefined, toBlock extends bigint | import("viem").BlockTag | undefined = undefined>(args: import("viem").CreateContractEventFilterParameters<abi, eventName, args, strict, fromBlock, toBlock>) => Promise<import("viem").CreateContractEventFilterReturnType<abi, eventName, args, strict, fromBlock, toBlock>>;
    createEventFilter: <const abiEvent extends import("viem").AbiEvent | undefined = undefined, const abiEvents extends readonly unknown[] | readonly import("viem").AbiEvent[] | undefined = abiEvent extends import("viem").AbiEvent ? [abiEvent] : undefined, strict_1 extends boolean | undefined = undefined, fromBlock_1 extends bigint | import("viem").BlockTag | undefined = undefined, toBlock_1 extends bigint | import("viem").BlockTag | undefined = undefined, _EventName extends string | undefined = import("viem").MaybeAbiEventName<abiEvent>, _Args extends import("viem").MaybeExtractEventArgsFromAbi<abiEvents, _EventName> | undefined = undefined>(args?: import("viem").CreateEventFilterParameters<abiEvent, abiEvents, strict_1, fromBlock_1, toBlock_1, _EventName, _Args> | undefined) => Promise<import("viem").Filter<"event", abiEvents, _EventName, _Args, strict_1, fromBlock_1, toBlock_1> extends infer T ? { [K in keyof T]: import("viem").Filter<"event", abiEvents, _EventName, _Args, strict_1, fromBlock_1, toBlock_1>[K]; } : never>;
    createPendingTransactionFilter: () => Promise<{
        id: `0x${string}`;
        request: import("viem").EIP1193RequestFn<readonly [{
            Method: "eth_getFilterChanges";
            Parameters: [filterId: `0x${string}`];
            ReturnType: `0x${string}`[] | import("viem").RpcLog[];
        }, {
            Method: "eth_getFilterLogs";
            Parameters: [filterId: `0x${string}`];
            ReturnType: import("viem").RpcLog[];
        }, {
            Method: "eth_uninstallFilter";
            Parameters: [filterId: `0x${string}`];
            ReturnType: boolean;
        }]>;
        type: "transaction";
    }>;
    estimateContractGas: <chain extends Chain | undefined, const abi_1 extends readonly unknown[] | import("viem").Abi, functionName extends import("viem").ContractFunctionName<abi_1, "nonpayable" | "payable">, args_1 extends import("viem").ContractFunctionArgs<abi_1, "nonpayable" | "payable", functionName>>(args: import("viem").EstimateContractGasParameters<abi_1, functionName, args, chain>) => Promise<bigint>;
    estimateGas: (args: import("viem").EstimateGasParameters<Chain>) => Promise<bigint>;
    getBalance: (args: import("viem").GetBalanceParameters) => Promise<bigint>;
    getBlobBaseFee: () => Promise<bigint>;
    getBlock: <includeTransactions extends boolean = false, blockTag extends import("viem").BlockTag = "latest">(args?: import("viem").GetBlockParameters<includeTransactions, blockTag> | undefined) => Promise<{
        number: blockTag extends "pending" ? null : bigint;
        hash: blockTag extends "pending" ? null : `0x${string}`;
        nonce: blockTag extends "pending" ? null : `0x${string}`;
        logsBloom: blockTag extends "pending" ? null : `0x${string}`;
        baseFeePerGas: bigint | null;
        blobGasUsed: bigint;
        difficulty: bigint;
        excessBlobGas: bigint;
        extraData: `0x${string}`;
        gasLimit: bigint;
        gasUsed: bigint;
        miner: `0x${string}`;
        mixHash: `0x${string}`;
        parentHash: `0x${string}`;
        receiptsRoot: `0x${string}`;
        sealFields: `0x${string}`[];
        sha3Uncles: `0x${string}`;
        size: bigint;
        stateRoot: `0x${string}`;
        timestamp: bigint;
        totalDifficulty: bigint | null;
        transactionsRoot: `0x${string}`;
        uncles: `0x${string}`[];
        withdrawals?: import("viem").Withdrawal[] | undefined;
        withdrawalsRoot?: `0x${string}` | undefined;
        transactions: includeTransactions extends true ? ({
            yParity?: undefined;
            from: `0x${string}`;
            gas: bigint;
            hash: `0x${string}`;
            input: `0x${string}`;
            nonce: number;
            r: `0x${string}`;
            s: `0x${string}`;
            to: `0x${string}` | null;
            typeHex: `0x${string}` | null;
            v: bigint;
            value: bigint;
            accessList?: undefined;
            blobVersionedHashes?: undefined;
            chainId?: number | undefined;
            type: "legacy";
            gasPrice: bigint;
            maxFeePerBlobGas?: undefined;
            maxFeePerGas?: undefined;
            maxPriorityFeePerGas?: undefined;
            blockHash: (blockTag extends "pending" ? true : false) extends infer T_1 ? T_1 extends (blockTag extends "pending" ? true : false) ? T_1 extends true ? null : `0x${string}` : never : never;
            blockNumber: (blockTag extends "pending" ? true : false) extends infer T_2 ? T_2 extends (blockTag extends "pending" ? true : false) ? T_2 extends true ? null : bigint : never : never;
            transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_3 ? T_3 extends (blockTag extends "pending" ? true : false) ? T_3 extends true ? null : number : never : never;
        } | {
            yParity: number;
            from: `0x${string}`;
            gas: bigint;
            hash: `0x${string}`;
            input: `0x${string}`;
            nonce: number;
            r: `0x${string}`;
            s: `0x${string}`;
            to: `0x${string}` | null;
            typeHex: `0x${string}` | null;
            v: bigint;
            value: bigint;
            accessList: import("viem").AccessList;
            blobVersionedHashes?: undefined;
            chainId: number;
            type: "eip2930";
            gasPrice: bigint;
            maxFeePerBlobGas?: undefined;
            maxFeePerGas?: undefined;
            maxPriorityFeePerGas?: undefined;
            blockHash: (blockTag extends "pending" ? true : false) extends infer T_4 ? T_4 extends (blockTag extends "pending" ? true : false) ? T_4 extends true ? null : `0x${string}` : never : never;
            blockNumber: (blockTag extends "pending" ? true : false) extends infer T_5 ? T_5 extends (blockTag extends "pending" ? true : false) ? T_5 extends true ? null : bigint : never : never;
            transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_6 ? T_6 extends (blockTag extends "pending" ? true : false) ? T_6 extends true ? null : number : never : never;
        } | {
            yParity: number;
            from: `0x${string}`;
            gas: bigint;
            hash: `0x${string}`;
            input: `0x${string}`;
            nonce: number;
            r: `0x${string}`;
            s: `0x${string}`;
            to: `0x${string}` | null;
            typeHex: `0x${string}` | null;
            v: bigint;
            value: bigint;
            accessList: import("viem").AccessList;
            blobVersionedHashes?: undefined;
            chainId: number;
            type: "eip1559";
            gasPrice?: undefined;
            maxFeePerBlobGas?: undefined;
            maxFeePerGas: bigint;
            maxPriorityFeePerGas: bigint;
            blockHash: (blockTag extends "pending" ? true : false) extends infer T_7 ? T_7 extends (blockTag extends "pending" ? true : false) ? T_7 extends true ? null : `0x${string}` : never : never;
            blockNumber: (blockTag extends "pending" ? true : false) extends infer T_8 ? T_8 extends (blockTag extends "pending" ? true : false) ? T_8 extends true ? null : bigint : never : never;
            transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_9 ? T_9 extends (blockTag extends "pending" ? true : false) ? T_9 extends true ? null : number : never : never;
        } | {
            yParity: number;
            from: `0x${string}`;
            gas: bigint;
            hash: `0x${string}`;
            input: `0x${string}`;
            nonce: number;
            r: `0x${string}`;
            s: `0x${string}`;
            to: `0x${string}` | null;
            typeHex: `0x${string}` | null;
            v: bigint;
            value: bigint;
            accessList: import("viem").AccessList;
            blobVersionedHashes: readonly `0x${string}`[];
            chainId: number;
            type: "eip4844";
            gasPrice?: undefined;
            maxFeePerBlobGas: bigint;
            maxFeePerGas: bigint;
            maxPriorityFeePerGas: bigint;
            blockHash: (blockTag extends "pending" ? true : false) extends infer T_10 ? T_10 extends (blockTag extends "pending" ? true : false) ? T_10 extends true ? null : `0x${string}` : never : never;
            blockNumber: (blockTag extends "pending" ? true : false) extends infer T_11 ? T_11 extends (blockTag extends "pending" ? true : false) ? T_11 extends true ? null : bigint : never : never;
            transactionIndex: (blockTag extends "pending" ? true : false) extends infer T_12 ? T_12 extends (blockTag extends "pending" ? true : false) ? T_12 extends true ? null : number : never : never;
        })[] : `0x${string}`[];
    }>;
    getBlockNumber: (args?: import("viem").GetBlockNumberParameters | undefined) => Promise<bigint>;
    getBlockTransactionCount: (args?: import("viem").GetBlockTransactionCountParameters | undefined) => Promise<number>;
    getBytecode: (args: import("viem").GetBytecodeParameters) => Promise<import("viem").GetBytecodeReturnType>;
    getChainId: () => Promise<number>;
    getCode: (args: import("viem").GetBytecodeParameters) => Promise<import("viem").GetBytecodeReturnType>;
    getContractEvents: <const abi_2 extends readonly unknown[] | import("viem").Abi, eventName_1 extends import("viem").ContractEventName<abi_2> | undefined = undefined, strict_2 extends boolean | undefined = undefined, fromBlock_2 extends bigint | import("viem").BlockTag | undefined = undefined, toBlock_2 extends bigint | import("viem").BlockTag | undefined = undefined>(args: import("viem").GetContractEventsParameters<abi_2, eventName_1, strict_2, fromBlock_2, toBlock_2>) => Promise<import("viem").GetContractEventsReturnType<abi_2, eventName_1, strict_2, fromBlock_2, toBlock_2>>;
    getEip712Domain: (args: import("viem").GetEip712DomainParameters) => Promise<import("viem").GetEip712DomainReturnType>;
    getEnsAddress: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        coinType?: number | undefined;
        gatewayUrls?: string[] | undefined;
        name: string;
        strict?: boolean | undefined;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<import("viem").GetEnsAddressReturnType>;
    getEnsAvatar: (args: {
        name: string;
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        gatewayUrls?: string[] | undefined;
        strict?: boolean | undefined;
        universalResolverAddress?: `0x${string}` | undefined;
        assetGatewayUrls?: import("viem").AssetGatewayUrls | undefined;
    }) => Promise<import("viem").GetEnsAvatarReturnType>;
    getEnsName: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        address: `0x${string}`;
        gatewayUrls?: string[] | undefined;
        strict?: boolean | undefined;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<import("viem").GetEnsNameReturnType>;
    getEnsResolver: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        name: string;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<`0x${string}`>;
    getEnsText: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        name: string;
        gatewayUrls?: string[] | undefined;
        key: string;
        strict?: boolean | undefined;
        universalResolverAddress?: `0x${string}` | undefined;
    }) => Promise<import("viem").GetEnsTextReturnType>;
    getFeeHistory: (args: import("viem").GetFeeHistoryParameters) => Promise<import("viem").GetFeeHistoryReturnType>;
    estimateFeesPerGas: <chainOverride extends Chain | undefined = undefined, type extends import("viem").FeeValuesType = "eip1559">(args?: import("viem").EstimateFeesPerGasParameters<Chain, chainOverride, type> | undefined) => Promise<import("viem").EstimateFeesPerGasReturnType>;
    getFilterChanges: <filterType extends import("viem").FilterType, const abi_3 extends readonly unknown[] | import("viem").Abi | undefined, eventName_2 extends string | undefined, strict_3 extends boolean | undefined = undefined, fromBlock_3 extends bigint | import("viem").BlockTag | undefined = undefined, toBlock_3 extends bigint | import("viem").BlockTag | undefined = undefined>(args: import("viem").GetFilterChangesParameters<filterType, abi_3, eventName_2, strict_3, fromBlock_3, toBlock_3>) => Promise<import("viem").GetFilterChangesReturnType<filterType, abi_3, eventName_2, strict_3, fromBlock_3, toBlock_3>>;
    getFilterLogs: <const abi_4 extends readonly unknown[] | import("viem").Abi | undefined, eventName_3 extends string | undefined, strict_4 extends boolean | undefined = undefined, fromBlock_4 extends bigint | import("viem").BlockTag | undefined = undefined, toBlock_4 extends bigint | import("viem").BlockTag | undefined = undefined>(args: import("viem").GetFilterLogsParameters<abi_4, eventName_3, strict_4, fromBlock_4, toBlock_4>) => Promise<import("viem").GetFilterLogsReturnType<abi_4, eventName_3, strict_4, fromBlock_4, toBlock_4>>;
    getGasPrice: () => Promise<bigint>;
    getLogs: <const abiEvent_1 extends import("viem").AbiEvent | undefined = undefined, const abiEvents_1 extends readonly unknown[] | readonly import("viem").AbiEvent[] | undefined = abiEvent_1 extends import("viem").AbiEvent ? [abiEvent_1] : undefined, strict_5 extends boolean | undefined = undefined, fromBlock_5 extends bigint | import("viem").BlockTag | undefined = undefined, toBlock_5 extends bigint | import("viem").BlockTag | undefined = undefined>(args?: import("viem").GetLogsParameters<abiEvent_1, abiEvents_1, strict_5, fromBlock_5, toBlock_5> | undefined) => Promise<import("viem").GetLogsReturnType<abiEvent_1, abiEvents_1, strict_5, fromBlock_5, toBlock_5>>;
    getProof: (args: import("viem").GetProofParameters) => Promise<import("viem").GetProofReturnType>;
    estimateMaxPriorityFeePerGas: <chainOverride_1 extends Chain | undefined = undefined>(args?: {
        chain?: chainOverride_1 | null | undefined;
    } | undefined) => Promise<bigint>;
    getStorageAt: (args: import("viem").GetStorageAtParameters) => Promise<import("viem").GetStorageAtReturnType>;
    getTransaction: <blockTag_1 extends import("viem").BlockTag = "latest">(args: import("viem").GetTransactionParameters<blockTag_1>) => Promise<{
        yParity?: undefined;
        from: `0x${string}`;
        gas: bigint;
        hash: `0x${string}`;
        input: `0x${string}`;
        nonce: number;
        r: `0x${string}`;
        s: `0x${string}`;
        to: `0x${string}` | null;
        typeHex: `0x${string}` | null;
        v: bigint;
        value: bigint;
        accessList?: undefined;
        blobVersionedHashes?: undefined;
        chainId?: number | undefined;
        type: "legacy";
        gasPrice: bigint;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: undefined;
        maxPriorityFeePerGas?: undefined;
        blockHash: (blockTag_1 extends "pending" ? true : false) extends infer T_13 ? T_13 extends (blockTag_1 extends "pending" ? true : false) ? T_13 extends true ? null : `0x${string}` : never : never;
        blockNumber: (blockTag_1 extends "pending" ? true : false) extends infer T_14 ? T_14 extends (blockTag_1 extends "pending" ? true : false) ? T_14 extends true ? null : bigint : never : never;
        transactionIndex: (blockTag_1 extends "pending" ? true : false) extends infer T_15 ? T_15 extends (blockTag_1 extends "pending" ? true : false) ? T_15 extends true ? null : number : never : never;
    } | {
        yParity: number;
        from: `0x${string}`;
        gas: bigint;
        hash: `0x${string}`;
        input: `0x${string}`;
        nonce: number;
        r: `0x${string}`;
        s: `0x${string}`;
        to: `0x${string}` | null;
        typeHex: `0x${string}` | null;
        v: bigint;
        value: bigint;
        accessList: import("viem").AccessList;
        blobVersionedHashes?: undefined;
        chainId: number;
        type: "eip2930";
        gasPrice: bigint;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: undefined;
        maxPriorityFeePerGas?: undefined;
        blockHash: (blockTag_1 extends "pending" ? true : false) extends infer T_16 ? T_16 extends (blockTag_1 extends "pending" ? true : false) ? T_16 extends true ? null : `0x${string}` : never : never;
        blockNumber: (blockTag_1 extends "pending" ? true : false) extends infer T_17 ? T_17 extends (blockTag_1 extends "pending" ? true : false) ? T_17 extends true ? null : bigint : never : never;
        transactionIndex: (blockTag_1 extends "pending" ? true : false) extends infer T_18 ? T_18 extends (blockTag_1 extends "pending" ? true : false) ? T_18 extends true ? null : number : never : never;
    } | {
        yParity: number;
        from: `0x${string}`;
        gas: bigint;
        hash: `0x${string}`;
        input: `0x${string}`;
        nonce: number;
        r: `0x${string}`;
        s: `0x${string}`;
        to: `0x${string}` | null;
        typeHex: `0x${string}` | null;
        v: bigint;
        value: bigint;
        accessList: import("viem").AccessList;
        blobVersionedHashes?: undefined;
        chainId: number;
        type: "eip1559";
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
        blockHash: (blockTag_1 extends "pending" ? true : false) extends infer T_19 ? T_19 extends (blockTag_1 extends "pending" ? true : false) ? T_19 extends true ? null : `0x${string}` : never : never;
        blockNumber: (blockTag_1 extends "pending" ? true : false) extends infer T_20 ? T_20 extends (blockTag_1 extends "pending" ? true : false) ? T_20 extends true ? null : bigint : never : never;
        transactionIndex: (blockTag_1 extends "pending" ? true : false) extends infer T_21 ? T_21 extends (blockTag_1 extends "pending" ? true : false) ? T_21 extends true ? null : number : never : never;
    } | {
        yParity: number;
        from: `0x${string}`;
        gas: bigint;
        hash: `0x${string}`;
        input: `0x${string}`;
        nonce: number;
        r: `0x${string}`;
        s: `0x${string}`;
        to: `0x${string}` | null;
        typeHex: `0x${string}` | null;
        v: bigint;
        value: bigint;
        accessList: import("viem").AccessList;
        blobVersionedHashes: readonly `0x${string}`[];
        chainId: number;
        type: "eip4844";
        gasPrice?: undefined;
        maxFeePerBlobGas: bigint;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
        blockHash: (blockTag_1 extends "pending" ? true : false) extends infer T_22 ? T_22 extends (blockTag_1 extends "pending" ? true : false) ? T_22 extends true ? null : `0x${string}` : never : never;
        blockNumber: (blockTag_1 extends "pending" ? true : false) extends infer T_23 ? T_23 extends (blockTag_1 extends "pending" ? true : false) ? T_23 extends true ? null : bigint : never : never;
        transactionIndex: (blockTag_1 extends "pending" ? true : false) extends infer T_24 ? T_24 extends (blockTag_1 extends "pending" ? true : false) ? T_24 extends true ? null : number : never : never;
    }>;
    getTransactionConfirmations: (args: import("viem").GetTransactionConfirmationsParameters<Chain>) => Promise<bigint>;
    getTransactionCount: (args: import("viem").GetTransactionCountParameters) => Promise<number>;
    getTransactionReceipt: (args: import("viem").GetTransactionReceiptParameters) => Promise<import("viem").TransactionReceipt>;
    multicall: <const contracts extends readonly unknown[], allowFailure extends boolean = true>(args: import("viem").MulticallParameters<contracts, allowFailure>) => Promise<import("viem").MulticallReturnType<contracts, allowFailure>>;
    prepareTransactionRequest: <const request extends import("viem").PrepareTransactionRequestRequest<Chain, chainOverride_2>, chainOverride_2 extends Chain | undefined = undefined, accountOverride extends `0x${string}` | import("viem").Account | undefined = undefined>(args: import("viem").PrepareTransactionRequestParameters<Chain, import("viem").Account | undefined, chainOverride_2, accountOverride, request>) => Promise<import("viem").UnionRequiredBy<Extract<import("viem").UnionOmit<import("viem").ExtractChainFormatterParameters<import("viem").DeriveChain<Chain, chainOverride_2>, "transactionRequest", import("viem").TransactionRequest>, "from"> & (import("viem").DeriveChain<Chain, chainOverride_2> extends infer T_37 ? T_37 extends import("viem").DeriveChain<Chain, chainOverride_2> ? T_37 extends Chain ? {
        chain: T_37;
    } : {
        chain?: undefined;
    } : never : never) & (import("viem").DeriveAccount<import("viem").Account | undefined, accountOverride> extends infer T_38 ? T_38 extends import("viem").DeriveAccount<import("viem").Account | undefined, accountOverride> ? T_38 extends import("viem").Account ? {
        account: T_38;
        from: `0x${string}`;
    } : {
        account?: undefined;
        from?: undefined;
    } : never : never), import("viem").IsNever<((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_39 ? T_39 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_39 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_40 ? T_40 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_40 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_41 ? T_41 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_41 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_42 ? T_42 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_42 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never)> extends true ? unknown : import("viem").ExactPartial<((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_43 ? T_43 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_43 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_44 ? T_44 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_44 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_45 ? T_45 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_45 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_46 ? T_46 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_46 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never)>> & {
        chainId?: number | undefined;
    }, (request["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "fees" | "gas" | "nonce" | "blobVersionedHashes" | "chainId" | "type") extends infer T_47 ? T_47 extends (request["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "fees" | "gas" | "nonce" | "blobVersionedHashes" | "chainId" | "type") ? T_47 extends "fees" ? "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" : T_47 : never : never> & (unknown extends request["kzg"] ? {} : Pick<request, "kzg">) extends infer T_25 ? { [K_1 in keyof T_25]: (import("viem").UnionRequiredBy<Extract<import("viem").UnionOmit<import("viem").ExtractChainFormatterParameters<import("viem").DeriveChain<Chain, chainOverride_2>, "transactionRequest", import("viem").TransactionRequest>, "from"> & (import("viem").DeriveChain<Chain, chainOverride_2> extends infer T_26 ? T_26 extends import("viem").DeriveChain<Chain, chainOverride_2> ? T_26 extends Chain ? {
        chain: T_26;
    } : {
        chain?: undefined;
    } : never : never) & (import("viem").DeriveAccount<import("viem").Account | undefined, accountOverride> extends infer T_27 ? T_27 extends import("viem").DeriveAccount<import("viem").Account | undefined, accountOverride> ? T_27 extends import("viem").Account ? {
        account: T_27;
        from: `0x${string}`;
    } : {
        account?: undefined;
        from?: undefined;
    } : never : never), import("viem").IsNever<((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_28 ? T_28 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_28 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_29 ? T_29 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_29 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_30 ? T_30 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_30 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_31 ? T_31 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_31 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never)> extends true ? unknown : import("viem").ExactPartial<((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_32 ? T_32 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_32 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_33 ? T_33 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_33 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_34 ? T_34 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_34 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) extends infer T_35 ? T_35 extends (request["type"] extends string | undefined ? request["type"] : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<request, (request extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, request> | import("viem").Opaque<import("viem").TransactionRequestLegacy, request> ? "legacy" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList | undefined;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, request> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, request> ? "eip1559" : never) | (request extends ({
        accessList?: import("viem").AccessList | undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint | undefined;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList | undefined;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, request> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, request> ? "eip2930" : never) | (request extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
        blobVersionedHashes?: readonly `0x${string}`[] | undefined;
        maxFeePerBlobGas?: bigint | undefined;
        maxFeePerGas?: bigint | undefined;
        maxPriorityFeePerGas?: bigint | undefined;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[] | undefined;
    } | {
        blobVersionedHashes: readonly `0x${string}`[] | undefined;
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[] | undefined;
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, request> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, request> ? "eip4844" : never) | (request["type"] extends string ? request["type"] : never)>) ? T_35 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never)>> & {
        chainId?: number | undefined;
    }, (request["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "fees" | "gas" | "nonce" | "blobVersionedHashes" | "chainId" | "type") extends infer T_36 ? T_36 extends (request["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? request["parameters"][number] : "fees" | "gas" | "nonce" | "blobVersionedHashes" | "chainId" | "type") ? T_36 extends "fees" ? "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" : T_36 : never : never> & (unknown extends request["kzg"] ? {} : Pick<request, "kzg">))[K_1]; } : never>;
    readContract: <const abi_5 extends readonly unknown[] | import("viem").Abi, functionName_1 extends import("viem").ContractFunctionName<abi_5, "pure" | "view">, args_2 extends import("viem").ContractFunctionArgs<abi_5, "pure" | "view", functionName_1>>(args: import("viem").ReadContractParameters<abi_5, functionName_1, args>) => Promise<import("viem").ReadContractReturnType<abi_5, functionName_1, args>>;
    sendRawTransaction: (args: import("viem").SendRawTransactionParameters) => Promise<`0x${string}`>;
    simulateContract: <const abi_6 extends readonly unknown[] | import("viem").Abi, functionName_2 extends import("viem").ContractFunctionName<abi_6, "nonpayable" | "payable">, args_3 extends import("viem").ContractFunctionArgs<abi_6, "nonpayable" | "payable", functionName_2>, chainOverride_3 extends Chain | undefined, accountOverride_1 extends `0x${string}` | import("viem").Account | undefined = undefined>(args: import("viem").SimulateContractParameters<abi_6, functionName_2, args_3, Chain, chainOverride_3, accountOverride_1>) => Promise<import("viem").SimulateContractReturnType<abi_6, functionName_2, args_3, Chain, import("viem").Account | undefined, chainOverride_3, accountOverride_1>>;
    verifyMessage: (args: {
        blockNumber?: bigint | undefined;
        address: `0x${string}`;
        signature: `0x${string}` | import("viem").Signature | Uint8Array;
        blockTag?: import("viem").BlockTag | undefined;
        factory?: `0x${string}` | undefined;
        factoryData?: `0x${string}` | undefined;
        message: import("viem").SignableMessage;
    }) => Promise<boolean>;
    verifySiweMessage: (args: {
        blockNumber?: bigint | undefined;
        blockTag?: import("viem").BlockTag | undefined;
        nonce?: string | undefined;
        address?: `0x${string}` | undefined;
        domain?: string | undefined;
        scheme?: string | undefined;
        time?: Date | undefined;
        message: string;
        signature: `0x${string}`;
    }) => Promise<boolean>;
    verifyTypedData: (args: import("viem").VerifyTypedDataActionParameters) => Promise<boolean>;
    uninstallFilter: (args: import("viem").UninstallFilterParameters) => Promise<boolean>;
    waitForTransactionReceipt: (args: import("viem").WaitForTransactionReceiptParameters<Chain>) => Promise<import("viem").TransactionReceipt>;
    watchBlockNumber: (args: import("viem").WatchBlockNumberParameters) => import("viem").WatchBlockNumberReturnType;
    watchBlocks: <includeTransactions_1 extends boolean = false, blockTag_2 extends import("viem").BlockTag = "latest">(args: import("viem").WatchBlocksParameters<import("viem").HttpTransport, Chain, includeTransactions_1, blockTag_2>) => import("viem").WatchBlocksReturnType;
    watchContractEvent: <const abi_7 extends readonly unknown[] | import("viem").Abi, eventName_4 extends import("viem").ContractEventName<abi_7>, strict_6 extends boolean | undefined = undefined>(args: import("viem").WatchContractEventParameters<abi_7, eventName_4, strict_6, import("viem").HttpTransport>) => import("viem").WatchContractEventReturnType;
    watchEvent: <const abiEvent_2 extends import("viem").AbiEvent | undefined = undefined, const abiEvents_2 extends readonly unknown[] | readonly import("viem").AbiEvent[] | undefined = abiEvent_2 extends import("viem").AbiEvent ? [abiEvent_2] : undefined, strict_7 extends boolean | undefined = undefined>(args: import("viem").WatchEventParameters<abiEvent_2, abiEvents_2, strict_7, import("viem").HttpTransport>) => import("viem").WatchEventReturnType;
    watchPendingTransactions: (args: import("viem").WatchPendingTransactionsParameters<import("viem").HttpTransport>) => import("viem").WatchPendingTransactionsReturnType;
    extend: <const client extends {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        cacheTime?: undefined;
        ccipRead?: undefined;
        chain?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    } & import("viem").ExactPartial<Pick<import("viem").PublicActions<import("viem").HttpTransport, Chain, undefined>, "getChainId" | "call" | "createContractEventFilter" | "createEventFilter" | "estimateContractGas" | "estimateGas" | "getBlock" | "getBlockNumber" | "getContractEvents" | "getEnsText" | "getFilterChanges" | "getGasPrice" | "getLogs" | "getTransaction" | "getTransactionCount" | "getTransactionReceipt" | "prepareTransactionRequest" | "readContract" | "sendRawTransaction" | "simulateContract" | "uninstallFilter" | "watchBlockNumber" | "watchContractEvent"> & Pick<import("viem").WalletActions<Chain, undefined>, "sendTransaction" | "writeContract">>>(fn: (client: import("viem").Client<import("viem").HttpTransport, Chain, undefined, import("viem").PublicRpcSchema, import("viem").PublicActions<import("viem").HttpTransport, Chain>>) => client) => import("viem").Client<import("viem").HttpTransport, Chain, undefined, import("viem").PublicRpcSchema, { [K_2 in keyof client]: client[K_2]; } & import("viem").PublicActions<import("viem").HttpTransport, Chain>>;
};
//# sourceMappingURL=getChainPublicClient.d.ts.map