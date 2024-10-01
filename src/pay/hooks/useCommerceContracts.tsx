import { useCallback } from 'react';
import { formatUnits } from 'viem';
import { useConfig } from 'wagmi';
import type { UseCommerceContractsParams } from '../types';
import { getCommerceContracts } from '../utils/getCommerceContracts';
import { getUSDCBalance } from '../utils/getUSDCBalance';
import { handlePayRequest } from '../utils/handlePayRequest';

export const useCommerceContracts = ({
  address,
  chargeHandler,
  productId,
  setErrorMessage,
}: UseCommerceContractsParams) => {
  const config = useConfig();

  return useCallback(async () => {
    if (!address) {
      return { chargeId: '', contracts: null, insufficientBalance: false };
    }

    try {
      // Make Pay request to the appropriate endpoint
      // `productId` for serverless
      // `chargeHandler` for serverful
      const response = await handlePayRequest({
        address,
        chargeHandler,
        productId,
      });

      // Set the `chargeId`
      const { id: chargeId } = response;

      // Retrieve commerce contracts from response
      const contracts = getCommerceContracts({
        transaction: response,
      });

      // Calculate user's USDC balance
      const usdcBalance = await getUSDCBalance({
        address,
        config,
      });
      const priceInUSDC = formatUnits(
        BigInt(response.callData.feeAmount) +
          BigInt(response.callData.recipientAmount),
        6,
      );

      // Set insufficient balance flag, if applicable
      const insufficientBalance =
        Number.parseFloat(usdcBalance) < Number.parseFloat(priceInUSDC);

      return { chargeId, contracts, insufficientBalance };
    } catch (error) {
      console.error('Unexpected error fetching contracts:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
      return { chargeId: '', contracts: null, insufficientBalance: false };
    }
  }, [address, config, chargeHandler, productId, setErrorMessage]);
};
