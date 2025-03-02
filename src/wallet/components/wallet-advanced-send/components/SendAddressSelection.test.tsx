import { act, render, screen } from '@testing-library/react';
import type { Chain } from 'viem';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWalletContext } from '../../WalletProvider';
import { resolveAddressInput } from '../utils/resolveAddressInput';
import { SendAddressInput } from './SendAddressInput';
import { SendAddressSelection } from './SendAddressSelection';
import { SendAddressSelector } from './SendAddressSelector';
import { useSendContext } from './SendProvider';

// Mock dependencies
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
  selectedRecipientAddress: { value: null, display: '' },
  handleAddressSelection: vi.fn(),
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
        selectedRecipientAddress: mockSendContext.selectedRecipientAddress,
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

  it('does not render SendAddressSelector when selectedRecipientAddress.value exists', () => {
    vi.mocked(mockUseSendContext).mockReturnValue({
      ...mockSendContext,
      selectedRecipientAddress: {
        value: '0x1234567890123456789012345678901234567890',
        display: 'user.eth',
      },
    });

    render(<SendAddressSelection />);

    expect(SendAddressSelector).not.toHaveBeenCalled();
    expect(
      screen.queryByTestId('mock-send-address-selector'),
    ).not.toBeInTheDocument();
  });

  it('does not render SendAddressSelector when validatedInput.value is null', () => {
    render(<SendAddressSelection />);

    expect(SendAddressSelector).not.toHaveBeenCalled();
    expect(
      screen.queryByTestId('mock-send-address-selector'),
    ).not.toBeInTheDocument();
  });

  it('renders SendAddressSelector when validatedInput.value exists and no selectedRecipientAddress', async () => {
    const { rerender } = render(<SendAddressSelection />);
    const { setValidatedInput } = vi.mocked(SendAddressInput).mock.calls[0][0];

    act(() => {
      setValidatedInput({
        value: '0x1234567890123456789012345678901234567890',
        display: 'user.eth',
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
        value: '0x1234567890123456789012345678901234567890',
        display: 'user.eth',
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

  it('calls resolveAddressInput and handleAddressSelection when handleClick is triggered', async () => {
    vi.mocked(resolveAddressInput).mockResolvedValue({
      value: '0x9876543210987654321098765432109876543210',
      display: 'resolved.eth',
    });

    const { rerender } = render(<SendAddressSelection />);

    const { setValidatedInput } = vi.mocked(SendAddressInput).mock.calls[0][0];
    act(() => {
      setValidatedInput({
        value: '0x1234567890123456789012345678901234567890',
        display: 'user.eth',
      });

      rerender(<SendAddressSelection />);
    });

    const { handleClick } = vi.mocked(SendAddressSelector).mock.calls[0][0];

    await handleClick();

    expect(resolveAddressInput).toHaveBeenCalledWith(
      '0x1234567890123456789012345678901234567890',
      'user.eth',
    );
    expect(mockSendContext.handleAddressSelection).toHaveBeenCalledWith({
      value: '0x9876543210987654321098765432109876543210',
      display: 'resolved.eth',
    });
  });
});
