import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransactionGasFeeSponsoredBy } from './TransactionGasFeeSponsoredBy';

describe('TransactionGasFeeSponsoredBy', () => {
  it('renders with default sponsor', () => {
    render(<TransactionGasFeeSponsoredBy />);

    const element = screen.getByText('Coinbase');
    expect(element).toBeInTheDocument();
  });
});
