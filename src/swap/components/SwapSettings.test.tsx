import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useIcon } from '../../wallet/hooks/useIcon';
import { SwapSettings } from './SwapSettings';

vi.mock('../../wallet/hooks/useIcon', () => ({
  useIcon: vi.fn(),
}));

const useIconMock = useIcon as vi.Mock;

describe('SwapSettings', () => {
  beforeEach(() => {
    useIconMock.mockReturnValue(<svg data-testid="default-icon" />);
  });

  it('renders with default title', () => {
    render(<SwapSettings />);
    const settingsContainer = screen.getByTestId('ockSwapSettings_Settings');
    expect(settingsContainer.textContent).toBe('');
  });

  it('renders with custom title', () => {
    render(<SwapSettings text="Custom" />);
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('renders default icon when no custom icon is provided', () => {
    render(<SwapSettings />);
    expect(screen.getByTestId('default-icon')).toBeInTheDocument();
  });

  it('applies correct classes to the button', () => {
    render(<SwapSettings />);
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    expect(button).toHaveClass(
      'rounded-full p-2 opacity-50 transition-opacity hover:opacity-100',
    );
  });

  it('toggles settings dropdown on button click', () => {
    const MockChild = () => <div data-testid="mock-child">Mock Child</div>;
    render(
      <SwapSettings>
        <MockChild />
      </SwapSettings>,
    );
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);
    expect(screen.getByTestId('mock-child')).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.queryByTestId('mock-child')).not.toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    const customIcon = 'customIcon';
    useIconMock.mockReturnValue(<svg data-testid="custom-icon" />);
    render(<SwapSettings icon={customIcon} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(useIconMock).toHaveBeenCalledWith({ icon: customIcon });
  });

  it('closes dropdown when clicking outside', () => {
    const MockChild = () => <div data-testid="mock-child">Mock Child</div>;
    render(
      <div>
        <SwapSettings>
          <MockChild />
        </SwapSettings>
        <div data-testid="outside">Outside</div>
      </div>,
    );
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);
    expect(screen.getByTestId('mock-child')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByTestId('mock-child')).not.toBeInTheDocument();
  });

  it('renders children correctly', () => {
    const MockChild = () => <div data-testid="mock-child">Mock Child</div>;
    render(
      <SwapSettings>
        <MockChild />
        <div>Another child</div>
      </SwapSettings>,
    );
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);
    expect(screen.getByTestId('mock-child')).toBeInTheDocument();
    expect(screen.getByText('Another child')).toBeInTheDocument();
  });

  it('handles non-element children', () => {
    render(
      <SwapSettings>
        <div>Valid child</div>
        {null}
        {undefined}
        {false}
        {42}
      </SwapSettings>,
    );
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);
    expect(screen.getByText('Valid child')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<SwapSettings className="custom-class" />);
    const container = screen.getByTestId('ockSwapSettings_Settings');
    expect(container).toHaveClass('custom-class');
  });

  it('keeps dropdown open when clicking inside', () => {
    const MockChild = () => <div data-testid="mock-child">Mock Child</div>;
    render(
      <SwapSettings>
        <MockChild />
      </SwapSettings>,
    );
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);
    fireEvent.mouseDown(screen.getByTestId('mock-child'));
    expect(screen.getByTestId('mock-child')).toBeInTheDocument();
  });
});
