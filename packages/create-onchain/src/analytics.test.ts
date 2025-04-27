import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import prompts from 'prompts';
import { analyticsPrompt } from './analytics';

vi.mock('prompts');

describe('analytics', () => {
  const mockFetch = vi.spyOn(global, 'fetch');

  beforeEach(() => {
    mockFetch.mockImplementation(() => Promise.resolve(new Response()));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('analyticsPrompt', () => {
    it('sends analytics when user accepts', async () => {
      vi.mocked(prompts).mockResolvedValue({ analytics: true });

      const result = await analyticsPrompt('minikit-basic');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.developer.coinbase.com/analytics',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('"template":"minikit-basic"'),
        })
      );

      const payload = JSON.parse(mockFetch.mock.calls[0][1]!.body as string);
      expect(payload).toEqual({
        eventType: 'createOnchainInitiated',
        timestamp: expect.any(Number),
        data: {
          template: 'minikit-basic',
        }
      });
    });

    it('does not send analytics when user declines', async () => {
      vi.mocked(prompts).mockResolvedValue({ analytics: false });

      const result = await analyticsPrompt('minikit-basic');

      expect(result).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('handles prompts cancellation', async () => {
      vi.mocked(prompts).mockRejectedValue(new Error('Cancelled'));

      const result = await analyticsPrompt('minikit-basic');

      expect(result).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('handles prompts onCancel callback', async () => {
      // simulate user hitting ctrl+c or escape
      vi.mocked(prompts).mockImplementation((questions: any, options: any) => {
        options?.onCancel?.();
        return Promise.resolve({ analytics: false });
      });

      const result = await analyticsPrompt('minikit-basic');

      expect(result).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
