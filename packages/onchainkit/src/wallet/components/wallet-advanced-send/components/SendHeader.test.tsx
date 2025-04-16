import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletContext } from '../../WalletProvider';
import { SendHeader } from './SendHeader';
import { useSendContext } from './SendProvider';

vi.mock('../../WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('./SendProvider', () => ({
  useSendContext: vi.fn(),
}));

vi.mock('@/internal/components/PressableIcon', () => ({
  PressableIcon: vi.fn(({ children, onClick, className }) => (
    <button
      type="button"
      onClick={onClick}
      className={className}
      data-testid="mock-pressable-icon"
    >
      {children}
    </button>
  )),
}));

vi.mock('@/internal/svg/backArrowSvg', () => ({
  backArrowSvg: <div data-testid="mock-back-arrow">Back Arrow</div>,
}));

vi.mock('@/internal/svg/closeSvg', () => ({
  CloseSvg: () => <div data-testid="mock-close-svg">Close</div>,
}));

describe('SendHeader', () => {
  const mockUseWalletAdvancedContext = useWalletContext as ReturnType<
    typeof vi.fn
  >;
  const mockUseSendContext = useSendContext as ReturnType<typeof vi.fn>;

  const mockWalletAdvancedContext = {
    setActiveFeature: vi.fn(),
  };

  const mockSendContext = {
    recipientState: {
      phase: 'input',
      input: '',
      address: null,
      displayValue: null,
    },
    selectedToken: null,
    handleResetTokenSelection: vi.fn(),
    deselectRecipient: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWalletAdvancedContext.mockReturnValue(mockWalletAdvancedContext);
    mockUseSendContext.mockReturnValue(mockSendContext);
  });

  it('renders with default label', () => {
    render(<SendHeader />);

    expect(screen.getByText('Send')).toBeInTheDocument();
    expect(screen.getByTestId('mock-close-svg')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-back-arrow')).not.toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<SendHeader label="Custom Send" />);

    expect(screen.getByText('Custom Send')).toBeInTheDocument();
  });

  it('applies custom classNames', () => {
    const customClassNames = {
      container: 'custom-container',
      label: 'custom-label',
      close: 'custom-close',
      back: 'custom-back',
    };

    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      recipientState: {
        phase: 'selected',
        input: '0x1234567890123456789012345678901234567890',
        address: '0x1234567890123456789012345678901234567890',
        displayValue: 'user.eth',
      },
    });

    render(<SendHeader classNames={customClassNames} />);

    const container = screen.queryByTestId('ockSendHeader');
    expect(container).toHaveClass('custom-container');

    const label = screen.queryByTestId('ockSendHeader_label');
    expect(label).toHaveClass('custom-label');

    const backButton = screen.queryByTestId('ockSendHeader_back');
    expect(backButton?.firstElementChild).toHaveClass('custom-back');

    const closeButton = screen.queryByTestId('ockSendHeader_close');
    expect(closeButton?.firstElementChild).toHaveClass('custom-close');
  });

  it('shows back button when recipient address is selected', () => {
    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      recipientState: {
        phase: 'selected',
        input: '0x1234567890123456789012345678901234567890',
        address: '0x1234567890123456789012345678901234567890',
        displayValue: 'user.eth',
      },
    });

    render(<SendHeader />);

    expect(screen.getByTestId('mock-back-arrow')).toBeInTheDocument();
  });

  it('calls handleClose when close button is clicked', () => {
    render(<SendHeader />);

    const closeButton = screen.getByTestId('mock-pressable-icon');
    fireEvent.click(closeButton);

    expect(mockWalletAdvancedContext.setActiveFeature).toHaveBeenCalledWith(
      null,
    );
  });

  it('calls handleResetTokenSelection when back button is clicked and token is selected', () => {
    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      recipientState: {
        phase: 'selected',
        input: '0x1234567890123456789012345678901234567890',
        address: '0x1234567890123456789012345678901234567890',
        displayValue: 'user.eth',
      },
      selectedToken: { symbol: 'ETH' },
    });

    render(<SendHeader />);

    const backButton = screen.getByTestId('mock-back-arrow');
    fireEvent.click(backButton);

    expect(mockSendContext.handleResetTokenSelection).toHaveBeenCalled();
    expect(mockSendContext.deselectRecipient).not.toHaveBeenCalled();
  });

  it('calls deselectRecipient when back button is clicked and no token is selected', () => {
    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      recipientState: {
        phase: 'selected',
        input: '0x1234567890123456789012345678901234567890',
        address: '0x1234567890123456789012345678901234567890',
        displayValue: 'user.eth',
      },
      selectedToken: null,
    });

    render(<SendHeader />);

    const backButton = screen.getByTestId('mock-back-arrow');
    fireEvent.click(backButton);

    expect(mockSendContext.deselectRecipient).toHaveBeenCalled();
    expect(mockSendContext.handleResetTokenSelection).not.toHaveBeenCalled();
  });
});
