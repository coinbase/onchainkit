import { render, screen } from '@testing-library/react';
import { describe, it, expect, } from 'vitest';
import { TransactionGasFee } from './TransactionGasFee';

describe('TransactionGasFee', () => {
  it('renders children correctly', () => {
    render(
      <TransactionGasFee className="custom-class">
        <span>Transaction Gas Fee Content</span>
      </TransactionGasFee>,
    );

    const contentElement = screen.getByText('Transaction Gas Fee Content');
    expect(contentElement).toBeInTheDocument();
  });
});
