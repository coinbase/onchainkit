import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { quoteResponseDataMock } from '../mocks';
import type { PresetAmountInputs } from '../types';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';
import { FundCardPresetAmountInputList } from './FundCardPresetAmountInputList';
import { FundCardProvider } from './FundCardProvider';

vi.mock('../utils/fetchOnrampQuote');

describe('FundCardPresetAmountInputList', () => {
  beforeEach(() => {
    setOnchainKitConfig({ apiKey: '123456789' });
    (fetchOnrampQuote as Mock).mockResolvedValue(quoteResponseDataMock);
  });

  const renderWithProvider = async (
    presetAmountInputs?: PresetAmountInputs,
  ) => {
    return await act(async () => {
      return render(
        <FundCardProvider
          asset="ETH"
          country="US"
          presetAmountInputs={presetAmountInputs}
        >
          <FundCardPresetAmountInputList />
        </FundCardProvider>,
      );
    });
  };

  it('renders nothing when no preset amounts are provided', async () => {
    await renderWithProvider();
    expect(
      screen.queryByTestId('ockPresetAmountInputList'),
    ).not.toBeInTheDocument();
  });

  it('renders all preset amounts', async () => {
    const presetAmounts: PresetAmountInputs = ['10', '20', '50'];
    await renderWithProvider(presetAmounts);

    // Check each preset amount is rendered
    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
  });

  it('renders with correct layout classes', async () => {
    const presetAmounts: PresetAmountInputs = ['10', '20', '50'];
    await renderWithProvider(presetAmounts);

    const container = screen.getByTestId('ockPresetAmountInputList');
    expect(container).toHaveClass(
      'flex',
      'w-full',
      'flex-wrap',
      'items-center',
      'justify-between',
      'gap-2',
      'pt-8',
    );
  });

  it('renders exactly three preset amounts', async () => {
    const presetAmounts: PresetAmountInputs = ['10', '20', '50'];
    await renderWithProvider(presetAmounts);

    const presetButtons = screen.getAllByTestId('ockPresetAmountInput');
    expect(presetButtons).toHaveLength(3);
  });
});
