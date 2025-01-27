import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { render, screen } from '@testing-library/react';
import type React from 'react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { Checkout } from './Checkout';

function mock<T>(func: T) {
  return func as Mock;
}

vi.mock('./CheckoutProvider', () => ({
  CheckoutProvider: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="checkout-provider">{children}</div>
  )),
}));

vi.mock('@/internal/hooks/useIsMounted', () => ({
  useIsMounted: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

const useIsMountedMock = mock(useIsMounted);

describe('Pay', () => {
  beforeEach(() => {
    useIsMountedMock.mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render children inside the CheckoutProvider when mounted', () => {
    render(
      <Checkout className="test-class">
        <div>Test Child</div>
      </Checkout>,
    );
    expect(screen.getByText('Test Child')).toBeDefined();
  });

  it('should apply the correct className', () => {
    render(
      <Checkout className="test-class">
        <div>Test Child</div>
      </Checkout>,
    );
    const container = screen.getByTestId('checkout-provider')
      .firstChild as HTMLElement;
    expect(container.className).toContain('test-class');
    expect(container.className).toContain('flex w-full flex-col gap-2');
  });

  it('should return null when not mounted', () => {
    useIsMountedMock.mockReturnValue(false);
    const { container } = render(
      <Checkout>
        <div>Test Child</div>
      </Checkout>,
    );
    expect(container.firstChild).toBeNull();
  });
});
