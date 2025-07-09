'use client';

import { useTheme } from '@/internal/hooks/useTheme';
import { Spinner } from '@/internal/components/Spinner';
import { background, cn, color, text } from '@/styles/theme';
import type { SubscribeStatusReact } from '../types';
import { useSubscribeContext } from './SubscribeProvider';
import {
  formatSubscriptionAmount,
  formatPeriodShort,
} from '../utils/formatAmount';
import { SUBSCRIBE_LIFECYCLE_STATUS, MAX_UINT48 } from '../constants';

export function SubscribeStatus({ className }: SubscribeStatusReact) {
  const componentTheme = useTheme();
  const { lifecycleStatus, isCheckingPermissions } = useSubscribeContext();

  // Don't render anything if in initial state
  if (lifecycleStatus.statusName === SUBSCRIBE_LIFECYCLE_STATUS.INIT) {
    return null;
  }

  // Checking permissions state
  if (isCheckingPermissions) {
    return (
      <div
        className={cn(
          componentTheme,
          'flex items-center justify-center p-3 rounded-lg',
          background.alternate,
          color.foreground,
          className,
        )}
        data-testid="ockSubscribeStatus-checking"
      >
        <Spinner />
      </div>
    );
  }

  // Loading state
  if (lifecycleStatus.statusName === SUBSCRIBE_LIFECYCLE_STATUS.LOADING) {
    return (
      <div
        className={cn(
          componentTheme,
          'flex items-center gap-2 p-3 rounded-lg',
          background.alternate,
          color.foreground,
          className,
        )}
        data-testid="ockSubscribeStatus-loading"
      >
        <Spinner />
        <span className={cn(text.body)}>Processing...</span>
      </div>
    );
  }

  // Signing state - don't render anything, let button handle the UX
  if (lifecycleStatus.statusName === SUBSCRIBE_LIFECYCLE_STATUS.SIGNING) {
    return null;
  }

  // Already subscribed state (covers both new and existing subscriptions)
  if (lifecycleStatus.statusName === SUBSCRIBE_LIFECYCLE_STATUS.SUBSCRIBED) {
    const { subscriptionData, existingPermission } = lifecycleStatus.statusData;
    const createdDate = new Date(
      existingPermission.createdAt * 1000,
    ).toLocaleDateString();
    const formattedAmount = formatSubscriptionAmount(
      subscriptionData.amount,
      subscriptionData.token,
    );
    const period = formatPeriodShort(subscriptionData.interval);

    // Format end date if subscription has an end time
    const hasEndDate =
      existingPermission.spendPermission.end &&
      BigInt(existingPermission.spendPermission.end) < MAX_UINT48;
    const endDate = hasEndDate
      ? new Date(
          existingPermission.spendPermission.end * 1000,
        ).toLocaleDateString()
      : null;

    return (
      <div
        className={cn(
          componentTheme,
          'p-3 rounded-lg',
          background.success,
          color.inverse,
          className,
        )}
        data-testid="ockSubscribeStatus-subscribed"
      >
        <div className={cn(text.headline, 'mb-1')}>Subscribed</div>
        <div className={cn(text.body, 'opacity-90')}>
          Subscribed to {formattedAmount}/{period}
        </div>
        <div className={cn(text.caption, 'opacity-75')}>
          Subscribed on {createdDate}
          {endDate && ` ending on ${endDate}`}
        </div>
      </div>
    );
  }

  // Error state
  if (lifecycleStatus.statusName === SUBSCRIBE_LIFECYCLE_STATUS.ERROR) {
    const { message } = lifecycleStatus.statusData;

    return (
      <div
        className={cn(
          componentTheme,
          'p-3 rounded-lg',
          background.error,
          color.inverse,
          className,
        )}
        data-testid="ockSubscribeStatus-error"
      >
        <div className={cn(text.headline, 'mb-1')}>Subscription Failed</div>
        <div className={cn(text.body, 'opacity-90')}>{message}</div>
      </div>
    );
  }

  return null;
}
