import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usdcToken } from '@/token/constants';
import { Subscribe } from './Subscribe';

// Mock Wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: () => ({ address: '0x123' }),
  useChainId: () => 8453,
  useSignTypedData: () => ({ signTypedDataAsync: vi.fn() }),
  useSwitchChain: () => ({ switchChainAsync: vi.fn() }),
}));

// Mock theme hook
vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: () => 'ock-theme',
}));

// Mock the subscription permissions hook
vi.mock('../hooks/useSubscriptionPermissions', () => ({
  useSubscriptionPermissions: vi.fn(() => ({
    existingPermission: null,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

// Mock the getCurrentPeriod utility
vi.mock('../utils/getCurrentPeriod', () => ({
  getPermissionStatus: vi.fn().mockResolvedValue({ currentPeriod: undefined }),
}));

// Mock the calculatePermissionHash utility
vi.mock('../utils/calculatePermissionHash', () => ({
  calculatePermissionHash: vi.fn().mockReturnValue('0x123456789abcdef'),
}));

describe('Subscribe', () => {
  it('should render with default props', () => {
    render(
      <Subscribe
        amount="10"
        token={usdcToken}
        interval={{ days: 30 }}
        spender="0x123456789abcdef123456789abcdef123456789a"
      />,
    );

    expect(screen.getByTestId('ockSubscribe')).toBeInTheDocument();
    expect(screen.getByTestId('ockSubscribeButton')).toBeInTheDocument();
    expect(screen.getByText('Subscribe $10/month')).toBeInTheDocument();
  });

  it('should render with custom button text', () => {
    render(
      <Subscribe
        amount="5"
        token={usdcToken}
        interval={{ weeks: 1 }}
        spender="0x123456789abcdef123456789abcdef123456789a"
        buttonText="Subscribe Now"
      />,
    );

    expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
  });

  it('should render disabled state', () => {
    render(
      <Subscribe
        amount="20"
        token={usdcToken}
        interval={{ months: 1 }}
        spender="0x123456789abcdef123456789abcdef123456789a"
        disabled={true}
      />,
    );

    const button = screen.getByTestId('ockSubscribeButton');
    expect(button).toBeDisabled();
  });

  it('should accept extraData parameter', () => {
    const extraData = '0x1234567890abcdef' as const;

    render(
      <Subscribe
        amount="15"
        token={usdcToken}
        interval={{ weeks: 2 }}
        spender="0x123456789abcdef123456789abcdef123456789a"
        extraData={extraData}
      />,
    );

    expect(screen.getByTestId('ockSubscribe')).toBeInTheDocument();
    expect(screen.getByTestId('ockSubscribeButton')).toBeInTheDocument();
  });

  it('should throw error for invalid amount', () => {
    // Mock console.error to prevent error logs during test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Mock NODE_ENV to ensure development behavior
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      expect(() => {
        render(
          <Subscribe
            amount="0"
            token={usdcToken}
            interval={{ days: 30 }}
            spender="0x123456789abcdef123456789abcdef123456789a"
          />,
        );
      }).toThrow('Subscribe: amount must be greater than 0');

      expect(() => {
        render(
          <Subscribe
            amount="0.00"
            token={usdcToken}
            interval={{ days: 30 }}
            spender="0x123456789abcdef123456789abcdef123456789a"
          />,
        );
      }).toThrow('Subscribe: amount must be greater than 0');

      expect(() => {
        render(
          <Subscribe
            amount="abc"
            token={usdcToken}
            interval={{ days: 30 }}
            spender="0x123456789abcdef123456789abcdef123456789a"
          />,
        );
      }).toThrow('Subscribe: amount must be a valid number');

      expect(() => {
        render(
          <Subscribe
            amount=""
            token={usdcToken}
            interval={{ days: 30 }}
            spender="0x123456789abcdef123456789abcdef123456789a"
          />,
        );
      }).toThrow('Subscribe: amount is required');
    } finally {
      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('should throw error for invalid spender', () => {
    // Mock console.error to prevent error logs during test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Mock NODE_ENV to ensure development behavior
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      expect(() => {
        render(
          <Subscribe
            amount="10"
            token={usdcToken}
            interval={{ days: 30 }}
            spender="0x0"
          />,
        );
      }).toThrow('Subscribe: spender address is required');
    } finally {
      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('should accept onStatus callback', () => {
    const onStatus = vi.fn();

    render(
      <Subscribe
        amount="10"
        token={usdcToken}
        interval={{ days: 30 }}
        spender="0x123456789abcdef123456789abcdef123456789a"
        onStatus={onStatus}
      />,
    );

    expect(screen.getByTestId('ockSubscribe')).toBeInTheDocument();
  });

  it('should trigger onSuccess immediately when existing permission is found', async () => {
    const mockExistingPermission = {
      spendPermission: {
        account: '0x123',
        spender: '0x123456789abcdef123456789abcdef123456789a',
        token: usdcToken.address,
        allowance: '10000000', // 10 USDC
        period: 2592000, // 30 days
        start: 1640995200,
        end: 1672531200,
        salt: '0',
        extraData: '0x',
      },
      signature: '0xsignature123',
      permissionHash: '0xhash123',
      createdAt: 1640995200,
    };

    const onSuccess = vi.fn();
    const onStatus = vi.fn();

    // Override the existing mock to return an existing permission
    const { useSubscriptionPermissions } = await import(
      '../hooks/useSubscriptionPermissions'
    );
    vi.mocked(useSubscriptionPermissions).mockReturnValue({
      existingPermission: mockExistingPermission,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <Subscribe
        amount="10"
        token={usdcToken}
        interval={{ days: 30 }}
        spender="0x123456789abcdef123456789abcdef123456789a"
        onSuccess={onSuccess}
        onStatus={onStatus}
      />,
    );

    // Wait for the component to process the existing permission
    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          signature: '0xsignature123',
          permissionHash: '0xhash123',
          isExistingPermission: true,
          spendPermission: expect.objectContaining({
            account: '0x123',
            spender: '0x123456789abcdef123456789abcdef123456789a',
            token: usdcToken.address,
            allowance: BigInt('10000000'),
            period: 2592000,
            start: 1640995200,
            end: 1672531200,
            salt: BigInt('0'),
            extraData: '0x',
          }),
        }),
      );
    });

    expect(
      screen.getByTestId('ockSubscribeStatus-subscribed'),
    ).toBeInTheDocument();

    // Reset the mock back to default
    vi.mocked(useSubscriptionPermissions).mockReturnValue({
      existingPermission: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('should return null for invalid props in production', () => {
    // Mock console.error to prevent error logs during test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Mock NODE_ENV to ensure production behavior
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    try {
      const { container } = render(
        <Subscribe
          amount="0"
          token={usdcToken}
          interval={{ days: 30 }}
          spender="0x123456789abcdef123456789abcdef123456789a"
        />,
      );

      // Should render nothing (null) in production
      expect(container.firstChild).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Subscribe: amount must be greater than 0',
      );

      // Test other invalid amounts
      consoleSpy.mockClear();
      const { container: container2 } = render(
        <Subscribe
          amount="invalid"
          token={usdcToken}
          interval={{ days: 30 }}
          spender="0x123456789abcdef123456789abcdef123456789a"
        />,
      );
      expect(container2.firstChild).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Subscribe: amount must be a valid number',
      );
    } finally {
      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    }
  });
});
