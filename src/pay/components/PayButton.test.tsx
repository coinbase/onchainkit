import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { PAY_LIFECYCLESTATUS } from '../constants';
import { usePayContext } from './CheckoutProvider';
import { PayButton } from './PayButton';

vi.mock('./CheckoutProvider', () => ({
  usePayContext: vi.fn(),
}));

vi.mock('../../internal/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('../../internal/hooks/useIcon', () => ({
  useIcon: vi.fn(() => <svg data-testid="icon" />),
}));

const usePayContextMock = usePayContext as Mock;

describe('PayButton', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    usePayContextMock.mockReturnValue({
      lifecycleStatus: { statusName: PAY_LIFECYCLESTATUS.INIT },
      onSubmit: mockOnSubmit,
    });
  });

  it('should render button with default text "Pay" when not loading', () => {
    render(<PayButton />);
    const button: HTMLInputElement = screen.getByRole('button');
    expect(button.textContent).toBe('Pay');
    expect(button.disabled).toBe(false);
  });

  it('should render Spinner when loading', () => {
    usePayContextMock.mockReturnValue({
      lifecycleStatus: { statusName: PAY_LIFECYCLESTATUS.PENDING },
      onSubmit: mockOnSubmit,
    });
    render(<PayButton />);
    expect(screen.getByTestId('spinner')).toBeDefined();
    expect((screen.getByRole('button') as HTMLInputElement).disabled).toBe(
      true,
    );
  });

  it('should render "View payment details" when transaction is successful', () => {
    usePayContextMock.mockReturnValue({
      lifecycleStatus: { statusName: PAY_LIFECYCLESTATUS.SUCCESS },
      onSubmit: mockOnSubmit,
    });
    render(<PayButton />);
    expect(screen.getByRole('button').textContent).toBe('View payment details');
  });

  it('should render "Get USDC" when there is insufficient balance error', () => {
    usePayContextMock.mockReturnValue({
      lifecycleStatus: {
        statusName: PAY_LIFECYCLESTATUS.ERROR,
        statusData: { error: 'User has insufficient balance' },
      },
      onSubmit: mockOnSubmit,
    });
    render(<PayButton />);
    expect(screen.getByRole('button').textContent).toBe('Get USDC');
  });

  it('should call onSubmit when clicked', () => {
    render(<PayButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should apply additional className correctly', () => {
    const customClass = 'custom-class';
    render(<PayButton className={customClass} />);
    expect(screen.getByRole('button').className).toContain(customClass);
  });

  it('should render Coinbase branded button when coinbaseBranded prop is true', () => {
    render(<PayButton coinbaseBranded={true} />);
    const button = screen.getByRole('button');
    expect(button.textContent).toBe('Pay with Crypto');
    expect(screen.getByTestId('icon')).toBeDefined();
  });

  it('should render custom text when provided', () => {
    render(<PayButton text="Custom Text" />);
    expect(screen.getByRole('button').textContent).toBe('Custom Text');
  });

  it('should render icon when provided and not in a special state', () => {
    render(<PayButton icon="someIcon" />);
    expect(screen.getByTestId('icon')).toBeDefined();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<PayButton disabled={true} />);
    expect((screen.getByRole('button') as HTMLInputElement).disabled).toBe(
      true,
    );
  });
});
