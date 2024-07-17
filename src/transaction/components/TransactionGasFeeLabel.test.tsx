import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransactionGasFeeLabel } from './TransactionGasFeeLabel';

describe('TransactionGasFeeLabel', () => {
  it('renders child component correctly', () => {
    render(<TransactionGasFeeLabel />);

    const element = screen.getByText('Gas fee');
    expect(element).toBeInTheDocument();
  });
});
