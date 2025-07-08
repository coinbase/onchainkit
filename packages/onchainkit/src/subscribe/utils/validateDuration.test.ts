import { describe, expect, it } from 'vitest';
import {
  validateDuration,
  validateSubscriptionInterval,
  validateSubscriptionLength,
} from './validateDuration';
import type { Duration } from '../types';

describe('validateDuration', () => {
  it('should pass for valid durations', () => {
    expect(() => validateDuration({ days: 1 })).not.toThrow();
    expect(() => validateDuration({ hours: 2, minutes: 30 })).not.toThrow();
    expect(() => validateDuration({ seconds: 1 })).not.toThrow();
  });

  it('should throw for empty duration', () => {
    expect(() => validateDuration({})).toThrow(
      'Duration must specify at least one time unit',
    );
  });

  it('should throw for negative values', () => {
    expect(() => validateDuration({ days: -1 })).toThrow(
      'Duration must specify at least one time unit',
    );
    expect(() => validateDuration({ hours: -5 })).toThrow(
      'Duration must specify at least one time unit',
    );
    // Test with positive and negative mixed - should throw for negative
    expect(() => validateDuration({ days: 1, hours: -5 })).toThrow(
      'Duration hours cannot be negative',
    );
  });

  it('should throw for non-integer values', () => {
    expect(() => validateDuration({ days: 1.5 })).toThrow(
      'Duration days must be an integer',
    );
    expect(() => validateDuration({ hours: 2.7 })).toThrow(
      'Duration hours must be an integer',
    );
  });

  it('should throw for duration less than 1 second', () => {
    expect(() => validateDuration({ seconds: 0 })).toThrow(
      'Duration must specify at least one time unit',
    );
  });
});

describe('validateSubscriptionInterval', () => {
  it('should pass for valid whole-day intervals', () => {
    expect(() => validateSubscriptionInterval({ days: 1 })).not.toThrow();
    expect(() => validateSubscriptionInterval({ days: 7 })).not.toThrow();
    expect(() => validateSubscriptionInterval({ days: 30 })).not.toThrow();
    expect(() => validateSubscriptionInterval({ weeks: 1 })).not.toThrow(); // 7 days
    expect(() => validateSubscriptionInterval({ weeks: 2 })).not.toThrow(); // 14 days
    expect(() => validateSubscriptionInterval({ months: 1 })).not.toThrow(); // 30 days
    expect(() => validateSubscriptionInterval({ years: 1 })).not.toThrow(); // 365 days
  });

  it('should throw for intervals less than 1 minute', () => {
    expect(() => validateSubscriptionInterval({ seconds: 30 })).toThrow(
      'Subscription interval must be at least 1 minute',
    );
  });

  it('should throw for intervals greater than 1 year', () => {
    expect(() => validateSubscriptionInterval({ years: 2 })).toThrow(
      'Subscription interval cannot exceed 1 year',
    );
  });

  it('should throw for intervals not divisible by 1 day', () => {
    expect(() => validateSubscriptionInterval({ hours: 1 })).toThrow(
      'Subscription interval must be in whole days (e.g., 1 day, 7 days, 30 days)',
    );
    expect(() => validateSubscriptionInterval({ hours: 12 })).toThrow(
      'Subscription interval must be in whole days (e.g., 1 day, 7 days, 30 days)',
    );
    expect(() => validateSubscriptionInterval({ minutes: 90 })).toThrow(
      'Subscription interval must be in whole days (e.g., 1 day, 7 days, 30 days)',
    );
    expect(() => validateSubscriptionInterval({ days: 1, hours: 1 })).toThrow(
      'Subscription interval must be in whole days (e.g., 1 day, 7 days, 30 days)',
    );
  });
});

describe('validateSubscriptionLength', () => {
  it('should pass for valid subscription lengths', () => {
    const interval: Duration = { days: 7 };
    expect(() =>
      validateSubscriptionLength({ weeks: 4 }, interval),
    ).not.toThrow();
    expect(() =>
      validateSubscriptionLength({ days: 365 }, interval),
    ).not.toThrow();
  });

  it('should throw if subscription length is shorter than interval', () => {
    const interval: Duration = { days: 7 };
    expect(() => validateSubscriptionLength({ days: 3 }, interval)).toThrow(
      'Subscription length must be at least one interval period',
    );
  });

  it('should throw if subscription results in too many periods', () => {
    const interval: Duration = { days: 1 };
    const longSubscription: Duration = { days: 1001 }; // 1001 periods
    expect(() =>
      validateSubscriptionLength(longSubscription, interval),
    ).toThrow('Subscription length results in too many periods (max: 1000)');
  });
});
