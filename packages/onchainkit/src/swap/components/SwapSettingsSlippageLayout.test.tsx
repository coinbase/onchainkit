import { render, screen } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput';
import { SwapSettingsSlippageLayout } from './SwapSettingsSlippageLayout';
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

describe('SwapSettingsSlippageLayout', () => {
  it('renders with all child components', () => {
    render(
      <SwapSettingsSlippageLayout>
        <SwapSettingsSlippageTitle>Title</SwapSettingsSlippageTitle>
        <SwapSettingsSlippageDescription>
          Description
        </SwapSettingsSlippageDescription>
        <SwapSettingsSlippageInput />
      </SwapSettingsSlippageLayout>,
    );
    expect(
      screen.getByTestId('ockSwapSettingsLayout_container'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-title')).toBeInTheDocument();
    expect(screen.getByTestId('mock-description')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input')).toBeInTheDocument();
  });
});
