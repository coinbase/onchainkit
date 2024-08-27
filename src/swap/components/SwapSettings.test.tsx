import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useIcon } from '../../wallet/hooks/useIcon';
import { SwapSettings } from './SwapSettings';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput';
import { SwapSettingsSlippageTitle } from './SwapSettingsSlippageTitle';
import { SwapSettingsSlippageToggle } from './SwapSettingsSlippageToggle';

vi.mock('../../wallet/hooks/useIcon', () => ({
  useIcon: vi.fn(() => <svg data-testid="mock-icon" />),
}));

vi.mock('./SwapSettingsSlippageLayout', () => ({
  SwapSettingsSlippageLayout: vi.fn(({ children }) => (
    <div data-testid="mock-layout">{children}</div>
  )),
}));

vi.mock('./SwapSettingsSlippageTitle', () => ({
  SwapSettingsSlippageTitle: vi.fn(() => <div>Title</div>),
}));

vi.mock('./SwapSettingsSlippageDescription', () => ({
  SwapSettingsSlippageDescription: vi.fn(() => <div>Description</div>),
}));

vi.mock('./SwapSettingsSlippageToggle', () => ({
  SwapSettingsSlippageToggle: vi.fn(() => <div>Toggle</div>),
}));

vi.mock('./SwapSettingsSlippageInput', () => ({
  SwapSettingsSlippageInput: vi.fn(() => <div>Input</div>),
}));

const renderComponent = (props = {}) => {
  return render(
    <SwapSettings {...props}>
      <SwapSettingsSlippageTitle />
      <SwapSettingsSlippageDescription />
      <SwapSettingsSlippageToggle />
      <SwapSettingsSlippageInput />
    </SwapSettings>,
  );
};

describe('SwapSettings', () => {
  it('should render with default props', () => {
    renderComponent();
    expect(screen.getByTestId('ockSwapSettings_Settings')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('should render with custom text and className', () => {
    renderComponent({ text: 'Custom Text', className: 'custom-class' });
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
    expect(screen.getByTestId('ockSwapSettings_Settings')).toHaveClass(
      'custom-class',
    );
  });

  it('should toggle dropdown on button click', async () => {
    renderComponent();
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });

    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByTestId('ockSwapSettingsDropdown')).toBeInTheDocument();
    });

    fireEvent.click(button);
    await waitFor(() => {
      expect(
        screen.queryByTestId('ockSwapSettingsDropdown'),
      ).not.toBeInTheDocument();
    });
  });

  it('should close dropdown when clicking outside', async () => {
    render(
      <div>
        <SwapSettings />
        <div data-testid="outside">Outside</div>
      </div>,
    );
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByTestId('ockSwapSettingsDropdown')).toBeInTheDocument();
    });
    fireEvent.mouseDown(screen.getByTestId('outside'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('ockSwapSettingsDropdown'),
      ).not.toBeInTheDocument();
    });
  });

  it('should render children components when dropdown is open', async () => {
    renderComponent();
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Toggle')).toBeInTheDocument();
      expect(screen.getByText('Input')).toBeInTheDocument();
    });
  });

  it('should use custom icon when provided', () => {
    renderComponent({ icon: 'custom-icon' });
    expect(useIcon).toHaveBeenCalledWith({ icon: 'custom-icon' });
  });

  it('should keep dropdown open when clicking inside', async () => {
    renderComponent();
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByTestId('ockSwapSettingsDropdown')).toBeInTheDocument();
    });
    fireEvent.mouseDown(screen.getByTestId('ockSwapSettingsDropdown'));
    expect(screen.getByTestId('ockSwapSettingsDropdown')).toBeInTheDocument();
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderComponent();
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function),
    );
    removeEventListenerSpy.mockRestore();
  });

  it('should handle non-valid React elements as children', async () => {
    render(
      <SwapSettings>
        <SwapSettingsSlippageTitle />
        Plain text child
        <SwapSettingsSlippageInput />
      </SwapSettings>,
    );
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByTestId('ockSwapSettingsDropdown')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Plain text child')).toBeInTheDocument();
      expect(screen.getByText('Input')).toBeInTheDocument();
    });
  });
});
