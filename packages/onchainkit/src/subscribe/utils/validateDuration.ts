// 🌲☀🌲
import type { Duration } from '../types';
import { calculateDurationInSeconds } from './calculateDuration';

/**
 * Validates a Duration object
 * @param duration - Duration to validate
 * @param fieldName - Name of the field for error messages
 * @throws Error if duration is invalid
 */
export function validateDuration(
  duration: Duration,
  fieldName = 'Duration',
): void {
  // Check if duration is empty
  const hasAnyValue = Object.values(duration).some(
    (value) => typeof value === 'number' && value > 0,
  );

  if (!hasAnyValue) {
    throw new Error(`${fieldName} must specify at least one time unit`);
  }

  // Check for negative values
  Object.entries(duration).forEach(([unit, value]) => {
    if (typeof value === 'number' && value < 0) {
      throw new Error(`${fieldName} ${unit} cannot be negative`);
    }
  });

  // Check for non-integer values
  Object.entries(duration).forEach(([unit, value]) => {
    if (typeof value === 'number' && !Number.isInteger(value)) {
      throw new Error(`${fieldName} ${unit} must be an integer`);
    }
  });

  // Check minimum duration (1 second)
  const totalSeconds = calculateDurationInSeconds(duration);
  if (totalSeconds < 1) {
    throw new Error(`${fieldName} must be at least 1 second`);
  }

  // Check maximum duration (to prevent overflow)
  const MAX_DURATION_SECONDS = 2147483647; // Max int32
  if (totalSeconds > MAX_DURATION_SECONDS) {
    throw new Error(`${fieldName} exceeds maximum allowed duration`);
  }
}

/**
 * Validates that interval is reasonable for subscriptions
 * @param interval - Interval duration to validate
 */
export function validateSubscriptionInterval(interval: Duration): void {
  validateDuration(interval, 'Subscription interval');

  const intervalSeconds = calculateDurationInSeconds(interval);

  // Minimum interval of 1 minute for subscriptions
  if (intervalSeconds < 60) {
    throw new Error('Subscription interval must be at least 1 minute');
  }

  // Maximum interval of 1 year for subscriptions
  if (intervalSeconds > 31556952) {
    throw new Error('Subscription interval cannot exceed 1 year');
  }

  // Coinbase Wallet requires periods to be divisible by 86400 (1 day)
  // This ensures compatibility with the spend permission system
  if (intervalSeconds % 86400 !== 0) {
    throw new Error(
      'Subscription interval must be in whole days (e.g., 1 day, 7 days, 30 days)',
    );
  }
}

/**
 * Validates subscription length against interval
 * @param subscriptionLength - Total subscription duration
 * @param interval - Period interval
 */
export function validateSubscriptionLength(
  subscriptionLength: Duration,
  interval: Duration,
): void {
  validateDuration(subscriptionLength, 'Subscription length');

  const subscriptionSeconds = calculateDurationInSeconds(subscriptionLength);
  const intervalSeconds = calculateDurationInSeconds(interval);

  // Subscription length must be at least one interval
  if (subscriptionSeconds < intervalSeconds) {
    throw new Error('Subscription length must be at least one interval period');
  }

  // Calculate number of periods
  const periodCount = Math.floor(subscriptionSeconds / intervalSeconds);

  // Maximum of 1000 periods to prevent excessive allowances
  if (periodCount > 1000) {
    throw new Error(
      'Subscription length results in too many periods (max: 1000)',
    );
  }
}
