import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FundCardHeader } from './FundCardHeader';
import { FundCardProvider } from './FundCardProvider';

describe('FundCardHeader', () => {
  it('renders the provided headerText', () => {
    render(
      <FundCardProvider asset="ETH" headerText="Custom header">
        <FundCardHeader />
      </FundCardProvider>,
    );
    expect(screen.getByTestId('fundCardHeader')).toHaveTextContent(
      'Custom header',
    );
  });

  it('renders the default header text when headerText is not provided', () => {
    render(
      <FundCardProvider asset="ETH">
        <FundCardHeader />
      </FundCardProvider>,
    );
    expect(screen.getByTestId('fundCardHeader')).toHaveTextContent('Buy ETH');
  });
});
