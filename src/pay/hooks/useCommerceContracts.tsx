import { useCallback } from 'react';
import { formatUnits } from 'viem';
import { useConfig } from 'wagmi';
import { type BuildPayTransactionParams, buildPayTransaction } from '../../api';
import type { UseCommerceContractsParams } from '../types';
import { getCommerceContracts } from '../utils/getCommerceContracts';
import { getUSDCBalance } from '../utils/getUSDCBalance';

export const useCommerceContracts = ({
  address,
  chargeIdRef,
  contractsRef,
  chargeHandler,
  productId,
  setErrorMessage,
  userHasInsufficientBalanceRef,
}: UseCommerceContractsParams) => {
  const config = useConfig();

  return useCallback(async () => {
    if (!address) {
      return;
    }

    const buildPayTransactionParams: BuildPayTransactionParams = {
      address,
    };

    try {
      if (chargeHandler) {
        buildPayTransactionParams.chargeId = await chargeHandler();
      } else if (productId) {
        buildPayTransactionParams.productId = productId;
      }

      const response = await buildPayTransaction(buildPayTransactionParams);

      if ('error' in response) {
        setErrorMessage(response.error);
        return;
      }
      const { id: chargeId } = response;
      console.log('Created chargeId:', chargeId);
      chargeIdRef.current = chargeId;

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
  }, [
    address,
    config,
    chargeIdRef,
    chargeHandler,
    contractsRef,
    productId,
    setErrorMessage,
    userHasInsufficientBalanceRef,
  ]);
};
