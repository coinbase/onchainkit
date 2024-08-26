import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription';

vi.mock('../../styles/theme', () => ({
  cn: (...args: string[]) => args.join(' '),
}));

describe('SwapSettingsSlippageDescription', () => {
  it('renders children correctly', () => {
    render(
      <SwapSettingsSlippageDescription>
        Test Description
      </SwapSettingsSlippageDescription>,
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(
      <SwapSettingsSlippageDescription>Test</SwapSettingsSlippageDescription>,
    );
    const paragraph = screen.getByText('Test');
    expect(paragraph.className).toContain(
      'mb-2 font-normal font-sans text-gray-600 text-xs leading-4 dark:text-gray-400',
    );
  });

  it('merges custom className with default classes', () => {
    render(
      <SwapSettingsSlippageDescription className="custom-class">
        Test
      </SwapSettingsSlippageDescription>,
    );
    const paragraph = screen.getByText('Test');
    expect(paragraph.className).toContain('custom-class');
    expect(paragraph.className).toContain(
      'mb-2 font-normal font-sans text-gray-600 text-xs leading-4 dark:text-gray-400',
    );
  });

  it('renders without children', () => {
    const { container } = render(<SwapSettingsSlippageDescription />);
    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph?.textContent).toBe('');
  });

  it('renders with complex children', () => {
    render(
      <SwapSettingsSlippageDescription>
        <span>Complex</span> <strong>Children</strong>
      </SwapSettingsSlippageDescription>,
    );
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Children')).toBeInTheDocument();
  });
});
