import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { useBreakpoints } from '../../internal/hooks/useBreakpoints';
import { useIcon } from '../../internal/hooks/useIcon';
import { SwapSettings } from './SwapSettings';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput';
import { SwapSettingsSlippageTitle } from './SwapSettingsSlippageTitle';

vi.mock('@/internal/hooks/useIcon', () => ({
  useIcon: vi.fn(() => <svg data-testid="mock-icon" />),
}));

vi.mock('./SwapSettingsSlippageLayout', () => ({
  SwapSettingsSlippageLayout: vi.fn(({ children }) => (
    <div data-testid="mock-layout">{children}</div>
  )),
}));

vi.mock('./SwapSettingsSlippageLayoutBottomSheet', () => ({
  SwapSettingsSlippageLayoutBottomSheet: vi.fn(({ children }) => (
    <div data-testid="mock-bottom-sheet">{children}</div>
  )),
}));

vi.mock('./SwapSettingsSlippageTitle', () => ({
  SwapSettingsSlippageTitle: vi.fn(() => <div>Title</div>),
}));

vi.mock('./SwapSettingsSlippageDescription', () => ({
  SwapSettingsSlippageDescription: vi.fn(() => <div>Description</div>),
}));

vi.mock('./SwapSettingsSlippageInput', () => ({
  SwapSettingsSlippageInput: vi.fn(() => <div>Input</div>),
}));

vi.mock('@/internal/hooks/useBreakpoints', () => ({
  useBreakpoints: vi.fn(),
}));

vi.mock('../../internal/components/FocusTrap', () => ({
  FocusTrap: vi.fn(({ children }) => (
    <div data-testid="mock-focus-trap">{children}</div>
  )),
}));

const useBreakpointsMock = useBreakpoints as Mock;

const renderComponent = (props = {}) => {
  return render(
    <SwapSettings {...props}>
      <SwapSettingsSlippageTitle>Title</SwapSettingsSlippageTitle>
      <SwapSettingsSlippageDescription>
        Description
      </SwapSettingsSlippageDescription>
      <SwapSettingsSlippageInput />
    </SwapSettings>,
  );
};

describe('SwapSettings', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    vi.clearAllMocks();
    useBreakpointsMock.mockReturnValue('md');
  });

  it('should render with default props and handle dropdown toggle for desktop', async () => {
    renderComponent();
    expect(screen.getByTestId('ockSwapSettings_Settings')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByTestId('ockSwapSettingsDropdown')).toBeInTheDocument();
      expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Input')).toBeInTheDocument();
    });
    fireEvent.click(button);
    await waitFor(() => {
      expect(
        screen.queryByTestId('ockSwapSettingsDropdown'),
      ).not.toBeInTheDocument();
    });
  });

  it('should render with custom props and handle outside click', async () => {
    render(
      <div>
        <SwapSettings
          text="Custom Text"
          className="custom-class"
          icon="custom-icon"
        >
          test
        </SwapSettings>
        <div data-testid="outside">Outside</div>
      </div>,
    );
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
    expect(screen.getByTestId('ockSwapSettings_Settings')).toHaveClass(
      'custom-class',
    );
    expect(useIcon).toHaveBeenCalledWith({ icon: 'custom-icon' });

    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('ockSwapSettingsDropdown')).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole('button', { name: /toggle swap settings/i }),
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId('ockSwapSettingsDropdown'),
      ).not.toBeInTheDocument();
    });
  });

  it('should handle non-valid React elements as children', async () => {
    render(
      <SwapSettings>
        <SwapSettingsSlippageTitle>Title</SwapSettingsSlippageTitle>
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

  it('renders mobile view with Sheet when breakpoint is "sm"', async () => {
    useBreakpointsMock.mockReturnValue('sm');
    renderComponent();

    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('ockSheet')).toBeInTheDocument();
    });
  });

  it('renders desktop view with Popover when breakpoint is not "sm"', async () => {
    useBreakpointsMock.mockReturnValue('md');
    renderComponent();

    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /toggle swap settings/i }),
      ).toBeInTheDocument();
      expect(screen.getByTestId('ockSwapSettingsDropdown')).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole('button', { name: /toggle swap settings/i }),
    );
    await waitFor(() => {
      expect(
        screen.queryByTestId('ockSwapSettingsDropdown'),
      ).not.toBeInTheDocument();
    });
  });

  it('closes the sheet when Escape key is pressed', async () => {
    useBreakpointsMock.mockReturnValue('sm');
    renderComponent();

    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('ockSheet')).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByTestId('ockSheet')).not.toBeInTheDocument();
    });
  });
});
