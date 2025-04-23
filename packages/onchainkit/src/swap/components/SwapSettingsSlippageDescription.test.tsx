'use client';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription';

vi.mock('../../styles/theme', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../styles/theme')>();
  return {
    ...actual,
    cn: (...args: string[]) => args.join(' '),
    // Keep the original 'text' export
  };
});

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
      'ock-font-family text-xs ock-text-foreground-muted mb-2 ',
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
      'ock-font-family text-xs ock-text-foreground-muted mb-2 custom-class',
    );
  });

  it('renders without children', () => {
    const { container } = render(
      <SwapSettingsSlippageDescription>
        Description
      </SwapSettingsSlippageDescription>,
    );
    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph?.textContent).toBe('Description');
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
