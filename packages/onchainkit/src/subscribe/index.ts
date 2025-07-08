// 🌲☀🌲

// Components
export { Subscribe } from './components/Subscribe';
export { SubscribeButton } from './components/SubscribeButton';
export { SubscribeProvider } from './components/SubscribeProvider';
export { SubscribeStatus } from './components/SubscribeStatus';

// Hooks
export { useSubscribeContext } from './components/SubscribeProvider';
export { useSubscriptionStatus } from './hooks/useSubscriptionStatus';
export { useSubscriptionPermissions } from './hooks/useSubscriptionPermissions';

// Utils
export { buildSpendPermission } from './utils/buildSpendPermission';
export {
  calculatePermissionHash,
  type FlexibleSpendPermission,
} from './utils/calculatePermissionHash';
export {
  calculateDurationInSeconds,
  calculatePeriodCount,
} from './utils/calculateDuration';
export {
  fetchPermissions,
  hasMatchingPermission,
} from './utils/fetchPermissions';
export {
  getCurrentPeriod,
  getPermissionStatus,
  isPermissionApproved,
  isPermissionRevoked,
} from './utils/getCurrentPeriod';
export {
  formatSubscriptionAmount,
  formatPeriodShort,
  formatSubscriptionText,
} from './utils/formatAmount';

// Constants
export {
  SPEND_PERMISSION_MANAGER_ADDRESS,
  ETH_TOKEN_ADDRESS,
  SPEND_PERMISSION_ERC712_DOMAIN,
  SPEND_PERMISSION_ERC712_TYPES,
  SUBSCRIBE_LIFECYCLE_STATUS,
} from './constants';
export type { SubscribeLifecycleStatusName } from './constants';

// Types
export type {
  Duration,
  PeriodSpend,
  SpendPermission,
  SubscribeReact,
  SubscribeButtonReact,
  SubscribeStatusReact,
  SubscribeSuccessResult,
  SubscribeLifecycleStatus,
  SubscriptionStatus,
  UseSubscriptionStatusParams,
  UseSubscriptionStatusResult,
  FetchPermissionsRequest,
  FetchPermissionsResult,
  FetchPermissionsResultItem,
  UseSubscriptionPermissionsProps,
  UseSubscriptionPermissionsResult,
} from './types';
