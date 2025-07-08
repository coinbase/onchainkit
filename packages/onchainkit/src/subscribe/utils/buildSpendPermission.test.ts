import { describe, expect, it } from 'vitest';
import { parseUnits } from 'viem';
import { ethToken, usdcToken } from '@/token/constants';
import { ETH_TOKEN_ADDRESS, MAX_UINT48 } from '../constants';
import {
  buildSpendPermission,
  validateSpendPermission,
} from './buildSpendPermission';

describe('buildSpendPermission', () => {
  const mockAccount = '0x1234567890123456789012345678901234567890' as const;
  const mockSpender = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as const;

  it('should build spend permission for ETH', () => {
    const spendPermission = buildSpendPermission({
      account: mockAccount,
      spender: mockSpender,
      amount: '1',
      token: ethToken,
      interval: { days: 30 },
    });

    expect(spendPermission.account).toBe(mockAccount);
    expect(spendPermission.spender).toBe(mockSpender);
    expect(spendPermission.token).toBe(ETH_TOKEN_ADDRESS);
    expect(spendPermission.allowance).toBe(parseUnits('1', 18)); // 1 ETH
    expect(spendPermission.period).toBe(86400 * 30); // 30 days in seconds
    expect(spendPermission.start).toBe(0);
    expect(spendPermission.end).toBe(Number(MAX_UINT48)); // Unlimited
    expect(spendPermission.salt).toBe(0n);
    expect(spendPermission.extraData).toBe('0x');
  });

  it('should build spend permission for USDC', () => {
    const spendPermission = buildSpendPermission({
      account: mockAccount,
      spender: mockSpender,
      amount: '100',
      token: usdcToken,
      interval: { weeks: 1 },
    });

    expect(spendPermission.token).toBe(usdcToken.address);
    expect(spendPermission.allowance).toBe(parseUnits('100', 6)); // 100 USDC (6 decimals)
    expect(spendPermission.period).toBe(604800); // 1 week in seconds
  });

  it('should calculate allowance for limited subscription', () => {
    const spendPermission = buildSpendPermission({
      account: mockAccount,
      spender: mockSpender,
      amount: '10',
      token: usdcToken,
      interval: { months: 1 },
      subscriptionLength: { years: 1 }, // 12 periods
    });

    const expectedAllowance = parseUnits('10', 6) * 12n; // 10 USDC * 12 months
    expect(spendPermission.allowance).toBe(expectedAllowance);

    // Should have a calculated end time (not unlimited)
    expect(spendPermission.end).toBeLessThan(Number(MAX_UINT48));
    expect(spendPermission.end).toBeGreaterThan(0);
  });

  it('should handle complex duration combinations', () => {
    const spendPermission = buildSpendPermission({
      account: mockAccount,
      spender: mockSpender,
      amount: '5',
      token: usdcToken,
      interval: { days: 7 }, // Weekly
      subscriptionLength: { months: 6, days: 15 }, // ~6.5 months
    });

    // Should calculate correct number of periods
    expect(spendPermission.allowance).toBeGreaterThan(parseUnits('5', 6));
    expect(spendPermission.period).toBe(86400 * 7); // 7 days
  });

  it('should throw error for invalid amount', () => {
    expect(() =>
      buildSpendPermission({
        account: mockAccount,
        spender: mockSpender,
        amount: '0',
        token: usdcToken,
        interval: { days: 30 },
      }),
    ).toThrow('Amount must be greater than 0');

    expect(() =>
      buildSpendPermission({
        account: mockAccount,
        spender: mockSpender,
        amount: '',
        token: usdcToken,
        interval: { days: 30 },
      }),
    ).toThrow('Amount must be greater than 0');
  });

  it('should allow custom salt and extraData', () => {
    const customSalt = BigInt(12345);
    const customExtraData = '0x1234' as const;

    const spendPermission = buildSpendPermission({
      account: mockAccount,
      spender: mockSpender,
      amount: '10',
      token: usdcToken,
      interval: { days: 30 },
      salt: customSalt,
      extraData: customExtraData,
    });

    expect(spendPermission.salt).toBe(customSalt);
    expect(spendPermission.extraData).toBe(customExtraData);
  });

  it('should handle dynamic extraData for order/user IDs', () => {
    const orderNumber = '12345';
    const userId = 'user-abc-def';

    // Simulate encoding order info as extraData
    const encodedOrderData =
      `0x${Buffer.from(JSON.stringify({ orderNumber, userId })).toString('hex')}` as const;

    const spendPermission = buildSpendPermission({
      account: mockAccount,
      spender: mockSpender,
      amount: '25',
      token: usdcToken,
      interval: { months: 1 },
      extraData: encodedOrderData,
    });

    expect(spendPermission.extraData).toBe(encodedOrderData);
    expect(spendPermission.allowance).toBe(parseUnits('25', 6));

    // Verify we can decode the data back
    const decodedData = JSON.parse(
      Buffer.from(encodedOrderData.slice(2), 'hex').toString(),
    );
    expect(decodedData.orderNumber).toBe(orderNumber);
    expect(decodedData.userId).toBe(userId);
  });

  it('should handle auto salt generation', () => {
    const mockNow = 1640995200000; // Mock timestamp
    const originalDateNow = Date.now;
    Date.now = vi.fn(() => mockNow);

    try {
      const spendPermission = buildSpendPermission({
        account: mockAccount,
        spender: mockSpender,
        amount: '10',
        token: usdcToken,
        interval: { days: 30 },
        salt: 'auto',
      });

      expect(spendPermission.salt).toBe(BigInt(mockNow));
    } finally {
      Date.now = originalDateNow;
    }
  });

  it('should handle high-decimal amounts correctly', () => {
    // Test with a token that has high decimals (like some DeFi tokens)
    const highDecimalToken = {
      ...usdcToken,
      decimals: 24, // Very high decimals
    };

    const spendPermission = buildSpendPermission({
      account: mockAccount,
      spender: mockSpender,
      amount: '0.123456789012345678901234',
      token: highDecimalToken,
      interval: { days: 30 },
    });

    // Should handle the high precision correctly without losing data
    expect(spendPermission.allowance).toBe(
      parseUnits('0.123456789012345678901234', 24),
    );
    expect(spendPermission.allowance).toBeGreaterThan(0n);
  });

  it('should handle decimal amounts with standard tokens', () => {
    // Test with USDC (6 decimals) and a decimal amount
    const spendPermission = buildSpendPermission({
      account: mockAccount,
      spender: mockSpender,
      amount: '123.456789', // More decimals than USDC supports
      token: usdcToken,
      interval: { days: 30 },
    });

    // Should handle the decimal amount correctly (parseUnits will handle truncation)
    expect(spendPermission.allowance).toBe(parseUnits('123.456789', 6));
    expect(spendPermission.allowance).toBeGreaterThan(0n);
  });
});

describe('validateSpendPermission', () => {
  const validSpendPermission = {
    account: '0x1234567890123456789012345678901234567890' as const,
    spender: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as const,
    token: usdcToken.address as `0x${string}`,
    allowance: parseUnits('100', 6),
    period: 86400 * 30,
    start: 0,
    end: Number(MAX_UINT48),
    salt: 0n,
    extraData: '0x' as const,
  };

  it('should pass validation for valid spend permission', () => {
    expect(() => validateSpendPermission(validSpendPermission)).not.toThrow();
  });

  it('should throw for invalid account', () => {
    expect(() =>
      validateSpendPermission({
        ...validSpendPermission,
        account: '0x0' as const,
      }),
    ).toThrow('Account address is required');
  });

  it('should throw for invalid spender', () => {
    expect(() =>
      validateSpendPermission({
        ...validSpendPermission,
        spender: '0x0' as const,
      }),
    ).toThrow('Spender address is required');
  });

  it('should throw for zero allowance', () => {
    expect(() =>
      validateSpendPermission({
        ...validSpendPermission,
        allowance: 0n,
      }),
    ).toThrow('Allowance must be greater than 0');
  });

  it('should throw for invalid time range', () => {
    expect(() =>
      validateSpendPermission({
        ...validSpendPermission,
        start: 100,
        end: 50,
      }),
    ).toThrow('End time must be after start time');
  });
});
