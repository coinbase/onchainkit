import { useCallback } from 'react';
import type { Address, ContractFunctionParameters } from 'viem';
import { buildPayTransaction } from '../../api';
import { getCommerceContracts } from '../utils/getCommerceContracts';

type UseCommerceContractsParams = {
  address?: Address;
  chainId: number;
  chargeId: string;
  contractsRef: React.MutableRefObject<
    ContractFunctionParameters[] | undefined
  >;
};

export const useCommerceContracts = ({
  address,
  chainId,
  chargeId,
  contractsRef,
}: UseCommerceContractsParams) => {
  return useCallback(async () => {
    if (!address) return;

    try {
      const response = await buildPayTransaction({
        address,
        chainId,
        chargeId,
      });

      if ('error' in response) {
        console.error('Error in Commerce API call:', response.error);
        return;
      }

      const commerceContracts = getCommerceContracts({
        transaction: response,
      });
      contractsRef.current = commerceContracts;
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  }, [address, contractsRef, chainId, chargeId]);
};
