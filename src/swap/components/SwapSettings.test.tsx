import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useBreakpoints } from '../../useBreakpoints';
import { SwapSettings } from './SwapSettings';

vi.mock('../../useBreakpoints', () => ({
  useBreakpoints: vi.fn(),
}));

const useBreakpointsMock = useBreakpoints as vi.Mock;

describe('SwapSettings', () => {
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

  it('renders custom icon when provided', () => {
    useBreakpointsMock.mockReturnValue('md');
    const CustomIcon = () => (
      <svg data-testid="custom-icon" aria-hidden="true" focusable="false">
        <title>Custom Icon</title>
      </svg>
    );
    render(<SwapSettings icon={<CustomIcon />} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
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
});
