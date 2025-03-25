import { TextInput } from '@/internal/components/TextInput';
import { render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveAddressInput } from '../utils/resolveAddressInput';
import { validateAddressInput } from '../utils/validateAddressInput';
import { SendAddressInput } from './SendAddressInput';

vi.mock('@/internal/components/TextInput', () => ({
  TextInput: vi.fn(() => <input data-testid="mock-text-input" />),
}));

vi.mock('../utils/resolveAddressInput', () => ({
  resolveAddressInput: vi.fn(),
}));

vi.mock('../utils/validateAddressInput', () => ({
  validateAddressInput: vi.fn(),
}));

describe('SendAddressInput', () => {
  const mockProps = {
    selectedRecipient: { address: null, displayValue: '' },
    recipientInput: '',
    setRecipientInput: vi.fn(),
    setValidatedInput: vi.fn(),
    handleRecipientInputChange: vi.fn(),
    classNames: {
      container: 'custom-container',
      label: 'custom-label',
      input: 'custom-input',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct structure and classes', () => {
    render(<SendAddressInput {...mockProps} />);

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
    const props = {
      ...mockProps,
      selectedRecipient: {
        address: '0x1234567890123456789012345678901234567890' as Address,
        displayValue: 'user.eth',
      },
    };

    render(<SendAddressInput {...props} />);

    expect(TextInput).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'user.eth',
      }),
      {},
    );
  });

  it('displays recipientInput when no selectedRecipient.displayValue', () => {
    const props = {
      ...mockProps,
      selectedRecipient: { address: null, displayValue: '' },
      recipientInput: 'test-input',
    };

    render(<SendAddressInput {...props} />);

    expect(TextInput).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'test-input',
      }),
      {},
    );
  });

  it('calls handleRecipientInputChange on focus when selectedRecipient.address exists', () => {
    const props = {
      ...mockProps,
      selectedRecipient: {
        address: '0x1234567890123456789012345678901234567890' as Address,
        displayValue: 'user.eth',
      },
    };

    render(<SendAddressInput {...props} />);

    const { onFocus } = vi.mocked(TextInput).mock.calls[0][0];

    onFocus?.({} as React.FocusEvent<HTMLInputElement>);

    expect(props.handleRecipientInputChange).toHaveBeenCalled();
  });

  it('does not call handleRecipientInputChange on focus when selectedRecipient.address does not exist', () => {
    render(<SendAddressInput {...mockProps} />);

    const { onFocus } = vi.mocked(TextInput).mock.calls[0][0];

    onFocus?.({} as React.FocusEvent<HTMLInputElement>);

    expect(mockProps.handleRecipientInputChange).not.toHaveBeenCalled();
  });

  it('calls setRecipientInput when TextInput setValue is called', () => {
    render(<SendAddressInput {...mockProps} />);

    const { setValue } = vi.mocked(TextInput).mock.calls[0][0];

    setValue?.('new-input');

    expect(mockProps.setRecipientInput).toHaveBeenCalledWith('new-input');
  });

  it('calls resolveAddressInput and setValidatedInput when input changes', async () => {
    vi.mocked(resolveAddressInput).mockResolvedValue({
      address: '0x456',
      displayValue: 'resolved.eth',
    });

    render(<SendAddressInput {...mockProps} />);

    const { onChange } = vi.mocked(TextInput).mock.calls[0][0];

    await onChange?.('new-input');

    expect(resolveAddressInput).toHaveBeenCalledWith(null, 'new-input');
    expect(mockProps.setValidatedInput).toHaveBeenCalledWith({
      address: '0x456',
      displayValue: 'resolved.eth',
    });
  });

  it('uses validateAddressInput for input validation', () => {
    vi.mocked(validateAddressInput).mockResolvedValue(
      '0x1234567890123456789012345678901234567890',
    );

    render(<SendAddressInput {...mockProps} />);

    const { inputValidator } = vi.mocked(TextInput).mock.calls[0][0];

    inputValidator?.('test-input');

    expect(validateAddressInput).toHaveBeenCalledWith('test-input');
  });
});
