import { type Address, isAddress } from 'viem';
import type { APIError } from '@/api/types';
import { buildErrorStruct } from '@/api/utils/buildErrorStruct';
import { ApiErrorCode } from '@/api/constants';

const BASESCAN_API_URL = 'https://api.basescan.org/api';

export type WalletRisk = {
  risk: 'low' | 'medium' | 'high';
  flags: string[];
  isContract: boolean;
  txCount: number;
  firstTxDate?: string;
  lastTxDate?: string;
  totalReceived?: string;
  totalSent?: string;
};

type BaseScanTxResponse = {
  status: string;
  message: string;
  result: Array<{
    hash: string;
    timeStamp: string;
    from: string;
    to: string;
    value: string;
    txreceipt_status: string;
  }>;
};

export async function getWalletRisk(
  address: string,
  apiKey?: string,
): Promise<WalletRisk | APIError> {
  if (!isAddress(address)) {
    return buildErrorStruct({
      code: ApiErrorCode.AMGTa01,
      error: 'Invalid address',
      message: 'Address must be a valid Ethereum address',
    });
  }

  try {
    // Fetch transaction history
    const params = new URLSearchParams({
      module: 'account',
      action: 'txlist',
      address,
      startblock: '0',
      endblock: '99999999',
      sort: 'asc',
      ...(apiKey && { apikey: apiKey }),
    });

    const response = await fetch(`${BASESCAN_API_URL}?${params}`);
    const data: BaseScanTxResponse = await response.json();

    const flags: string[] = [];
    let risk: 'low' | 'medium' | 'high' = 'low';

    // Analyze transaction history
    if (data.status !== '1' || !data.result) {
      flags.push('unknown_history');
      risk = 'medium';
    } else {
      const txs = data.result;
      
      if (txs.length === 0) {
        flags.push('new_wallet');
        flags.push('never_received');
        risk = 'high';
      } else {
        const received = txs.filter(tx => tx.to.toLowerCase() === address.toLowerCase());
        const sent = txs.filter(tx => tx.from.toLowerCase() === address.toLowerCase());

        if (received.length === 0) {
          flags.push('never_received');
          risk = 'high';
        }

        if (txs.length < 5) {
          flags.push('low_activity');
          risk = Math.max(risk === 'low' ? 0 : risk === 'medium' ? 1 : 2, 1) as any;
        }

        // Check for high volume (potential mixer/scam)
        const totalVolume = txs.reduce((sum, tx) => sum + BigInt(tx.value), 0n);
        if (totalVolume > parseEther('1000')) {
          flags.push('high_volume');
        }
      }
    }

    // Check if contract
    const isContract = await checkIsContract(address);

    return {
      risk,
      flags,
      isContract,
      txCount: data.result?.length ?? 0,
      firstTxDate: data.result?.[0]?.timeStamp 
        ? new Date(parseInt(data.result[0].timeStamp) * 1000).toISOString() 
        : undefined,
      lastTxDate: data.result?.[data.result.length - 1]?.timeStamp
        ? new Date(parseInt(data.result[data.result.length - 1].timeStamp) * 1000).toISOString()
        : undefined,
    };
  } catch (error) {
    return buildErrorStruct({
      code: ApiErrorCode.AMGTa02,
      error: JSON.stringify(error),
      message: 'Failed to analyze wallet risk',
    });
  }
}

async function checkIsContract(address: string): Promise<boolean> {
  try {
    const params = new URLSearchParams({
      module: 'contract',
      action: 'getabi',
      address,
    });
    
    const response = await fetch(`${BASESCAN_API_URL}?${params}`);
    const data = await response.json();
    
    return data.status === '1' && data.result !== 'Contract source code not verified';
  } catch {
    return false;
  }
}

function parseEther(value: string): bigint {
  return BigInt(Math.floor(parseFloat(value) * 1e18));
}
