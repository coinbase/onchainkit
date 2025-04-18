import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BuilderScoreCard } from './BuilderScoreCard';
import * as getBuilderScoreModule from '../../api/getBuilderScore';
import type { Address } from 'viem';

// Mock the getBuilderScore function
vi.mock('../../api/getBuilderScore', () => ({
  getBuilderScore: vi.fn(),
}));

describe('BuilderScoreCard', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890' as Address;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('displays loading state initially', () => {
    render(<BuilderScoreCard address={mockAddress} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays the builder score when successfully fetched', async () => {
    // Mock successful response
    const mockScore = {
      points: 75,
      last_calculated_at: new Date().toISOString(),
    };

    vi.mocked(getBuilderScoreModule.getBuilderScore).mockResolvedValue(
      mockScore,
    );

    render(<BuilderScoreCard address={mockAddress} />);

    // Check for loading first
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Then check for the score and verified badge
    await waitFor(() => {
      expect(screen.getByText('75')).toBeInTheDocument();
      expect(screen.getByText('BUILDER SCORE')).toBeInTheDocument();
      expect(screen.getByText('✓ Verified Onchain')).toBeInTheDocument();
    });
  });

  it('displays error message when fetching fails', async () => {
    // Mock error response
    vi.mocked(getBuilderScoreModule.getBuilderScore).mockRejectedValue(
      new Error('Failed to fetch builder score: Unauthorized'),
    );

    render(<BuilderScoreCard address={mockAddress} />);

    await waitFor(() => {
      expect(
        screen.getByText('Failed to fetch builder score'),
      ).toBeInTheDocument();
    });
  });

  it('displays no score available with claim link when no address is provided', async () => {
    render(<BuilderScoreCard />);

    await waitFor(() => {
      expect(screen.getByText('No score available')).toBeInTheDocument();

      const claimLink = screen.getByText('Claim a Builder Score');
      expect(claimLink).toBeInTheDocument();
      expect(claimLink.tagName.toLowerCase()).toBe('a');
      expect(claimLink).toHaveAttribute(
        'href',
        'https://www.talentprotocol.com/',
      );

      const newBadge = screen.getByText('NEW');
      expect(newBadge).toBeInTheDocument();
    });

    // Verify the getBuilderScore function was not called
    expect(getBuilderScoreModule.getBuilderScore).not.toHaveBeenCalled();
  });

  it('always shows verified onchain badge with successful response', async () => {
    // Mock successful response
    const mockScore = {
      points: 50,
      last_calculated_at: new Date().toISOString(),
    };

    vi.mocked(getBuilderScoreModule.getBuilderScore).mockResolvedValue(
      mockScore,
    );

    render(<BuilderScoreCard address={mockAddress} />);

    await waitFor(() => {
      const verifiedBadge = screen.getByText('✓ Verified Onchain');
      expect(verifiedBadge).toBeInTheDocument();
    });
  });
});
