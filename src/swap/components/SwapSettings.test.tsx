import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIcon } from '../../internal/hooks/useIcon';
import { useBreakpoints } from '../../useBreakpoints';
import { SwapSettings } from './SwapSettings';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput';
import { SwapSettingsSlippageTitle } from './SwapSettingsSlippageTitle';

vi.mock('../../internal/hooks/useIcon', () => ({
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

vi.mock('../../useBreakpoints', () => ({
  useBreakpoints: vi.fn(),
}));

const useBreakpointsMock = useBreakpoints as Mock;

const renderComponent = (props = {}) => {
  return render(
    <SwapSettings {...props}>
      <SwapSettingsSlippageTitle />
      <SwapSettingsSlippageDescription />
      <SwapSettingsSlippageInput />
    </SwapSettings>,
  );
};

describe('SwapSettings', () => {
  beforeEach(() => {
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
        />
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
    fireEvent.click(screen.getByTestId('outside'));
    await waitFor(() => {
      expect(
        screen.queryByTestId('ockSwapSettingsDropdown'),
      ).not.toBeInTheDocument();
    });
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

  it('renders SwapSettingsSlippageLayoutBottomSheet when breakpoint is "sm"', async () => {
    useBreakpointsMock.mockReturnValue('sm');
    renderComponent();
    const button = screen.getByRole('button', {
      name: /toggle swap settings/i,
    });
    const initialBottomSheet = screen.getByTestId(
      'ockSwapSettingsSlippageLayoutBottomSheet_container',
    );
    expect(initialBottomSheet).toHaveClass('ease-in-out');
    expect(initialBottomSheet).toHaveClass('group-[]:bottom-0');
    fireEvent.click(button);
    await waitFor(() => {
      const parentDiv = screen
        .getByTestId('ockSwapSettings_Settings')
        .querySelector('div');
      expect(parentDiv).toHaveClass('group');
      const openBottomSheet = screen.getByTestId(
        'ockSwapSettingsSlippageLayoutBottomSheet_container',
      );
      expect(openBottomSheet).toHaveClass('group-[]:bottom-0');
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
      expect(closedBottomSheet).toHaveClass('ease-in-out');
    });
  });

  it('removes event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderComponent();
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
      { capture: true },
    );
    removeEventListenerSpy.mockRestore();
  });
});
