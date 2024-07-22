import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransactionSponsor } from './TransactionSponsor';

describe('TransactionSponsor', () => {
  it('renders correctly', () => {
    render(<TransactionSponsor />);

    const element = screen.getByText('Free gas');
    expect(element).toBeInTheDocument();
  });
  it('renders correctly when provided sponsor name as prop', () => {
    render(<TransactionSponsor text="Coinbase" />);

    const element = screen.getByText('Free gas');
    expect(element).toBeInTheDocument();
    const sponsor = screen.getByText('Coinbase');
    expect(sponsor).toBeInTheDocument();
  });
});
