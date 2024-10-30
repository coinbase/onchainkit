import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TransactionStatus } from './TransactionStatus';

describe('TransactionStatus', () => {
  it('renders children correctly', () => {
    render(
      <TransactionStatus className="custom-class">
        <span>Transaction Status Content</span>
      </TransactionStatus>,
    );

    const contentElement = screen.getByText('Transaction Status Content');
    expect(contentElement).toBeInTheDocument();
    expect(contentElement.parentElement).toHaveClass(
      'flex justify-between custom-class',
    );
  });
});
