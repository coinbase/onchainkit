import type { APIError } from '@/api/types';
import { buildErrorStruct } from '@/api/utils/buildErrorStruct';
import { ApiErrorCode } from '@/api/constants';
import { BASESCAN_API_URL } from '@/core/network/definitions/contract';

export type ContractVerificationData = {
  isVerified: boolean;
  isProxy: boolean;
  proxyTarget: string | null;
  contractName: string | null;
  sourceCode: string | null;
  compilerVersion: string | null;
  deployedAt: number | null;
  deployer: string | null;
  risk: 'low' | 'medium' | 'high';
  warnings: string[];
};

type BaseScanApiResponse = {
  status: string;
  message: string;
  result: Array<{
    ABI: string;
    SourceCode: string;
    ContractName: string;
    CompilerVersion: string;
    Proxy: string;
    Implementation: string;
  }>;
};

type BaseScanCreationResponse = {
  status: string;
  message: string;
  result: Array<{
    contractAddress: string;
    contractCreator: string;
    txHash: string;
  }>;
};

export async function getContractVerification(
  address: string,
  apiKey?: string,
): Promise<ContractVerificationData | APIError> {
  if (!address || address.length !== 42) {
    return buildErrorStruct({
      code: ApiErrorCode.AMGTa01,
      error: 'Invalid address',
      message: 'Contract address must be a valid 42-character hex string',
    });
  }

  try {
    // Fetch source code & proxy info
    const verifyParams = new URLSearchParams({
      module: 'contract',
      action: 'getsourcecode',
      address,
      ...(apiKey && { apikey: apiKey }),
    });

    const verifyRes = await fetch(`${BASESCAN_API_URL}?${verifyParams}`);
    const verifyData: BaseScanApiResponse = await verifyRes.json();

    if (verifyData.status !== '1' || !verifyData.result?.[0]) {
      return buildErrorStruct({
        code: ApiErrorCode.AMGTa01,
        error: verifyData.message,
        message: 'Failed to fetch contract verification data',
      });
    }

    const contractInfo = verifyData.result[0];
    const isVerified = contractInfo.ABI !== 'Contract source code not verified';
    const isProxy = contractInfo.Proxy === '1';
    const proxyTarget = isProxy ? contractInfo.Implementation : null;

    // Fetch creation info (deployer, block)
    const creationParams = new URLSearchParams({
      module: 'contract',
      action: 'getcontractcreation',
      contractaddresses: address,
      ...(apiKey && { apikey: apiKey }),
    });

    const creationRes = await fetch(`${BASESCAN_API_URL}?${creationParams}`);
    const creationData: BaseScanCreationResponse = await creationRes.json();

    const deployer = creationData.status === '1' 
      ? creationData.result?.[0]?.contractCreator 
      : null;

    // Risk scoring
    const warnings: string[] = [];
    let risk: 'low' | 'medium' | 'high' = 'low';

    if (!isVerified) {
      risk = 'high';
      warnings.push('Contract source code is not verified');
    }
    if (isProxy && !proxyTarget) {
      risk = 'high';
      warnings.push('Proxy contract without verified implementation');
    }
    if (contractInfo.SourceCode?.includes('selfdestruct')) {
      risk = 'high';
      warnings.push('Contract contains selfdestruct');
    }

    return {
      isVerified,
      isProxy,
      proxyTarget,
      contractName: contractInfo.ContractName || null,
      sourceCode: isVerified ? contractInfo.SourceCode : null,
      compilerVersion: contractInfo.CompilerVersion || null,
      deployedAt: null, // Would need additional block lookup
      deployer,
      risk,
      warnings,
    };
  } catch (error) {
    return buildErrorStruct({
      code: ApiErrorCode.AMGTa02,
      error: JSON.stringify(error),
      message: 'Something went wrong while verifying contract',
    });
  }
}
