import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { CheckoutEvent } from '../../core/analytics/types';
import { useIcon } from '../../internal/hooks/useIcon';
import { CHECKOUT_LIFECYCLESTATUS } from '../constants';
import { CheckoutButton } from './CheckoutButton';
import { useCheckoutContext } from './CheckoutProvider';

vi.mock('./CheckoutProvider', () => ({
  useCheckoutContext: vi.fn(),
}));

vi.mock('../../internal/hooks/useIcon', () => ({
  useIcon: vi.fn(),
}));

vi.mock('../../core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(),
}));

describe('CheckoutButton', () => {
  let mockOnSubmit: Mock;
  let mockSendAnalytics: Mock;

  beforeEach(() => {
    mockOnSubmit = vi.fn();
    mockSendAnalytics = vi.fn();

    (useCheckoutContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'ready' },
      onSubmit: mockOnSubmit,
    });

    (useIcon as Mock).mockReturnValue('<svg>Icon</svg>');

    (useAnalytics as Mock).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders with default text', () => {
    render(<CheckoutButton />);
    expect(screen.getByText('Pay')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<CheckoutButton text="Custom Pay" />);
    expect(screen.getByText('Custom Pay')).toBeInTheDocument();
  });

  it('renders with Coinbase branding when coinbaseBranded is true', () => {
    (useIcon as Mock).mockReturnValue('<svg>Coinbase Pay Icon</svg>');
    render(<CheckoutButton coinbaseBranded={true} />);
    expect(screen.getByText('Pay')).toBeInTheDocument();
  });

  it('disables button when disabled prop is true', () => {
    render(<CheckoutButton disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables button when lifecycle status is PENDING', () => {
    (useCheckoutContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: CHECKOUT_LIFECYCLESTATUS.PENDING },
      onSubmit: mockOnSubmit,
    });

    render(<CheckoutButton />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables button when lifecycle status is FETCHING_DATA', () => {
    (useCheckoutContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: CHECKOUT_LIFECYCLESTATUS.FETCHING_DATA },
      onSubmit: mockOnSubmit,
    });

    render(<CheckoutButton />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows spinner when lifecycle status is PENDING', () => {
    (useCheckoutContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: CHECKOUT_LIFECYCLESTATUS.PENDING },
      onSubmit: mockOnSubmit,
    });

    render(<CheckoutButton />);
    expect(screen.getByRole('button')).not.toHaveTextContent('Pay');
    // Note: We can't easily test for the Spinner component directly,
    // but we can verify the button text is not displayed
  });

  it('changes button text to "View payment details" when transaction is successful', () => {
    (useCheckoutContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: CHECKOUT_LIFECYCLESTATUS.SUCCESS },
      onSubmit: mockOnSubmit,
    });

    render(<CheckoutButton />);
    expect(screen.getByText('View payment details')).toBeInTheDocument();
  });

  it('calls onSubmit when button is clicked', () => {
    render(<CheckoutButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('tracks checkout success analytics when transaction is successful', async () => {
    const transactionHash = '0xabc123';
    const chargeId = 'charge-123';

    (useCheckoutContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: CHECKOUT_LIFECYCLESTATUS.SUCCESS,
        statusData: {
          transactionReceipts: [{ transactionHash }],
          chargeId,
        },
      },
      onSubmit: mockOnSubmit,
    });

    render(<CheckoutButton />);

    await waitFor(() => {
      expect(mockSendAnalytics).toHaveBeenCalledWith(
        CheckoutEvent.CheckoutSuccess,
        {
          chargeHandlerId: chargeId,
          transactionHash,
        },
      );
    });
  });

  it('does not track analytics when transaction hash or charge ID is missing', () => {
    (useCheckoutContext as Mock).mockReturnValue({
      lifecycleStatus: {
        statusName: CHECKOUT_LIFECYCLESTATUS.SUCCESS,
        statusData: {
          transactionReceipts: [{ transactionHash: null }],
          chargeId: 'charge-123',
        },
      },
      onSubmit: mockOnSubmit,
    });

    render(<CheckoutButton />);
    expect(mockSendAnalytics).not.toHaveBeenCalled();
  });

  it('does not track analytics when status is not SUCCESS', () => {
    (useCheckoutContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: CHECKOUT_LIFECYCLESTATUS.READY },
      onSubmit: mockOnSubmit,
    });

    render(<CheckoutButton />);
    expect(mockSendAnalytics).not.toHaveBeenCalled();
  });
});
