import { describe, expect, it } from 'vitest';
import {
  calculateDurationInSeconds,
  calculatePeriodCount,
  calculateSubscriptionEnd,
  formatSubscriptionPeriod,
} from './calculateDuration';
import type { Duration } from '../types';

describe('calculateDurationInSeconds', () => {
  it('should convert single time units correctly', () => {
    expect(calculateDurationInSeconds({ seconds: 1 })).toBe(1);
    expect(calculateDurationInSeconds({ minutes: 1 })).toBe(60);
    expect(calculateDurationInSeconds({ hours: 1 })).toBe(3600);
    expect(calculateDurationInSeconds({ days: 1 })).toBe(86400);
    expect(calculateDurationInSeconds({ weeks: 1 })).toBe(604800);
    expect(calculateDurationInSeconds({ months: 1 })).toBe(2629746);
    expect(calculateDurationInSeconds({ years: 1 })).toBe(31556952);
  });

  it('should handle multiple time units', () => {
    const duration: Duration = {
      days: 1,
      hours: 2,
      minutes: 30,
      seconds: 45,
    };
    const expected = 86400 + 7200 + 1800 + 45; // 95445
    expect(calculateDurationInSeconds(duration)).toBe(expected);
  });

  it('should handle empty duration', () => {
    expect(calculateDurationInSeconds({})).toBe(0);
  });
});

describe('formatSubscriptionPeriod', () => {
  it('should format single time units correctly', () => {
    expect(formatSubscriptionPeriod({ years: 1 })).toBe('Every year');
    expect(formatSubscriptionPeriod({ years: 2 })).toBe('Every 2 years');
    expect(formatSubscriptionPeriod({ months: 1 })).toBe('Every month');
    expect(formatSubscriptionPeriod({ months: 3 })).toBe('Every 3 months');
    expect(formatSubscriptionPeriod({ weeks: 1 })).toBe('Every week');
    expect(formatSubscriptionPeriod({ weeks: 2 })).toBe('Every 2 weeks');
    expect(formatSubscriptionPeriod({ days: 1 })).toBe('Every day');
    expect(formatSubscriptionPeriod({ days: 30 })).toBe('Every 30 days');
    expect(formatSubscriptionPeriod({ hours: 1 })).toBe('Every hour');
    expect(formatSubscriptionPeriod({ hours: 12 })).toBe('Every 12 hours');
    expect(formatSubscriptionPeriod({ minutes: 1 })).toBe('Every minute');
    expect(formatSubscriptionPeriod({ minutes: 15 })).toBe('Every 15 minutes');
    expect(formatSubscriptionPeriod({ seconds: 1 })).toBe('Every second');
    expect(formatSubscriptionPeriod({ seconds: 30 })).toBe('Every 30 seconds');
  });

  it('should format two time units correctly', () => {
    expect(formatSubscriptionPeriod({ months: 1, days: 15 })).toBe(
      'Every 1 month and 15 days',
    );
    expect(formatSubscriptionPeriod({ weeks: 2, days: 3 })).toBe(
      'Every 2 weeks and 3 days',
    );
    expect(formatSubscriptionPeriod({ hours: 1, minutes: 30 })).toBe(
      'Every 1 hour and 30 minutes',
    );
  });

  it('should format multiple time units correctly', () => {
    expect(
      formatSubscriptionPeriod({
        years: 1,
        months: 2,
        days: 15,
      }),
    ).toBe('Every 1 year, 2 months and 15 days');

    expect(
      formatSubscriptionPeriod({
        days: 1,
        hours: 12,
        minutes: 30,
        seconds: 45,
      }),
    ).toBe('Every 1 day, 12 hours, 30 minutes and 45 seconds');
  });

  it('should handle empty duration', () => {
    expect(formatSubscriptionPeriod({})).toBe('No period defined');
  });
});

describe('calculatePeriodCount', () => {
  it('should calculate period count correctly', () => {
    const yearlySubscription: Duration = { years: 1 };
    const monthlyInterval: Duration = { months: 1 };
    expect(calculatePeriodCount(yearlySubscription, monthlyInterval)).toBe(12);
  });

  it('should handle partial periods', () => {
    const twoMonthSubscription: Duration = { months: 2 };
    const monthlyInterval: Duration = { months: 1 };
    expect(calculatePeriodCount(twoMonthSubscription, monthlyInterval)).toBe(2);
  });

  it('should handle complex durations', () => {
    const complexSubscription: Duration = { days: 45 };
    const weeklyInterval: Duration = { weeks: 1 };
    expect(calculatePeriodCount(complexSubscription, weeklyInterval)).toBe(6); // 45 days / 7 days = 6.4... -> 6
  });

  it('should throw error for zero interval', () => {
    const subscription: Duration = { months: 1 };
    const emptyInterval: Duration = {};
    expect(() => calculatePeriodCount(subscription, emptyInterval)).toThrow(
      'Interval duration cannot be zero',
    );
  });
});

describe('calculateSubscriptionEnd', () => {
  it('should calculate end time correctly', () => {
    const duration: Duration = { days: 30 };
    const startTime = 1640995200; // 2022-01-01 00:00:00 UTC
    const endTime = calculateSubscriptionEnd(duration, startTime);
    expect(endTime).toBe(startTime + 30 * 86400);
  });

  it('should use default start time when not provided', () => {
    const duration: Duration = { hours: 1 };
    const endTime = calculateSubscriptionEnd(duration);
    expect(endTime).toBe(3600); // 1 hour in seconds
  });
});
