import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { FundCardHeader } from './FundCardHeader';
import { FundCardProvider } from './FundCardProvider';

describe('FundCardHeader', () => {
  beforeEach(() => {
    setOnchainKitConfig({ apiKey: 'mock-api-key' });
  });

  it('renders the provided headerText', () => {
    render(
      <FundCardProvider asset="ETH" country="US" headerText="Custom header">
        <FundCardHeader />
      </FundCardProvider>,
    );
    expect(screen.getByTestId('ockFundCardHeader')).toHaveTextContent(
      'Custom header',
    );
  });

  it('renders the default header text when headerText is not provided', () => {
    render(
      <FundCardProvider asset="ETH" country="US">
        <FundCardHeader />
      </FundCardProvider>,
    );
    expect(screen.getByTestId('ockFundCardHeader')).toHaveTextContent(
      'Buy ETH',
    );
  });
});
