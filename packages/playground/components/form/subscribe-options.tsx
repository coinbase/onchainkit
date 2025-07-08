import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useContext, useMemo } from 'react';
import { getAddress } from 'viem';
import { AppContext } from '../AppProvider';

function validateAmount(amount: string): string | null {
  if (!amount || amount.trim() === '') {
    return null;
  }
  const numericValue = parseFloat(amount);
  if (isNaN(numericValue) || !isFinite(numericValue)) {
    return 'Must be a valid number';
  }
  if (numericValue <= 0) {
    return 'Must be greater than 0';
  }
  return null;
}

function validateIntervalValue(value: string): string | null {
  if (!value || value.trim() === '') {
    return null;
  }
  const numericValue = parseInt(value, 10);
  if (isNaN(numericValue) || numericValue <= 0) {
    return 'Must be a positive number';
  }

  // All interval types now work since we've rounded months/years to whole days
  // Months = 30 days, Years = 365 days, Weeks = 7 days

  return null;
}

function validateSpender(address: string): string | null {
  if (!address || address.trim() === '') {
    return null;
  }
  try {
    getAddress(address);
    return null;
  } catch {
    return 'Invalid address format';
  }
}

export function SubscribeOptions() {
  const {
    subscribeAmount,
    setSubscribeAmount,
    subscribeToken,
    setSubscribeToken,
    subscribeIntervalValue,
    setSubscribeIntervalValue,
    subscribeIntervalType,
    setSubscribeIntervalType,
    subscribeSpender,
    setSubscribeSpender,
  } = useContext(AppContext);

  const amountError = useMemo(
    () => validateAmount(subscribeAmount || ''),
    [subscribeAmount],
  );
  const intervalError = useMemo(
    () => validateIntervalValue(subscribeIntervalValue || ''),
    [subscribeIntervalValue],
  );
  const spenderError = useMemo(
    () => validateSpender(subscribeSpender || ''),
    [subscribeSpender],
  );

  return (
    <fieldset className="grid gap-4">
      <legend className="sr-only">Subscription Configuration</legend>

      <div className="grid gap-2">
        <Label htmlFor="subscribeToken">Token</Label>
        <Select value={subscribeToken} onValueChange={setSubscribeToken}>
          <SelectTrigger>
            <SelectValue placeholder="Select token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USDC">USDC</SelectItem>
            <SelectItem value="ETH">ETH</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subscribeAmount">
          Amount
          {amountError && (
            <span className="text-red-500 text-sm ml-2">({amountError})</span>
          )}
        </Label>
        <Input
          id="subscribeAmount"
          type="number"
          min="0"
          step="any"
          placeholder="10"
          value={subscribeAmount}
          onChange={(e) => setSubscribeAmount(e.target.value)}
          className={amountError ? 'border-red-300 focus:border-red-500' : ''}
          aria-invalid={!!amountError}
          aria-describedby={amountError ? 'amount-error' : undefined}
        />
        {amountError && (
          <div id="amount-error" className="text-red-500 text-sm">
            {amountError}
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subscribeInterval">
          Billing Interval
          {intervalError && (
            <span className="text-red-500 text-sm ml-2">({intervalError})</span>
          )}
        </Label>
        <div className="flex gap-2">
          <Input
            id="subscribeIntervalValue"
            type="number"
            min="1"
            step="1"
            placeholder="30"
            value={subscribeIntervalValue}
            onChange={(e) => setSubscribeIntervalValue(e.target.value)}
            className={`flex-1 ${intervalError ? 'border-red-300 focus:border-red-500' : ''}`}
            aria-invalid={!!intervalError}
            aria-describedby={intervalError ? 'interval-error' : undefined}
          />
          <Select
            value={subscribeIntervalType}
            onValueChange={setSubscribeIntervalType}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="weeks">Weeks</SelectItem>
              <SelectItem value="months">Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-600">
          Intervals are rounded to whole days: 1 month = 30 days, 1 week = 7
          days.
        </div>
        {intervalError && (
          <div id="interval-error" className="text-red-500 text-sm">
            {intervalError}
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subscribeSpender">
          Spender Address
          {spenderError && (
            <span className="text-red-500 text-sm ml-2">({spenderError})</span>
          )}
        </Label>
        <Input
          id="subscribeSpender"
          placeholder="0x742d35Cc6635C0532925a3b8D4DDEC5764B72d32"
          value={subscribeSpender}
          onChange={(e) => setSubscribeSpender(e.target.value)}
          className={spenderError ? 'border-red-300 focus:border-red-500' : ''}
          aria-invalid={!!spenderError}
          aria-describedby={spenderError ? 'spender-error' : undefined}
        />
        {spenderError && (
          <div id="spender-error" className="text-red-500 text-sm">
            {spenderError}
          </div>
        )}
      </div>
    </fieldset>
  );
}
