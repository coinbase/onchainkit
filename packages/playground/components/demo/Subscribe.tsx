import type { APIError } from '@coinbase/onchainkit/api';
import {
  Subscribe,
  type SubscribeLifecycleStatus,
  type SubscribeSuccessResult,
} from '@coinbase/onchainkit/subscribe';
import { usdcToken, ethToken } from '@coinbase/onchainkit/token';
import { useIsWalletACoinbaseSmartWallet } from '@coinbase/onchainkit/wallet';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { getAddress } from 'viem';
import { useAccount } from 'wagmi';
import { AppContext } from '../AppProvider';

// Validation helpers
function validateAmount(amount: string): string | null {
  if (!amount || amount.trim() === '') {
    return 'Amount is required';
  }
  const numericValue = parseFloat(amount);
  if (isNaN(numericValue) || !isFinite(numericValue)) {
    return 'Amount must be a valid number';
  }
  if (numericValue <= 0) {
    return 'Amount must be greater than 0';
  }
  return null;
}

function validateIntervalValue(value: string): string | null {
  if (!value || value.trim() === '') {
    return 'Interval value is required';
  }
  const numericValue = parseInt(value, 10);
  if (isNaN(numericValue) || numericValue <= 0) {
    return 'Interval must be a positive number';
  }
  return null;
}

function validateSpender(address: string): string | null {
  if (!address || address.trim() === '') {
    return 'Spender address is required';
  }
  try {
    getAddress(address);
    return null;
  } catch {
    return 'Invalid spender address format';
  }
}

export default function SubscribeDemo() {
  const {
    subscribeAmount,
    subscribeToken,
    subscribeIntervalValue,
    subscribeIntervalType,
    subscribeSpender,
  } = useContext(AppContext);

  const { address } = useAccount();
  const isSmartWalletConnected = useIsWalletACoinbaseSmartWallet();

  const saltRef = useRef<bigint | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    amount?: string;
    intervalValue?: string;
    spender?: string;
  }>({});

  const token = subscribeToken === 'USDC' ? usdcToken : ethToken;

  const formValidation = useMemo(() => {
    const errors: typeof validationErrors = {};

    const amountError = validateAmount(subscribeAmount || '');
    if (amountError) errors.amount = amountError;

    const intervalError = validateIntervalValue(subscribeIntervalValue || '');
    if (intervalError) errors.intervalValue = intervalError;

    const spenderError = validateSpender(subscribeSpender || '');
    if (spenderError) errors.spender = spenderError;

    const isValid = Object.keys(errors).length === 0;

    setValidationErrors((prev) => {
      const hasChanged = JSON.stringify(prev) !== JSON.stringify(errors);
      return hasChanged ? errors : prev;
    });

    return { errors, isValid };
  }, [subscribeAmount, subscribeIntervalValue, subscribeSpender]);

  const interval = useMemo(() => {
    const value = parseInt(subscribeIntervalValue || '30', 10);
    if (isNaN(value) || value <= 0) {
      return { days: 30 };
    }
    return {
      [subscribeIntervalType || 'days']: value,
    };
  }, [subscribeIntervalType, subscribeIntervalValue]);

  const spender = useMemo(() => {
    const addressToUse =
      subscribeSpender || '0x742d35Cc6635C0532925a3b8D4DDEC5764B72d32';
    try {
      return getAddress(addressToUse);
    } catch {
      return getAddress('0x742d35Cc6635C0532925a3b8D4DDEC5764B72d32');
    }
  }, [subscribeSpender]);

  const extraData = useMemo(() => {
    const timestamp = Date.now();
    const orderData = {
      orderId: `demo-${timestamp}`,
      planType: `${subscribeAmount} ${subscribeToken} every ${subscribeIntervalValue} ${subscribeIntervalType}`,
      timestamp,
    };
    return `0x${Buffer.from(JSON.stringify(orderData)).toString('hex')}` as const;
  }, [
    subscribeAmount,
    subscribeToken,
    subscribeIntervalValue,
    subscribeIntervalType,
  ]);

  const getSalt = useCallback(() => {
    if (!saltRef.current) {
      const randomBytes = new Uint8Array(32);
      crypto.getRandomValues(randomBytes);
      let randomBigInt = 0n;
      for (let i = 0; i < randomBytes.length; i++) {
        randomBigInt = (randomBigInt << 8n) + BigInt(randomBytes[i]);
      }
      saltRef.current = randomBigInt;
    }
    return saltRef.current;
  }, []);

  const buttonText = useMemo(() => {
    const intervalText =
      subscribeIntervalValue === '1'
        ? subscribeIntervalType?.slice(0, -1) || 'day'
        : `${subscribeIntervalValue} ${subscribeIntervalType}`;
    return `Subscribe for ${subscribeAmount} ${subscribeToken}/${intervalText}`;
  }, [
    subscribeAmount,
    subscribeToken,
    subscribeIntervalValue,
    subscribeIntervalType,
  ]);

  const handleOnSuccess = useCallback((result: SubscribeSuccessResult) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🎉 Subscription approved!', result);
      console.log('🔑 Permission Hash:', result.permissionHash);
      console.log('🎲 Salt (nonce):', saltRef.current?.toString());

      try {
        const decoded = JSON.parse(
          Buffer.from(
            result.metadata.extraData?.slice(2) || '',
            'hex',
          ).toString(),
        );
        console.log('📦 Order data:', decoded);
      } catch (error) {
        console.log('Could not decode extraData:', error);
      }
    }

    saltRef.current = null;
  }, []);

  const handleOnError = useCallback((error: APIError) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('❌ Error:', error);
    }

    saltRef.current = null;
  }, []);

  const handleOnStatus = useCallback((status: SubscribeLifecycleStatus) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Status:', status.statusName);
    }
  }, []);

  const isDisabled =
    !formValidation.isValid || !address || !isSmartWalletConnected;

  const walletRequirementNotice = (!address || !isSmartWalletConnected) && (
    <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <div className="mb-2 text-sm font-medium text-yellow-800">
        Coinbase Smart Wallet Required
      </div>
      <div className="text-sm text-yellow-700">
        {!address
          ? 'Connect a Coinbase Smart Wallet to use subscription features'
          : 'Spend permissions require a Coinbase Smart Wallet. Please switch to or create a Smart Wallet to continue.'}
      </div>
    </div>
  );

  const validationErrorsDisplay = Object.keys(validationErrors).length > 0 && (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="mb-2 text-sm font-medium text-red-800">
        Please fix the following errors:
      </div>
      <ul className="text-sm text-red-700 space-y-1">
        {validationErrors.amount && <li>• {validationErrors.amount}</li>}
        {validationErrors.intervalValue && (
          <li>• {validationErrors.intervalValue}</li>
        )}
        {validationErrors.spender && <li>• {validationErrors.spender}</li>}
      </ul>
    </div>
  );

  return (
    <div className="mx-auto max-w-md">
      {walletRequirementNotice}
      {validationErrorsDisplay}

      <Subscribe
        amount={subscribeAmount || '10'}
        token={token}
        interval={interval}
        spender={spender}
        extraData={extraData}
        salt={getSalt()}
        buttonText={buttonText}
        disabled={isDisabled}
        onSuccess={handleOnSuccess}
        onError={handleOnError}
        onStatus={handleOnStatus}
      />
    </div>
  );
}
