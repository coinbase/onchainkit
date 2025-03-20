import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CheckoutStatus } from './CheckoutStatus';

vi.mock('../hooks/useGetCheckoutStatus', () => ({
  useGetCheckoutStatus: vi.fn(() => ({
    label: 'Test Label',
    labelClassName: 'test-label-class',
  })),
}));

vi.mock('../../styles/theme', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' '),
  text: {
    label2: 'text-label2',
  },
}));

describe('CheckoutStatus', () => {
  it('renders correctly with custom class', () => {
    render(<CheckoutStatus className="custom-class" />);

    const labelElement = screen.getByText('Test Label');
    expect(labelElement).toBeDefined();

    const outerDiv = labelElement.closest('div')?.parentElement;
    expect(outerDiv?.className).toContain('flex justify-between custom-class');
  });
});
