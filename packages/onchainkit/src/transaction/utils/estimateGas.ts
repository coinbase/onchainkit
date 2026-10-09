import { type Address, type Hex, formatEther, parseEther } from 'viem';
import { estimateGas as viemEstimateGas, getGasPrice } from 'viem/actions';
import { type Config, getPublicClient } from '@wagmi/core';
import type { APIError } from '@/api/types';
import { buildErrorStruct } from '@/api/utils/buildErrorStruct';
import { ApiErrorCode } from '@/api/constants';

export type GasEstimate = {
  estimatedFee: string;    // in ETH
  estimatedFeeUsd?: string; // if price available
  maxFee: string;           // worst case (150% buffer)
  gasUnits: bigint;
  gasPrice: bigint;
  isSpike: boolean;         // > 2x median network gas
  isSafe: boolean;          // < 1.2x median
  waitTimeMinutes?: number; // estimated wait for safe window
};

const SPIKE_MULTIPLIER = 2n;
const SAFE_MULTIPLIER = 12n; // 1.2x * 10 for integer math
const MEDIAN_GAS_HISTORY = 20; // blocks to keep for median

// In-memory cache for gas history (per chain)
const gasHistory: Record<number, bigint[]> = {};

export async function estimateGasFee(
  config: Config,
  chainId: number,
  calls?: Array<{ to: Address; data?: Hex; value?: bigint }>,
  maxAcceptableFee?: string,
): Promise<GasEstimate | APIError> {
  try {
    const client = getPublicClient(config, { chainId });
    if (!client) {
      return buildErrorStruct({
        code: ApiErrorCode.AMGTa01,
        error: 'No RPC client',
        message: `Cannot connect to chain ${chainId}`,
      });
    }

    // Get current gas price
    const gasPrice = await getGasPrice(client);
    
    // Update history
    if (!gasHistory[chainId]) gasHistory[chainId] = [];
    gasHistory[chainId].push(gasPrice);
    if (gasHistory[chainId].length > MEDIAN_GAS_HISTORY) {
      gasHistory[chainId].shift();
    }

    // Calculate median
    const sorted = [...gasHistory[chainId]].sort((a, b) => (a < b ? -1 : 1));
    const median = sorted[Math.floor(sorted.length / 2)] || gasPrice;

    // Estimate gas units
    let gasUnits = 21000n; // default transfer
    if (calls && calls.length > 0) {
      // Sum estimates for all calls
      const estimates = await Promise.all(
        calls.map((call) =>
          viemEstimateGas(client, {
            account: call.to, // dummy, will be replaced by real account
            to: call.to,
            data: call.data,
            value: call.value,
          }).catch(() => 50000n) // fallback if estimation fails
        )
      );
      gasUnits = estimates.reduce((a, b) => a + b, 0n);
    }

    // Calculate fees
    const estimatedFeeWei = gasUnits * gasPrice;
    const maxFeeWei = (estimatedFeeWei * 15n) / 10n; // 150% buffer

    // Spike detection
    const isSpike = gasPrice > median * SPIKE_MULTIPLIER;
    const isSafe = gasPrice * 10n <= median * SAFE_MULTIPLIER;

    // Wait time estimation (simple heuristic)
    let waitTimeMinutes: number | undefined;
    if (isSpike) {
      // Estimate based on historical volatility
      const recentAvg = sorted.slice(-5).reduce((a, b) => a + b, 0n) / 5n;
      if (gasPrice > recentAvg * 3n) waitTimeMinutes = 5;
      else if (gasPrice > recentAvg * 2n) waitTimeMinutes = 3;
      else waitTimeMinutes = 1;
    }

    return {
      estimatedFee: formatEther(estimatedFeeWei),
      maxFee: formatEther(maxFeeWei),
      gasUnits,
      gasPrice,
      isSpike,
      isSafe,
      waitTimeMinutes,
    };
  } catch (error) {
    return buildErrorStruct({
      code: ApiErrorCode.AMGTa02,
      error: JSON.stringify(error),
      message: 'Failed to estimate gas',
    });
  }
}
