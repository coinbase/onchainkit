// Basescan API endpoints for transaction history
export const BASESCAN_API_URL = 'https://api.basescan.org/api';

export type BaseScanParams = {
  module: 'account';
  action: 'txlist' | 'txlistinternal';
  address: string;
  startblock?: number;
  endblock?: number;
  page?: number;
  offset?: number;
  sort?: 'asc' | 'desc';
  apikey?: string;
};
