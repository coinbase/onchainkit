'use client';

import { useTheme } from '@/internal/hooks/useTheme';
import { Spinner } from '@/internal/components/Spinner';
import { background, cn, color, pressable, text } from '@/styles/theme';
import { useCallback, useMemo } from 'react';
import type {
  SubscribeButtonReact,
  FetchPermissionsResultItem,
  Duration,
} from '../types';
import type { Token } from '@/token';
import { useSubscribeContext } from './SubscribeProvider';
import { SUBSCRIBE_LIFECYCLE_STATUS } from '../constants';
import { formatSubscriptionText } from '../utils/formatAmount';

function getButtonText(
  buttonText: string | undefined,
  amount: string,
  token: Token,
  interval: Duration,
  isSigning: boolean,
  isSuccess: boolean,
  isSubscribed: boolean,
  showSpinner: boolean,
) {
  const defaultText =
    buttonText || formatSubscriptionText(amount, token, interval);

  if (isSigning) {
    return 'Signing';
  }

  if (!showSpinner && (isSuccess || isSubscribed)) {
    return 'Subscribed';
  }

  return defaultText;
}

function shouldShowSpinner(
  isCheckingPermissions: boolean | undefined,
  isLoading: boolean,
  isSigning: boolean,
  existingPermission: FetchPermissionsResultItem | null | undefined,
  isInit: boolean,
) {
  if (isCheckingPermissions) {
    return true;
  }

  if (isLoading) {
    return true;
  }

  if (isSigning) {
    return true;
  }

  if (existingPermission && isInit) {
    return true;
  }

  return false;
}

function getButtonClasses(
  componentTheme: string,
  isDisabled: boolean,
  isSuccess: boolean,
  isSubscribed: boolean,
  className?: string,
) {
  const successClasses =
    isSuccess || isSubscribed
      ? [
          background.success,
          'hover:bg-[var(--ock-bg-success)]',
          'active:bg-[var(--ock-bg-success)]',
        ]
      : [];

  return cn(
    componentTheme,
    pressable.primary,
    'relative w-full rounded-xl min-w-0',
    'px-4 py-3 font-medium text-base leading-6',
    text.headline,
    color.inverse,
    isDisabled && pressable.disabled,
    successClasses,
    className,
  );
}

export function SubscribeButton({
  text: buttonText,
  className,
  disabled = false,
}: SubscribeButtonReact) {
  const componentTheme = useTheme();
  const {
    lifecycleStatus,
    handleSubscribe,
    isCheckingPermissions,
    existingPermission,
    amount,
    token,
    interval,
  } = useSubscribeContext();

  const isInit = lifecycleStatus.statusName === SUBSCRIBE_LIFECYCLE_STATUS.INIT;
  const isLoading =
    lifecycleStatus.statusName === SUBSCRIBE_LIFECYCLE_STATUS.LOADING;
  const isSigning =
    lifecycleStatus.statusName === SUBSCRIBE_LIFECYCLE_STATUS.SIGNING;
  const isSuccess =
    lifecycleStatus.statusName === SUBSCRIBE_LIFECYCLE_STATUS.SUCCESS;
  const isSubscribed =
    lifecycleStatus.statusName === SUBSCRIBE_LIFECYCLE_STATUS.SUBSCRIBED;
  const isDisabled =
    disabled || isLoading || isSigning || isSuccess || isSubscribed;

  const handleClick = useCallback(async () => {
    if (!isDisabled && !isSubscribed && !isSuccess) {
      await handleSubscribe();
    }
  }, [handleSubscribe, isDisabled, isSubscribed, isSuccess]);

  const showSpinner = shouldShowSpinner(
    isCheckingPermissions,
    isLoading,
    isSigning,
    existingPermission,
    isInit,
  );

  const displayText = useMemo(
    () =>
      getButtonText(
        buttonText,
        amount,
        token,
        interval,
        isSigning,
        isSuccess,
        isSubscribed,
        showSpinner,
      ),
    [
      buttonText,
      amount,
      token,
      interval,
      isSigning,
      isSuccess,
      isSubscribed,
      showSpinner,
    ],
  );

  const buttonClasses = getButtonClasses(
    componentTheme,
    isDisabled,
    isSuccess,
    isSubscribed,
    className,
  );

  const shouldShowText = (showSpinner && isSigning) || !showSpinner;

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={isDisabled}
      type="button"
      data-testid="ockSubscribeButton"
    >
      <div className="flex items-center justify-center gap-2 min-h-[1.5rem]">
        {showSpinner && <Spinner />}
        {shouldShowText && (
          <span
            className={cn(
              text.headline,
              color.inverse,
              'flex justify-center whitespace-nowrap',
            )}
          >
            {displayText}
          </span>
        )}
      </div>
    </button>
  );
}
