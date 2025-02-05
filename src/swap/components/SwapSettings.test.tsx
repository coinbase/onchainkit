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

vi.mock('../../internal/components/DismissableLayer', () => ({
  DismissableLayer: vi.fn(({ children, onDismiss }) => (
    <div
      data-testid="mock-dismissable-layer"
      onClick={onDismiss}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onDismiss();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  )),
}));

vi.mock('../../internal/components/Popover', () => ({
  Popover: vi.fn(({ children, isOpen, onClose }) =>
    isOpen ? (
      <div
        data-testid="mock-popover"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    ) : null,
  ),
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

    fireEvent.click(screen.getByTestId('mock-popover'));

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

  it('renders SwapSettingsSlippageLayoutBottomSheet when breakpoint is "sm"', async () => {
    useBreakpointsMock.mockReturnValue('sm');
    renderComponent();
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });

    const initialBottomSheet = screen.getByTestId(
      'ockSwapSettingsSlippageLayoutBottomSheet_container',
    );
    expect(initialBottomSheet).toHaveClass('transition-[bottom]');
    expect(initialBottomSheet).toHaveClass('duration-300');
    expect(initialBottomSheet).toHaveClass('-bottom-[12.875rem]');

    fireEvent.click(button);

    await waitFor(() => {
      const parentDiv = screen
        .getByTestId('ockSwapSettings_Settings')
        .querySelector('div');
      expect(parentDiv).toHaveClass('group');

      const openBottomSheet = screen.getByTestId(
        'ockSwapSettingsSlippageLayoutBottomSheet_container',
      );
      expect(openBottomSheet).toHaveClass('bottom-0');
    });

    fireEvent.click(button);

    await waitFor(() => {
      const parentDiv = screen
        .getByTestId('ockSwapSettings_Settings')
        .querySelector('div');
      expect(parentDiv).not.toHaveClass('group');

      const closedBottomSheet = screen.getByTestId(
        'ockSwapSettingsSlippageLayoutBottomSheet_container',
      );
      expect(closedBottomSheet).toHaveClass('-bottom-[12.875rem]');
    });
  });

  it('renders mobile view with FocusTrap and DismissableLayer when breakpoint is "sm"', async () => {
    useBreakpointsMock.mockReturnValue('sm');
    renderComponent();

    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('mock-focus-trap')).toBeInTheDocument();
      expect(screen.getByTestId('mock-dismissable-layer')).toBeInTheDocument();
      expect(screen.getByTestId('mock-bottom-sheet')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('mock-dismissable-layer'));
    await waitFor(() => {
      const bottomSheet = screen.getByTestId(
        'ockSwapSettingsSlippageLayoutBottomSheet_container',
      );
      expect(bottomSheet).toHaveClass('-bottom-[12.875rem]');
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
      expect(screen.getByTestId('mock-popover')).toBeInTheDocument();
      expect(screen.getByTestId('ockSwapSettingsDropdown')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('mock-popover'));
    await waitFor(() => {
      expect(screen.queryByTestId('mock-popover')).not.toBeInTheDocument();
    });
  });
});
