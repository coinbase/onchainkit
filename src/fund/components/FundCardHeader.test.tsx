import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FundCardHeader } from './FundCardHeader';

vi.mock('../hooks/useGetFundingUrl', () => ({
  useGetFundingUrl: vi.fn(),
}));

vi.mock('../utils/getFundingPopupSize', () => ({
  getFundingPopupSize: vi.fn(),
}));

vi.mock('../../internal/utils/openPopup', () => ({
  openPopup: vi.fn(),
}));

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('FundCardHeader', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the provided headerText', () => {
    render(<FundCardHeader headerText="Custom Header" assetSymbol="btc" />);
    expect(screen.getByTestId('fundCardHeader')).toHaveTextContent('Custom Header');
  });

  it('renders the default header text when headerText is not provided', () => {
    render(<FundCardHeader assetSymbol="eth" />);
    expect(screen.getByTestId('fundCardHeader')).toHaveTextContent('Buy ETH');
  });

  it('converts assetSymbol to uppercase in default header text', () => {
    render(<FundCardHeader assetSymbol="usdt" />);
    expect(screen.getByTestId('fundCardHeader')).toHaveTextContent('Buy USDT');
  });
});