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
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const useCommerceContracts = ({
  address,
  chainId,
  chargeId,
  contractsRef,
  setErrorMessage,
}: UseCommerceContractsParams) => {
  return useCallback(async () => {
    if (!address) return;

    try {
      const response = await buildPayTransaction({
        address,
        chargeId,
      });

      if ('error' in response) {
        setErrorMessage(response.error);
        return;
      }

      const commerceContracts = getCommerceContracts({
        transaction: response,
      });
      contractsRef.current = commerceContracts;
    } catch (error) {
      console.error('Unexpected error fetching contracts:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  }, [address, contractsRef, chainId, chargeId]);
};
