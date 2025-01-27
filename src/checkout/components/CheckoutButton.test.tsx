import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { CHECKOUT_LIFECYCLESTATUS } from '../constants';
import { CheckoutButton } from './CheckoutButton';
import { useCheckoutContext } from './CheckoutProvider';

vi.mock('./CheckoutProvider', () => ({
  useCheckoutContext: vi.fn(),
}));

vi.mock('@/internal/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('@/internal/hooks/useIcon', () => ({
  useIcon: vi.fn(() => <svg data-testid="icon" />),
}));

const useCheckoutContextMock = useCheckoutContext as Mock;

describe('CheckoutButton', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    useCheckoutContextMock.mockReturnValue({
      lifecycleStatus: { statusName: CHECKOUT_LIFECYCLESTATUS.INIT },
      onSubmit: mockOnSubmit,
    });
  });

  it('should render button with default text "Pay" when not loading', () => {
    render(<CheckoutButton />);
    const button: HTMLInputElement = screen.getByRole('button');
    expect(button.textContent).toBe('Pay');
    expect(button.disabled).toBe(false);
  });

  it('should render Spinner when loading', () => {
    useCheckoutContextMock.mockReturnValue({
      lifecycleStatus: { statusName: CHECKOUT_LIFECYCLESTATUS.PENDING },
      onSubmit: mockOnSubmit,
    });
    render(<CheckoutButton />);
    expect(screen.getByTestId('spinner')).toBeDefined();
    expect((screen.getByRole('button') as HTMLInputElement).disabled).toBe(
      true,
    );
  });

  it('should render "View payment details" when transaction is successful', () => {
    useCheckoutContextMock.mockReturnValue({
      lifecycleStatus: { statusName: CHECKOUT_LIFECYCLESTATUS.SUCCESS },
      onSubmit: mockOnSubmit,
    });
    render(<CheckoutButton />);
    expect(screen.getByRole('button').textContent).toBe('View payment details');
  });

  it('should call onSubmit when clicked', () => {
    render(<CheckoutButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should apply additional className correctly', () => {
    const customClass = 'custom-class';
    render(<CheckoutButton className={customClass} />);
    expect(screen.getByRole('button').className).toContain(customClass);
  });

  it('should render Coinbase branded button when coinbaseBranded prop is true', () => {
    render(<CheckoutButton coinbaseBranded={true} />);
    const button = screen.getByRole('button');
    expect(button.textContent).toBe('Pay');
    expect(screen.getByTestId('icon')).toBeDefined();
  });

  it('should render custom text when provided', () => {
    render(<CheckoutButton text="Custom Text" />);
    expect(screen.getByRole('button').textContent).toBe('Custom Text');
  });

  it('should render icon when provided and not in a special state', () => {
    render(<CheckoutButton icon="someIcon" />);
    expect(screen.getByTestId('icon')).toBeDefined();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<CheckoutButton disabled={true} />);
    expect((screen.getByRole('button') as HTMLInputElement).disabled).toBe(
      true,
    );
  });
});
