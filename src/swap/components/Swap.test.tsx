import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Swap } from './Swap';

vi.mock('./SwapProvider', () => ({
  SwapProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-SwapProvider">{children}</div>
  ),
  useSwapContext: vi.fn(),
}));

vi.mock('@/internal/svg/closeSvg', () => ({
  CloseSvg: () => <div data-testid="mock-close-svg" />,
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('@/styles/theme', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../styles/theme')>();
  return {
    ...actual,
    background: { default: 'bg-default' },
    border: { radius: 'border-radius' },
    color: { foreground: 'text-foreground' },
    text: { title3: 'text-title3' },
    cn: (...args: string[]) => args.filter(Boolean).join(' '),
    icon: {
      foreground: 'icon-foreground-class',
    },
  };
});

describe('Swap Component', () => {
  it('should render the title correctly', () => {
    render(<Swap title="Test Swap">Test Swap</Swap>);

    const title = screen.getByTestId('ockSwap_Title');
    expect(title).toHaveTextContent('Test Swap');
  });

  it('should pass className to container div', () => {
    render(<Swap className="custom-class">Test Swap</Swap>);

    const container = screen.getByTestId('ockSwap_Container');
    expect(container).toHaveClass('custom-class');
  });
});
