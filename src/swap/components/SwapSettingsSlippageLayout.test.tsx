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
  }: { children: React.ReactNode }) => (
    <div data-testid="mock-description">{children}</div>
  ),
}));

vi.mock('./SwapSettingsSlippageInput', () => ({
  SwapSettingsSlippageInput: () => <div data-testid="mock-input">Input</div>,
}));

vi.mock('../../styles/theme', () => ({
  cn: (...args: string[]) => args.join(' '),
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

  it('renders with only some child components', () => {
    render(
      <SwapSettingsSlippageLayout>
        <SwapSettingsSlippageTitle>Title</SwapSettingsSlippageTitle>
      </SwapSettingsSlippageLayout>,
    );
    expect(
      screen.getByTestId('ockSwapSettingsLayout_container'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-title')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-description')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-input')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <SwapSettingsSlippageLayout className="custom-class">
        <SwapSettingsSlippageTitle>Title</SwapSettingsSlippageTitle>
      </SwapSettingsSlippageLayout>,
    );
    const container = screen.getByTestId('ockSwapSettingsLayout_container');
    expect(container.className).toContain('custom-class');
  });

  it('renders without any child components', () => {
    render(<SwapSettingsSlippageLayout />);
    expect(
      screen.getByTestId('ockSwapSettingsLayout_container'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('mock-title')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-description')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-toggle')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-input')).not.toBeInTheDocument();
  });

  it('renders with correct layout structure', () => {
    render(
      <SwapSettingsSlippageLayout>
        <SwapSettingsSlippageTitle>Title</SwapSettingsSlippageTitle>
        <SwapSettingsSlippageDescription>
          Description
        </SwapSettingsSlippageDescription>
        <SwapSettingsSlippageInput />
      </SwapSettingsSlippageLayout>,
    );
    const container = screen.getByTestId('ockSwapSettingsLayout_container');
    expect(container.children[0]).toHaveTextContent('Title');
    expect(container.children[1]).toHaveTextContent('Description');
    expect(container.children[2].children[0]).toHaveTextContent('Input');
  });
});
