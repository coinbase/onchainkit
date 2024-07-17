import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransactionGasFeeSponsor } from './TransactionGasFeeSponsor';

describe('TransactionGasFeeSponsor', () => {
  it('renders with default sponsor', () => {
    render(<TransactionGasFeeSponsor />);

    const element = screen.getByText('Coinbase');
    expect(element).toBeInTheDocument();
  });
});
