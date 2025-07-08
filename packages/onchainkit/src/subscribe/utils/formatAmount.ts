import type { Duration } from '../types';
import type { Token } from '@/token';

/**
 * Formats subscription amount with proper currency/token display
 * For USDC and other stablecoins, shows as $X
 * For other tokens, shows as X TOKEN
 */
export function formatSubscriptionAmount(amount: string, token: Token): string {
  // List of stablecoins and USD-pegged tokens that should show with $ prefix
  const usdStablecoins = ['USDC', 'USDT', 'DAI', 'BUSD', 'FRAX'];

  if (usdStablecoins.includes(token.symbol.toUpperCase())) {
    return `$${amount}`;
  }

  return `${amount} ${token.symbol}`;
}

/**
 * Formats duration into a short period string for button/status display
 * Examples: "month", "week", "day", "year"
 * Special-cases common monthly intervals (28, 30, 31 days) to display as "month"
 */
export function formatPeriodShort(duration: Duration): string {
  // Special case: common monthly intervals should display as "month"
  // Only apply when ONLY days are specified (no other time units)
  if (
    duration.days &&
    !duration.weeks &&
    !duration.months &&
    !duration.years &&
    !duration.hours &&
    !duration.minutes &&
    !duration.seconds
  ) {
    const days = duration.days;
    if (days === 28 || days === 30 || days === 31) {
      return 'month';
    }
  }

  // Check each time unit in order of preference (largest to smallest)
  const timeUnits = [
    'years',
    'months',
    'weeks',
    'days',
    'hours',
    'minutes',
    'seconds',
  ] as const;

  for (const unit of timeUnits) {
    if (duration[unit] && duration[unit]! > 0) {
      // Return singular form for all units
      return unit.slice(0, -1); // Remove 's' suffix
    }
  }

  return 'period';
}

/**
 * Formats a complete subscription display text
 * Examples: "Subscribe $10/month", "Subscribe 1 ETH/month"
 */
export function formatSubscriptionText(
  amount: string,
  token: Token,
  interval: Duration,
  action: 'subscribe' | 'subscribed' = 'subscribe',
): string {
  const formattedAmount = formatSubscriptionAmount(amount, token);
  const period = formatPeriodShort(interval);

  if (action === 'subscribed') {
    return `Subscribed to ${formattedAmount}/${period}`;
  }

  return `Subscribe ${formattedAmount}/${period}`;
}
