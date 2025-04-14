import { TextInput } from '@/internal/components/TextInput';
import { render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SendAddressInput } from './SendAddressInput';
import { useSendContext } from './SendProvider';

vi.mock('@/internal/components/TextInput', () => ({
  TextInput: vi.fn(() => <input data-testid="mock-text-input" />),
}));

vi.mock('../utils/resolveAddressInput', () => ({
  resolveAddressInput: vi.fn(),
}));

vi.mock('../utils/validateAddressInput', () => ({
  validateAddressInput: vi.fn(),
}));

vi.mock('./SendProvider', () => ({
  useSendContext: vi.fn(),
}));

const mockClassNames = {
  container: 'custom-container',
  label: 'custom-label',
  input: 'custom-input',
};

const mockSendContext = {
  recipientState: {
    phase: 'input',
    input: '',
    address: null,
    displayValue: null,
  },
  updateRecipientInput: vi.fn(),
  validateRecipientInput: vi.fn(),
  deselectRecipient: vi.fn(),
};

describe('SendAddressInput', () => {
  const mockUseSendContext = useSendContext as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSendContext.mockReturnValue(mockSendContext);
  });

  it('renders with correct structure and classes', () => {
    render(<SendAddressInput classNames={mockClassNames} />);

    const container = screen.getByTestId('ockSendAddressInput');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('custom-container');

    const label = screen.getByText('To');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('custom-label');

    expect(TextInput).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.stringContaining('custom-input'),
        placeholder: 'Basename, ENS, or Address',
        'aria-label': 'Input Receiver Address',
      }),
      {},
    );
  });

  it('displays selectedRecipient.displayValue when available', () => {
    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      recipientState: {
        phase: 'selected',
        input: 'test.base.eth',
        address: '0x1234567890123456789012345678901234567890' as Address,
        displayValue: 'test.base.eth',
      },
    });

    render(<SendAddressInput classNames={mockClassNames} />);

    expect(TextInput).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'test.base.eth',
      }),
      {},
    );
  });

  it('displays recipientInput when no selectedRecipient.displayValue', () => {
    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      recipientState: {
        phase: 'selected',
        input: '0x1234567890123456789012345678901234567890',
        address: '0x1234567890123456789012345678901234567890' as Address,
        displayValue: null,
      },
    });

    render(<SendAddressInput classNames={mockClassNames} />);

    expect(TextInput).toHaveBeenCalledWith(
      expect.objectContaining({
        value: '0x1234567890123456789012345678901234567890',
      }),
      {},
    );
  });

  it('calls deselectRecipient on focus', () => {
    mockUseSendContext.mockReturnValue({
      ...mockSendContext,
      recipientState: {
        phase: 'selected',
        input: '0x1234567890123456789012345678901234567890',
        address: '0x1234567890123456789012345678901234567890' as Address,
        displayValue: '0x1234567890123456789012345678901234567890',
      },
    });

    render(<SendAddressInput classNames={mockClassNames} />);

    const { onFocus } = vi.mocked(TextInput).mock.calls[0][0];

    onFocus?.({} as React.FocusEvent<HTMLInputElement>);

    expect(mockSendContext.deselectRecipient).toHaveBeenCalled();
  });

  it('calls updateRecipientInput when TextInput setValue is called', () => {
    render(<SendAddressInput classNames={mockClassNames} />);

    const { setValue } = vi.mocked(TextInput).mock.calls[0][0];

    setValue?.('new-input');

    expect(mockSendContext.updateRecipientInput).toHaveBeenCalledWith(
      'new-input',
    );
  });
});
