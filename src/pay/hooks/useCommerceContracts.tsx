import { useCallback } from 'react';
import {
  type Address,
  type ContractFunctionParameters,
  formatUnits,
} from 'viem';
import { useConfig } from 'wagmi';
import { buildPayTransaction } from '../../api';
import { getCommerceContracts } from '../utils/getCommerceContracts';
import { getUSDCBalance } from '../utils/getUSDCBalance';

type UseCommerceContractsParams = {
  address?: Address;
  chargeHandler: () => Promise<string>;
  contractsRef: React.MutableRefObject<
    ContractFunctionParameters[] | undefined
  >;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  userHasInsufficientBalanceRef: React.MutableRefObject<boolean>;
};

export const useCommerceContracts = ({
  address,
  chargeHandler,
  contractsRef,
  setErrorMessage,
  userHasInsufficientBalanceRef,
}: UseCommerceContractsParams) => {
  const config = useConfig();

  return useCallback(async () => {
    if (!address) {
      return;
    }

    try {
      const chargeId = await chargeHandler();
      const response = await buildPayTransaction({
        address,
        chargeId,
      });

      if ('error' in response) {
        setErrorMessage(response.error);
        return;
      }

      // Set commerce contracts
      const commerceContracts = getCommerceContracts({
        transaction: response,
      });
      contractsRef.current = commerceContracts;

      // Calculate price
      const usdcBalance = await getUSDCBalance({
        address,
        config,
      });
      const priceInUSDC = formatUnits(
        BigInt(response.callData.feeAmount) +
          BigInt(response.callData.recipientAmount),
        6,
      );

      // Set insufficient balance if applicable
      userHasInsufficientBalanceRef.current =
        Number.parseFloat(usdcBalance) < Number.parseFloat(priceInUSDC);
    } catch (error) {
      console.error('Unexpected error fetching contracts:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  }, [address, contractsRef, chargeHandler]);
};
