import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SwapSettingsSlippageTitle } from './SwapSettingsSlippageTitle';

vi.mock('../../styles/theme', () => ({
  cn: (...args: string[]) => args.join(' '),
}));

describe('SwapSettingsSlippageTitle', () => {
  it('renders children correctly', () => {
    render(
      <SwapSettingsSlippageTitle>Slippage Tolerance</SwapSettingsSlippageTitle>,
    );
    expect(screen.getByText('Slippage Tolerance')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<SwapSettingsSlippageTitle>Test</SwapSettingsSlippageTitle>);
    const heading = screen.getByText('Test');
    expect(heading.className).toContain(
      '--text-ock-foreground mb-2 font-semibold text-base leading-normal',
    );
  });

  it('merges custom className with default classes', () => {
    render(
      <SwapSettingsSlippageTitle className="custom-class">
        Test
      </SwapSettingsSlippageTitle>,
    );
    const heading = screen.getByText('Test');
    expect(heading.className).toContain('custom-class');
    expect(heading.className).toContain(
      '--text-ock-foreground mb-2 font-semibold text-base leading-normal',
    );
  });

  it('renders without children', () => {
    const { container } = render(<SwapSettingsSlippageTitle />);
    const heading = container.querySelector('h3');
    expect(heading).toBeInTheDocument();
    expect(heading?.textContent).toBe('');
  });

  it('renders with complex children', () => {
    render(
      <SwapSettingsSlippageTitle>
        <span>Complex</span> <strong>Children</strong>
      </SwapSettingsSlippageTitle>,
    );
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  it('renders as an h3 element', () => {
    render(<SwapSettingsSlippageTitle>Test</SwapSettingsSlippageTitle>);
    const heading = screen.getByText('Test');
    expect(heading.tagName).toBe('H3');
  });
});
