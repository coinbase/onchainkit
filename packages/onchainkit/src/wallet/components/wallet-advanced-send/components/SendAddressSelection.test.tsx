import { act, render, screen } from '@testing-library/react';
import type { Chain } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletContext } from '../../WalletProvider';
import { resolveAddressInput } from '../utils/resolveAddressInput';
import { SendAddressInput } from './SendAddressInput';
import { SendAddressSelection } from './SendAddressSelection';
import { SendAddressSelector } from './SendAddressSelector';
import { useSendContext } from './SendProvider';

vi.mock('../../WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('./SendProvider', () => ({
  useSendContext: vi.fn(),
}));

vi.mock('./SendAddressInput', () => ({
  SendAddressInput: vi.fn(() => <div data-testid="mock-send-address-input" />),
}));

vi.mock('./SendAddressSelector', () => ({
  SendAddressSelector: vi.fn(() => (
    <div data-testid="mock-send-address-selector" />
  )),
}));

vi.mock('../utils/resolveAddressInput', () => ({
  resolveAddressInput: vi.fn(),
}));

const mockChain = {
  id: 8453,
  name: 'Base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
} as Chain;

const mockSendContext = {
  selectedRecipient: { address: null, displayValue: '' },
  handleRecipientSelection: vi.fn(),
  handleRecipientInputChange: vi.fn(),
};

describe('SendAddressSelection', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseSendContext = useSendContext as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWalletContext.mockReturnValue({
      chain: mockChain,
    });
    mockUseSendContext.mockReturnValue(mockSendContext);
  });

  it('renders SendAddressInput with correct props', () => {
    render(<SendAddressSelection />);

    expect(SendAddressInput).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedRecipient: mockSendContext.selectedRecipient,
        recipientInput: '',
        handleRecipientInputChange: mockSendContext.handleRecipientInputChange,
      }),
      {},
    );

    expect(screen.getByTestId('mock-send-address-input')).toBeInTheDocument();
  });

  it('passes custom classNames to SendAddressInput', () => {
    const customClassNames = {
      input: {
        container: 'custom-container',
        label: 'custom-label',
        input: 'custom-input',
      },
    };

    render(<SendAddressSelection classNames={customClassNames} />);

    expect(SendAddressInput).toHaveBeenCalledWith(
      expect.objectContaining({
        classNames: customClassNames.input,
      }),
      {},
    );
  });

  it('does not render SendAddressSelector when selectedRecipient.address exists', () => {
    vi.mocked(mockUseSendContext).mockReturnValue({
      ...mockSendContext,
      selectedRecipient: {
        address: '0x1234567890123456789012345678901234567890',
        displayValue: 'user.eth',
      },
    });

    render(<SendAddressSelection />);

    expect(SendAddressSelector).not.toHaveBeenCalled();
    expect(
      screen.queryByTestId('mock-send-address-selector'),
    ).not.toBeInTheDocument();
  });

  it('does not render SendAddressSelector when validatedInput.address is null', () => {
    render(<SendAddressSelection />);

    expect(SendAddressSelector).not.toHaveBeenCalled();
    expect(
      screen.queryByTestId('mock-send-address-selector'),
    ).not.toBeInTheDocument();
  });

  it('renders SendAddressSelector when validatedInput.address exists and no selectedRecipient.address', async () => {
    const { rerender } = render(<SendAddressSelection />);
    const { setValidatedInput } = vi.mocked(SendAddressInput).mock.calls[0][0];

    act(() => {
      setValidatedInput({
        address: '0x1234567890123456789012345678901234567890',
        displayValue: 'user.eth',
      });

      rerender(<SendAddressSelection />);
    });

    expect(SendAddressSelector).toHaveBeenCalledWith(
      expect.objectContaining({
        address: '0x1234567890123456789012345678901234567890',
      }),
      {},
    );

    expect(
      screen.getByTestId('mock-send-address-selector'),
    ).toBeInTheDocument();
  });

  it('passes custom classNames to SendAddressSelector', async () => {
    const customClassNames = {
      selector: {
        container: 'custom-selector-container',
      },
    };

    const { rerender } = render(
      <SendAddressSelection classNames={customClassNames} />,
    );

    const { setValidatedInput } = vi.mocked(SendAddressInput).mock.calls[0][0];

    act(() => {
      setValidatedInput({
        address: '0x1234567890123456789012345678901234567890',
        displayValue: 'user.eth',
      });

      rerender(<SendAddressSelection classNames={customClassNames} />);
    });

    expect(SendAddressSelector).toHaveBeenCalledWith(
      expect.objectContaining({
        classNames: customClassNames.selector,
      }),
      {},
    );
  });

  it('calls resolveAddressInput and handleRecipientSelection when onClick is triggered', async () => {
    vi.mocked(resolveAddressInput).mockResolvedValue({
      address: '0x9876543210987654321098765432109876543210',
      displayValue: 'resolved.eth',
    });

    const { rerender } = render(<SendAddressSelection />);

    const { setValidatedInput } = vi.mocked(SendAddressInput).mock.calls[0][0];
    act(() => {
      setValidatedInput({
        address: '0x1234567890123456789012345678901234567890',
        displayValue: 'user.eth',
      });

      rerender(<SendAddressSelection />);
    });

    const { onClick } = vi.mocked(SendAddressSelector).mock.calls[0][0];

    await onClick();

    expect(resolveAddressInput).toHaveBeenCalledWith(
      '0x1234567890123456789012345678901234567890',
      'user.eth',
    );
    expect(mockSendContext.handleRecipientSelection).toHaveBeenCalledWith({
      address: '0x9876543210987654321098765432109876543210',
      displayValue: 'resolved.eth',
    });
  });
});
