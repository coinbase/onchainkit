import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useBreakpoints } from '../../useBreakpoints';
import { useIcon } from '../../wallet/hooks/useIcon';
import { SwapSettings } from './SwapSettings';

vi.mock('../../useBreakpoints', () => ({
  useBreakpoints: vi.fn(),
}));

vi.mock('../../wallet/hooks/useIcon', () => ({
  useIcon: vi.fn(),
}));

const useBreakpointsMock = useBreakpoints as vi.Mock;
const useIconMock = useIcon as vi.Mock;

describe('SwapSettings', () => {
  beforeEach(() => {
    useIconMock.mockReturnValue(<svg data-testid="default-icon" />);
    useBreakpointsMock.mockReturnValue('md');
  });

  it('renders with default title', () => {
    useBreakpointsMock.mockReturnValue('md');
    render(<SwapSettings />);
    const settingsContainer = screen.getByTestId('ockSwapSettings_Settings');
    expect(settingsContainer.textContent).toBe('');
  });

  it('renders with custom title', () => {
    useBreakpointsMock.mockReturnValue('md');
    render(<SwapSettings text="Custom" />);
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('renders default icon when no custom icon is provided', () => {
    render(<SwapSettings />);
    expect(screen.getByTestId('default-icon')).toBeInTheDocument();
  });

  it('applies correct classes to the button', () => {
    useBreakpointsMock.mockReturnValue('md');
    render(<SwapSettings />);
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    expect(button).toHaveClass(
      'rounded-full p-2 opacity-50 transition-opacity hover:opacity-100',
    );
  });

  it('renders null when breakpoint is falsy', () => {
    useBreakpointsMock.mockReturnValue(null);
    const { container } = render(<SwapSettings />);
    expect(container.firstChild).toBeNull();
  });

  it('renders mobile version for sm breakpoint', () => {
    useBreakpointsMock.mockReturnValue('sm');
    render(<SwapSettings />);
    expect(
      screen.getByText('Mobile version not implemented'),
    ).toBeInTheDocument();
  });

  it('toggles settings dropdown on button click', () => {
    useBreakpointsMock.mockReturnValue('md');
    render(<SwapSettings />);
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });

    fireEvent.click(button);
    expect(screen.getByTestId('ockSwapSettingsDropdown')).toBeInTheDocument();

    fireEvent.click(button);
    expect(
      screen.queryByTestId('ockSwapSettingsDropdown'),
    ).not.toBeInTheDocument();
  });

  it('switches between Auto and Custom slippage modes', () => {
    render(<SwapSettings />);
    fireEvent.click(
      screen.getByRole('button', { name: /toggle swap settings/i }),
    );

    const autoButton = screen.getByRole('button', { name: /auto/i });
    const customButton = screen.getByRole('button', { name: /custom/i });
    const input = screen.getByRole('textbox');

    expect(autoButton).toHaveClass('bg-white');
    expect(autoButton).toHaveClass('text-blue-600');
    expect(customButton).not.toHaveClass('bg-white');
    expect(customButton).not.toHaveClass('text-blue-600');
    expect(input).toBeDisabled();

    fireEvent.click(customButton);
    expect(autoButton).not.toHaveClass('bg-white');
    expect(autoButton).not.toHaveClass('text-blue-600');
    expect(customButton).toHaveClass('bg-white');
    expect(customButton).toHaveClass('text-blue-600');
    expect(input).not.toBeDisabled();
  });

  it('updates custom slippage value', () => {
    useBreakpointsMock.mockReturnValue('md');
    render(<SwapSettings />);
    fireEvent.click(
      screen.getByRole('button', { name: /toggle swap settings/i }),
    );

    fireEvent.click(screen.getByRole('button', { name: /custom/i }));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '1.5' } });
    expect(input).toHaveValue('1.5');
  });

  it('renders custom icon when provided', () => {
    const customIcon = 'customIcon';
    useIconMock.mockReturnValue(<svg data-testid="custom-icon" />);
    render(<SwapSettings icon={customIcon} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(useIconMock).toHaveBeenCalledWith({ icon: customIcon });
  });

  it('handles all interactions and state changes', () => {
    useBreakpointsMock.mockReturnValue('md');
    render(<SwapSettings />);
    fireEvent.click(
      screen.getByRole('button', { name: /toggle swap settings/i }),
    );
    expect(screen.getByTestId('ockSwapSettingsDropdown')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /auto/i })).toHaveClass(
      'bg-white',
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('textbox')).toHaveValue('0.5');
    fireEvent.click(screen.getByRole('button', { name: /custom/i }));
    expect(screen.getByRole('button', { name: /custom/i })).toHaveClass(
      'bg-white',
    );
    expect(screen.getByRole('textbox')).not.toBeDisabled();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1.5' } });
    expect(screen.getByRole('textbox')).toHaveValue('1.5');
    fireEvent.click(screen.getByRole('button', { name: /auto/i }));
    expect(screen.getByRole('button', { name: /auto/i })).toHaveClass(
      'bg-white',
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
    fireEvent.click(
      screen.getByRole('button', { name: /toggle swap settings/i }),
    );
    expect(
      screen.queryByTestId('ockSwapSettingsDropdown'),
    ).not.toBeInTheDocument();
  });
});
