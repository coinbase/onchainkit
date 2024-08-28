import { render, screen } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput';
import { SwapSettingsSlippageLayoutBottomSheet } from './SwapSettingsSlippageLayoutBottomSheet';
import { SwapSettingsSlippageTitle } from './SwapSettingsSlippageTitle';
import { SwapSettingsSlippageToggle } from './SwapSettingsSlippageToggle';

vi.mock('./SwapSettingsSlippageTitle', () => ({
  SwapSettingsSlippageTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-title">{children}</div>
  ),
}));

vi.mock('./SwapSettingsSlippageDescription', () => ({
  SwapSettingsSlippageDescription: ({
    children,
  }: { children: React.ReactNode }) => (
    <div data-testid="mock-description">{children}</div>
  ),
}));

vi.mock('./SwapSettingsSlippageToggle', () => ({
  SwapSettingsSlippageToggle: ({
    customSlippageEnabled,
  }: { customSlippageEnabled: boolean; onToggle: () => void }) => (
    <div data-testid="mock-toggle">
      Toggle {customSlippageEnabled ? 'Enabled' : 'Disabled'}
    </div>
  ),
}));

vi.mock('./SwapSettingsSlippageInput', () => ({
  SwapSettingsSlippageInput: ({
    customSlippageEnabled,
  }: { customSlippageEnabled: boolean }) => (
    <div data-testid="mock-input">
      Input {customSlippageEnabled ? 'Enabled' : 'Disabled'}
    </div>
  ),
}));

vi.mock('../../styles/theme', () => ({
  cn: (...args: string[]) => args.join(' '),
}));

describe('SwapSettingsSlippageLayoutBottomSheet', () => {
  it('renders with all child components', () => {
    render(
      <SwapSettingsSlippageLayoutBottomSheet
        customSlippageEnabled={false}
        onToggleCustomSlippage={vi.fn()}
      >
        <SwapSettingsSlippageTitle>Title</SwapSettingsSlippageTitle>
        <SwapSettingsSlippageDescription>
          Description
        </SwapSettingsSlippageDescription>
        <SwapSettingsSlippageToggle />
        <SwapSettingsSlippageInput />
      </SwapSettingsSlippageLayoutBottomSheet>,
    );
    expect(
      screen.getByTestId('ockSwapSettingsLayout_container'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-title')).toBeInTheDocument();
    expect(screen.getByTestId('mock-description')).toBeInTheDocument();
    expect(screen.getByTestId('mock-toggle')).toHaveTextContent(
      'Toggle Disabled',
    );
    expect(screen.getByTestId('mock-input')).toHaveTextContent(
      'Input Disabled',
    );
  });

  it('renders with enhanced toggle and input when customSlippageEnabled is true', () => {
    render(
      <SwapSettingsSlippageLayoutBottomSheet
        customSlippageEnabled={true}
        onToggleCustomSlippage={vi.fn()}
      >
        <SwapSettingsSlippageToggle />
        <SwapSettingsSlippageInput />
      </SwapSettingsSlippageLayoutBottomSheet>,
    );
    expect(screen.getByTestId('mock-toggle')).toHaveTextContent(
      'Toggle Enabled',
    );
    expect(screen.getByTestId('mock-input')).toHaveTextContent('Input Enabled');
  });

  it('applies custom className', () => {
    render(
      <SwapSettingsSlippageLayoutBottomSheet
        className="custom-class"
        customSlippageEnabled={false}
        onToggleCustomSlippage={vi.fn()}
      >
        <SwapSettingsSlippageTitle>Title</SwapSettingsSlippageTitle>
      </SwapSettingsSlippageLayoutBottomSheet>,
    );
    const container = screen.getByTestId('ockSwapSettingsLayout_container');
    expect(container.className).toContain('custom-class');
  });

  it('renders without any child components', () => {
    render(
      <SwapSettingsSlippageLayoutBottomSheet
        customSlippageEnabled={false}
        onToggleCustomSlippage={vi.fn()}
      />,
    );
    expect(
      screen.getByTestId('ockSwapSettingsLayout_container'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('mock-title')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-description')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-toggle')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-input')).not.toBeInTheDocument();
  });

  it('handles toggle and input rendering properly based on customSlippageEnabled prop', () => {
    const { rerender } = render(
      <SwapSettingsSlippageLayoutBottomSheet
        customSlippageEnabled={false}
        onToggleCustomSlippage={vi.fn()}
      >
        <SwapSettingsSlippageToggle />
        <SwapSettingsSlippageInput />
      </SwapSettingsSlippageLayoutBottomSheet>,
    );
    expect(screen.getByTestId('mock-toggle')).toHaveTextContent(
      'Toggle Disabled',
    );
    expect(screen.getByTestId('mock-input')).toHaveTextContent(
      'Input Disabled',
    );
    rerender(
      <SwapSettingsSlippageLayoutBottomSheet
        customSlippageEnabled={true}
        onToggleCustomSlippage={vi.fn()}
      >
        <SwapSettingsSlippageToggle />
        <SwapSettingsSlippageInput />
      </SwapSettingsSlippageLayoutBottomSheet>,
    );
    expect(screen.getByTestId('mock-toggle')).toHaveTextContent(
      'Toggle Enabled',
    );
    expect(screen.getByTestId('mock-input')).toHaveTextContent('Input Enabled');
  });
});
