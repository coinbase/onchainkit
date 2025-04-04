import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { quoteResponseDataMock } from '../mocks';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';
import { FundCardHeader } from './FundCardHeader';
import { FundCardProvider } from './FundCardProvider';

vi.mock('../utils/fetchOnrampQuote');

describe('FundCardHeader', () => {
  beforeEach(() => {
    setOnchainKitConfig({ apiKey: 'mock-api-key' });
    (fetchOnrampQuote as Mock).mockResolvedValue(quoteResponseDataMock);
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
