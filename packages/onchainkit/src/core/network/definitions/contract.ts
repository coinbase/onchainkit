// Basescan API endpoints for contract verification and info
export const BASESCAN_API_URL = 'https://api.basescan.org/api';

export type BaseScanContractParams = {
  module: 'contract';
  action: 'getabi' | 'getsourcecode' | 'getcontractcreation';
  address: string;
  apikey?: string;
};

export type BaseScanContractResponse = {
  status: string;
  message: string;
  result: Array<{
    ABI: string;
    SourceCode: string;
    ContractName: string;
    CompilerVersion: string;
    OptimizationUsed: string;
    Runs: string;
    ConstructorArguments: string;
    EVMVersion: string;
    Library: string;
    LicenseType: string;
    Proxy: string;
    Implementation: string;
    SwarmSource: string;
  }>;
};
