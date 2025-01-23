import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { copyToClipboard } from './copyToClipboard';

describe('copyToClipboard', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  it('should copy text to clipboard successfully', async () => {
    const mockSuccess = vi.fn();
    const mockWriteText = navigator.clipboard.writeText as Mock;
    mockWriteText.mockResolvedValueOnce(undefined);

    await copyToClipboard({
      copyValue: 'test text',
      onSuccess: mockSuccess,
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    expect(mockSuccess).toHaveBeenCalled();
  });

  it('should handle clipboard error', async () => {
    const mockError = vi.fn();
    const testError = new Error('Clipboard error');
    const mockWriteText = navigator.clipboard.writeText as Mock;
    mockWriteText.mockRejectedValueOnce(testError);

    await copyToClipboard({
      copyValue: 'test text',
      onError: mockError,
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
    expect(mockError).toHaveBeenCalledWith(testError);
  });

  it('should work without callbacks', async () => {
    const mockWriteText = navigator.clipboard.writeText as Mock;
    mockWriteText.mockResolvedValueOnce(undefined);

    await expect(
      copyToClipboard({ copyValue: 'test text' }),
    ).resolves.not.toThrow();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
  });
});
