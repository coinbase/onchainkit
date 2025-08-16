'use client';

import type { APIError } from '@/api/types';
import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';
import { useValue } from '@/internal/hooks/useValue';
import { GENERIC_ERROR_MESSAGE } from '@/transaction/constants';
import { isUserRejectedRequestError } from '@/transaction/utils/isUserRejectedRequestError';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useAccount, useSignTypedData, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'viem/chains';
import type { Chain } from 'viem';
import {
  SPEND_PERMISSION_ERC712_DOMAIN,
  SPEND_PERMISSION_ERC712_TYPES,
  SPEND_PERMISSION_MANAGER_ADDRESS,
  SUBSCRIBE_LIFECYCLE_STATUS,
} from '../constants';
import type {
  SubscribeContextType,
  SubscribeLifecycleStatus,
  SubscribeProviderReact,
  SubscribeSuccessResult,
} from '../types';
import {
  buildSpendPermission,
  validateSpendPermission,
} from '../utils/buildSpendPermission';
import { useSubscriptionPermissions } from '../hooks/useSubscriptionPermissions';
import { getPermissionStatus } from '../utils/getCurrentPeriod';
import { calculatePermissionHash } from '../utils/calculatePermissionHash';

const EMPTY_CONTEXT = {} as SubscribeContextType;

const SubscribeContext = createContext<SubscribeContextType>(EMPTY_CONTEXT);

// Helper to convert chainId to Chain object
function getChainFromId(chainId: number): Chain {
  switch (chainId) {
    case base.id:
      return base;
    case baseSepolia.id:
      return baseSepolia;
    default:
      return base; // Default to base mainnet
  }
}

export function useSubscribeContext() {
  const context = useContext(SubscribeContext);
  if (context === EMPTY_CONTEXT) {
    throw new Error(
      'useSubscribeContext must be used within a SubscribeProvider',
    );
  }
  return context;
}

export function SubscribeProvider({
  children,
  amount,
  token,
  interval,
  spender,
  subscriptionLength,
  extraData,
  salt,
  onSuccess,
  onError,
  onStatus,
}: SubscribeProviderReact) {
  const { address, chainId } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const { switchChainAsync } = useSwitchChain();

  const [lifecycleStatus, updateLifecycleStatusInternal] =
    useLifecycleStatus<SubscribeLifecycleStatus>({
      statusName: SUBSCRIBE_LIFECYCLE_STATUS.INIT,
      statusData: null,
    });

  const updateLifecycleStatus = useCallback(
    (status: SubscribeLifecycleStatus) => {
      updateLifecycleStatusInternal(status);
      onStatusRef.current?.(status);
    },
    [updateLifecycleStatusInternal],
  );

  const processedPermissionHashRef = useRef<string | null>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onStatusRef = useRef(onStatus);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;
  onStatusRef.current = onStatus;

  // Reset processed permission hash when key parameters change
  useEffect(() => {
    processedPermissionHashRef.current = null;
  }, [address, spender, token.address, amount, interval]);
  const {
    existingPermission,
    isLoading: isCheckingPermissions,
    error: permissionsError,
    refetch: refetchPermissions,
  } = useSubscriptionPermissions({
    account: address,
    chainId: token.chainId || chainId,
    spender,
    token,
    amount,
    interval,
  });
  useEffect(() => {
    if (
      existingPermission &&
      lifecycleStatus.statusName === SUBSCRIBE_LIFECYCLE_STATUS.INIT
    ) {
      const permissionHash = existingPermission.permissionHash;

      // Check if we've already processed this permission hash
      if (processedPermissionHashRef.current === permissionHash) {
        return;
      }
      processedPermissionHashRef.current = permissionHash;
      const spendPermission = {
        account: existingPermission.spendPermission.account as `0x${string}`,
        spender: existingPermission.spendPermission.spender as `0x${string}`,
        token: existingPermission.spendPermission.token as `0x${string}`,
        allowance: BigInt(existingPermission.spendPermission.allowance),
        period: existingPermission.spendPermission.period,
        start: existingPermission.spendPermission.start,
        end: existingPermission.spendPermission.end,
        salt: BigInt(existingPermission.spendPermission.salt),
        extraData: existingPermission.spendPermission
          .extraData as `0x${string}`,
      };
      updateLifecycleStatus({
        statusName: SUBSCRIBE_LIFECYCLE_STATUS.SUBSCRIBED,
        statusData: {
          existingPermission,
          subscriptionData: {
            amount,
            token,
            interval,
            spender,
            subscriptionLength,
            extraData,
            salt,
          },
        },
      });
      const result: SubscribeSuccessResult = {
        signature: existingPermission.signature as `0x${string}`,
        spendPermission,
        permissionHash: existingPermission.permissionHash,
        currentPeriod: undefined, // Will be updated if fetched successfully
        isExistingPermission: true,
        metadata: {
          amount,
          token,
          interval,
          spender,
          subscriptionLength,
          extraData,
        },
      };
      onSuccessRef.current?.(result);
      const fetchCurrentPeriodInBackground = async () => {
        try {
          await getPermissionStatus(
            spendPermission,
            getChainFromId(token.chainId || chainId || 1),
          );
        } catch (error) {
          // Log error in development for debugging
          if (process.env.NODE_ENV !== 'production') {
            console.debug(
              'Failed to fetch current period data (non-critical):',
              error,
            );
          }
        }
      };

      // Run background fetch without awaiting
      fetchCurrentPeriodInBackground();
    }
  }, [
    existingPermission,
    lifecycleStatus.statusName,
    amount,
    token,
    interval,
    spender,
    subscriptionLength,
    extraData,
    salt,
    chainId,
    updateLifecycleStatus,
    // Note: onSuccess removed from dependencies to prevent duplicate execution
    // The processedPermissionHashRef guard ensures we only process each permission once
  ]);

  function handleError(err: unknown) {
    const errorMessage = isUserRejectedRequestError(err)
      ? 'Request denied.'
      : GENERIC_ERROR_MESSAGE;

    const errorData: APIError = {
      code: 'SuPr03', // Subscribe Provider 03 error
      error: JSON.stringify(err),
      message: errorMessage,
    };

    updateLifecycleStatus({
      statusName: SUBSCRIBE_LIFECYCLE_STATUS.ERROR,
      statusData: errorData,
    });

    onErrorRef.current?.(errorData);
  }

  async function refresh(): Promise<void> {
    // Reset the processed permission hash to allow reprocessing
    processedPermissionHashRef.current = null;
    // Refetch permissions data
    await refetchPermissions();
  }

  async function handleSubscribe(): Promise<void> {
    if (!address) {
      handleError(new Error('Wallet not connected'));
      return;
    }

    // If there's already an existing permission, don't create a new one
    if (existingPermission) {
      updateLifecycleStatus({
        statusName: SUBSCRIBE_LIFECYCLE_STATUS.SUBSCRIBED,
        statusData: {
          existingPermission,
          subscriptionData: {
            amount,
            token,
            interval,
            spender,
            subscriptionLength,
            extraData,
            salt,
          },
        },
      });
      return;
    }

    updateLifecycleStatus({
      statusName: SUBSCRIBE_LIFECYCLE_STATUS.LOADING,
      statusData: {},
    });

    try {
      // Check if we need to switch chains based on token
      if (token.chainId && chainId !== token.chainId) {
        try {
          await switchChainAsync({ chainId: token.chainId });
        } catch {
          const switchError = new Error(
            `Please switch to the correct network for ${token.symbol}`,
          );
          handleError(switchError);
          return;
        }
      }

      // Build the spend permission
      const spendPermission = buildSpendPermission({
        account: address,
        spender,
        amount,
        token,
        interval,
        subscriptionLength,
        extraData,
        salt,
      });

      // Validate the spend permission
      validateSpendPermission(spendPermission);

      updateLifecycleStatus({
        statusName: SUBSCRIBE_LIFECYCLE_STATUS.SIGNING,
        statusData: {},
      });

      // Sign the spend permission
      const signature = await signTypedDataAsync({
        domain: {
          ...SPEND_PERMISSION_ERC712_DOMAIN,
          chainId: token.chainId || chainId,
          verifyingContract: SPEND_PERMISSION_MANAGER_ADDRESS,
        },
        types: SPEND_PERMISSION_ERC712_TYPES,
        primaryType: 'SpendPermission',
        message: spendPermission,
      });

      // Calculate permission hash for new subscription
      const permissionHash = calculatePermissionHash(
        spendPermission,
        token.chainId || chainId || 1,
      );

      // Create success result (current period data not needed for UI)
      const result: SubscribeSuccessResult = {
        signature,
        spendPermission,
        permissionHash,
        currentPeriod: undefined, // Not needed for component display
        isExistingPermission: false,
        metadata: {
          amount,
          token,
          interval,
          spender,
          subscriptionLength,
          extraData,
        },
      };

      // Create a mock existingPermission structure for new subscriptions
      const mockExistingPermission = {
        spendPermission: {
          account: spendPermission.account,
          spender: spendPermission.spender,
          token: spendPermission.token,
          allowance: spendPermission.allowance.toString(),
          period: spendPermission.period,
          start: spendPermission.start,
          end: spendPermission.end,
          salt: spendPermission.salt.toString(),
          extraData: spendPermission.extraData,
        },
        signature,
        permissionHash,
        createdAt: Math.floor(Date.now() / 1000), // Current timestamp
      };

      updateLifecycleStatus({
        statusName: SUBSCRIBE_LIFECYCLE_STATUS.SUBSCRIBED,
        statusData: {
          existingPermission: mockExistingPermission,
          subscriptionData: {
            amount,
            token,
            interval,
            spender,
            subscriptionLength,
            extraData,
            salt,
          },
        },
      });

      onSuccessRef.current?.(result);

      // Optionally fetch current period data in the background (not blocking)
      const fetchCurrentPeriodInBackground = async () => {
        try {
          await getPermissionStatus(
            spendPermission,
            getChainFromId(token.chainId || chainId || 1),
          );
          // Current period data fetched but not used by components
        } catch (error) {
          // Log error in development for debugging
          if (process.env.NODE_ENV !== 'production') {
            console.debug(
              'Failed to fetch current period data (non-critical):',
              error,
            );
          }
        }
      };

      // Run background fetch without awaiting
      fetchCurrentPeriodInBackground();
    } catch (err) {
      handleError(err);
    }
  }

  const spendPermission = useMemo(() => {
    if (lifecycleStatus.statusName === SUBSCRIBE_LIFECYCLE_STATUS.SUBSCRIBED) {
      return {
        account: lifecycleStatus.statusData.existingPermission.spendPermission
          .account as `0x${string}`,
        spender: lifecycleStatus.statusData.existingPermission.spendPermission
          .spender as `0x${string}`,
        token: lifecycleStatus.statusData.existingPermission.spendPermission
          .token as `0x${string}`,
        allowance: BigInt(
          lifecycleStatus.statusData.existingPermission.spendPermission
            .allowance,
        ),
        period:
          lifecycleStatus.statusData.existingPermission.spendPermission.period,
        start:
          lifecycleStatus.statusData.existingPermission.spendPermission.start,
        end: lifecycleStatus.statusData.existingPermission.spendPermission.end,
        salt: BigInt(
          lifecycleStatus.statusData.existingPermission.spendPermission.salt,
        ),
        extraData: lifecycleStatus.statusData.existingPermission.spendPermission
          .extraData as `0x${string}`,
      };
    }
    return undefined;
  }, [lifecycleStatus]);

  const signature = useMemo(() => {
    if (lifecycleStatus.statusName === SUBSCRIBE_LIFECYCLE_STATUS.SUBSCRIBED) {
      return lifecycleStatus.statusData.existingPermission
        .signature as `0x${string}`;
    }
    return undefined;
  }, [lifecycleStatus]);

  const value = useValue<SubscribeContextType>({
    amount,
    token,
    interval,
    spender,
    subscriptionLength,
    extraData,
    salt,
    lifecycleStatus,
    spendPermission,
    signature,
    existingPermission,
    isCheckingPermissions,
    permissionsError,
    handleSubscribe,
    updateLifecycleStatus,
    refresh,
  });

  return (
    <SubscribeContext.Provider value={value}>
      {children}
    </SubscribeContext.Provider>
  );
}
