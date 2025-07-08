import { TIME_UNITS } from '../constants';
import type { Duration } from '../types';

/**
 * Converts a Duration object to total seconds
 * Supports arbitrary combinations of time units
 */
export function calculateDurationInSeconds(duration: Duration): number {
  let totalSeconds = 0;

  if (duration.seconds) {
    totalSeconds += duration.seconds * TIME_UNITS.SECOND;
  }
  if (duration.minutes) {
    totalSeconds += duration.minutes * TIME_UNITS.MINUTE;
  }
  if (duration.hours) {
    totalSeconds += duration.hours * TIME_UNITS.HOUR;
  }
  if (duration.days) {
    totalSeconds += duration.days * TIME_UNITS.DAY;
  }
  if (duration.weeks) {
    totalSeconds += duration.weeks * TIME_UNITS.WEEK;
  }
  if (duration.months) {
    totalSeconds += duration.months * TIME_UNITS.MONTH;
  }
  if (duration.years) {
    totalSeconds += duration.years * TIME_UNITS.YEAR;
  }

  return Math.floor(totalSeconds);
}

/**
 * Helper function to format single unit
 */
function formatSingleUnit(
  value: number,
  singular: string,
  plural: string,
): string {
  return value === 1 ? `Every ${singular}` : `Every ${value} ${plural}`;
}

/**
 * Helper function to format unit for multi-unit case
 */
function formatUnitPart(
  value: number,
  singular: string,
  plural: string,
): string {
  return value === 1 ? `1 ${singular}` : `${value} ${plural}`;
}

/**
 * Helper function to join parts with proper grammar
 */
function joinParts(parts: string[]): string {
  if (parts.length === 0) {
    return 'No period defined';
  }
  if (parts.length === 1) {
    return `Every ${parts[0]}`;
  }
  if (parts.length === 2) {
    return `Every ${parts[0]} and ${parts[1]}`;
  }
  const lastPart = parts.pop();
  return `Every ${parts.join(', ')} and ${lastPart}`;
}

/**
 * Formats a Duration object into a human-readable string for subscription periods
 * @param duration - Duration object to format
 * @returns Formatted string like "Every 30 days" or "Every 1 month"
 */
export function formatSubscriptionPeriod(duration: Duration): string {
  const definedKeys = Object.keys(duration).filter(
    (key) =>
      duration[key as keyof Duration] !== undefined &&
      duration[key as keyof Duration] !== 0,
  );

  // Handle simple cases first (single unit)
  if (definedKeys.length === 1) {
    const key = definedKeys[0] as keyof Duration;
    const value = duration[key]!;

    switch (key) {
      case 'years':
        return formatSingleUnit(value, 'year', 'years');
      case 'months':
        return formatSingleUnit(value, 'month', 'months');
      case 'weeks':
        return formatSingleUnit(value, 'week', 'weeks');
      case 'days':
        return formatSingleUnit(value, 'day', 'days');
      case 'hours':
        return formatSingleUnit(value, 'hour', 'hours');
      case 'minutes':
        return formatSingleUnit(value, 'minute', 'minutes');
      case 'seconds':
        return formatSingleUnit(value, 'second', 'seconds');
      default:
        return 'No period defined';
    }
  }

  // Handle complex cases (multiple units)
  const parts: string[] = [];

  if (duration.years) {
    parts.push(formatUnitPart(duration.years, 'year', 'years'));
  }
  if (duration.months) {
    parts.push(formatUnitPart(duration.months, 'month', 'months'));
  }
  if (duration.weeks) {
    parts.push(formatUnitPart(duration.weeks, 'week', 'weeks'));
  }
  if (duration.days) {
    parts.push(formatUnitPart(duration.days, 'day', 'days'));
  }
  if (duration.hours) {
    parts.push(formatUnitPart(duration.hours, 'hour', 'hours'));
  }
  if (duration.minutes) {
    parts.push(formatUnitPart(duration.minutes, 'minute', 'minutes'));
  }
  if (duration.seconds) {
    parts.push(formatUnitPart(duration.seconds, 'second', 'seconds'));
  }

  return joinParts(parts);
}

/**
 * Calculates the number of periods within a subscription length
 * @param subscriptionLength - Total duration of subscription
 * @param interval - Duration of each period
 * @returns Number of periods (rounded down)
 */
export function calculatePeriodCount(
  subscriptionLength: Duration,
  interval: Duration,
): number {
  const subscriptionSeconds = calculateDurationInSeconds(subscriptionLength);
  const intervalSeconds = calculateDurationInSeconds(interval);

  if (intervalSeconds === 0) {
    throw new Error('Interval duration cannot be zero');
  }

  return Math.floor(subscriptionSeconds / intervalSeconds);
}

/**
 * Calculates the subscription end timestamp
 * @param subscriptionLength - Total duration of subscription
 * @param startTime - Start timestamp (defaults to current time)
 * @returns End timestamp in seconds
 */
export function calculateSubscriptionEnd(
  subscriptionLength: Duration,
  startTime: number = 0,
): number {
  const durationSeconds = calculateDurationInSeconds(subscriptionLength);
  return startTime + durationSeconds;
}
