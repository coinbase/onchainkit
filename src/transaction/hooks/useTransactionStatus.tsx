import { useMemo } from 'react';
import type { Hex } from 'viem';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants'; // adjust the import path as needed

interface TransactionStatusProps {
  transactionType: string;
  writeContractTransactionHash?: Hex;
  statusWriteContracts?: string;
  statusWriteContract?: string;
  sendTransactionHash?: Hex;
  statusSendCalls?: string;
  statusSendCall?: string;
}

interface TransactionStatusResult {
  singleTransactionHash?: Hex;
  statusBatched?: string;
  statusSingle?: string;
}

export const useTransactionStatus = ({
  transactionType,
  writeContractTransactionHash,
  statusWriteContracts,
  statusWriteContract,
  sendTransactionHash,
  statusSendCalls,
  statusSendCall,
}: TransactionStatusProps): TransactionStatusResult => {
  return useMemo(() => {
    if (transactionType === TRANSACTION_TYPE_CONTRACTS) {
      return {
        singleTransactionHash: writeContractTransactionHash,
        statusBatched: statusWriteContracts,
        statusSingle: statusWriteContract,
      };
    }
    if (transactionType === TRANSACTION_TYPE_CALLS) {
      return {
        singleTransactionHash: sendTransactionHash,
        statusBatched: statusSendCalls,
        statusSingle: statusSendCall,
      };
    }
    return {
      singleTransactionHash: undefined,
      statusBatched: undefined,
      statusSingle: undefined,
    };
  }, [
    transactionType,
    writeContractTransactionHash,
    statusWriteContracts,
    statusWriteContract,
    sendTransactionHash,
    statusSendCalls,
    statusSendCall,
  ]);
};
