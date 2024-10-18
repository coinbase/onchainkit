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
import { useIsMounted } from '../../useIsMounted';
import { Pay } from './Pay';

function mock<T>(func: T) {
  return func as Mock;
}

vi.mock('./CheckoutProvider', () => ({
  CheckoutProvider: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="pay-provider">{children}</div>
  )),
}));

vi.mock('../../useIsMounted', () => ({
  useIsMounted: vi.fn(),
}));

vi.mock('../../useTheme', () => ({
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
      <Pay className="test-class">
        <div>Test Child</div>
      </Pay>,
    );
    expect(screen.getByText('Test Child')).toBeDefined();
  });

  it('should apply the correct className', () => {
    render(
      <Pay className="test-class">
        <div>Test Child</div>
      </Pay>,
    );
    const container = screen.getByTestId('pay-provider')
      .firstChild as HTMLElement;
    expect(container.className).toContain('test-class');
    expect(container.className).toContain('flex w-full flex-col gap-2');
  });

  it('should return null when not mounted', () => {
    useIsMountedMock.mockReturnValue(false);
    const { container } = render(
      <Pay>
        <div>Test Child</div>
      </Pay>,
    );
    expect(container.firstChild).toBeNull();
  });
});
