import { render, screen } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput';
import { SwapSettingsSlippageLayoutBottomSheet } from './SwapSettingsSlippageLayoutBottomSheet';
import { SwapSettingsSlippageTitle } from './SwapSettingsSlippageTitle';

vi.mock('./SwapSettingsSlippageTitle', () => ({
  SwapSettingsSlippageTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-title">{children}</div>
  ),
}));

vi.mock('./SwapSettingsSlippageDescription', () => ({
  SwapSettingsSlippageDescription: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="mock-description">{children}</div>,
}));

vi.mock('./SwapSettingsSlippageInput', () => ({
  SwapSettingsSlippageInput: () => <div data-testid="mock-input">Input</div>,
}));

vi.mock('../styles/theme', () => ({
  cn: (...args: string[]) => args.join(' '),
  background: { default: 'bg-default' },
  border: { default: 'border-default' },
  pressable: { shadow: 'pressable-shadow' },
}));

describe('SwapSettingsSlippageLayoutBottomSheet', () => {
  it('renders with all child components', () => {
    render(
      <SwapSettingsSlippageLayoutBottomSheet>
        <SwapSettingsSlippageTitle>Title</SwapSettingsSlippageTitle>
        <SwapSettingsSlippageDescription>
          Description
        </SwapSettingsSlippageDescription>
        <SwapSettingsSlippageInput />
      </SwapSettingsSlippageLayoutBottomSheet>,
    );
    expect(
      screen.getByTestId('ockSwapSettingsLayout_container'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-title')).toBeInTheDocument();
    expect(screen.getByTestId('mock-description')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <SwapSettingsSlippageLayoutBottomSheet className="custom-class">
        <SwapSettingsSlippageTitle>Title</SwapSettingsSlippageTitle>
      </SwapSettingsSlippageLayoutBottomSheet>,
    );
    const container = screen.getByTestId('ockSwapSettingsLayout_container');
    expect(container.className).toContain('custom-class');
  });

  it('renders without any valid child components', () => {
    render(
      <SwapSettingsSlippageLayoutBottomSheet>
        test
      </SwapSettingsSlippageLayoutBottomSheet>,
    );
    expect(
      screen.getByTestId('ockSwapSettingsLayout_container'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('mock-title')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-description')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-input')).not.toBeInTheDocument();
  });
});
