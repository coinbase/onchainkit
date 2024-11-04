import type { ContractFunctionParameters } from 'viem';
import type { Call, UseSendWalletTransactionsParams } from '../types';
export declare const useSendWalletTransactions: ({ capabilities, sendCallAsync, sendCallsAsync, transactionType, walletCapabilities, writeContractAsync, writeContractsAsync, }: UseSendWalletTransactionsParams) => (transactions?: Call[] | ContractFunctionParameters[] | Promise<Call[]> | Promise<ContractFunctionParameters[]>) => Promise<void>;
//# sourceMappingURL=useSendWalletTransactions.d.ts.map