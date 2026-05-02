import { type Address, type Hex, decodeFunctionResult, encodeFunctionData } from 'viem';
import { call as viemCall } from 'viem/actions';
import { type Config, getPublicClient } from '@wagmi/core';
import type { APIError } from '@/api/types';
import { buildErrorStruct } from '@/api/utils/buildErrorStruct';
import { ApiErrorCode } from '@/api/constants';

export type SimulationResult = {
  success: boolean;
  gasUsed: bigint;
  returnData?: Hex;
  decodedOutput?: unknown;
  errorMessage?: string;
  warnings: string[];
};

export type SimulateTransactionParams = {
  config: Config;
  chainId: number;
  from: Address;
  to: Address;
  data: Hex;
  value?: bigint;
};

export async function simulateTransaction({
  config,
  chainId,
  from,
  to,
  data,
  value,
}: SimulateTransactionParams): Promise<SimulationResult | APIError> {
  try {
    const client = getPublicClient(config, { chainId });
    if (!client) {
      return buildErrorStruct({
        code: ApiErrorCode.AMGTa01,
        error: 'No RPC client',
        message: `Cannot connect to chain ${chainId}`,
      });
    }

    const result = await viemCall(client, {
      account: from,
      to,
      data,
      value,
    });

    // Analisi del risultato
    const warnings: string[] = [];
    
    // Se è una swap, decodifica l'output per slippage
    // (semplificato — in produzione userebbe l'ABI specifico)
    if (result.data && result.data !== '0x') {
      // Qui potremmo decodificare il risultato
      // Per ora, segnaliamo solo che c'è un output
    }

    return {
      success: true,
      gasUsed: result.gasUsed || 0n,
      returnData: result.data,
      warnings,
    };
  } catch (error: any) {
    // Decodifica l'errore per messaggi utili
    let errorMessage = 'Transaction simulation failed';
    
    if (error.message?.includes('insufficient funds')) {
      errorMessage = 'Insufficient funds for gas + value';
    } else if (error.message?.includes('execution reverted')) {
      errorMessage = 'Transaction will revert — check parameters';
    } else if (error.message?.includes('gas required exceeds')) {
      errorMessage = 'Gas limit exceeded — transaction too complex';
    }

    return {
      success: false,
      gasUsed: 0n,
      errorMessage,
      warnings: [errorMessage],
    };
  }
}
