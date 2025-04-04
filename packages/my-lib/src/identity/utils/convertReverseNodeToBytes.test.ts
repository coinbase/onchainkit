/**
 * @vitest-environment jsdom
 */

import { base } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { convertReverseNodeToBytes } from './convertReverseNodeToBytes';

describe('convertReverseNodeToBytes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return correct resolver data', async () => {
    const reversedAddress = convertReverseNodeToBytes(
      '0x8c8F1a1e1bFdb15E7ed562efc84e5A588E68aD73',
      base.id,
    );
    expect(reversedAddress).toBe(
      '0xcd18b9f82b690bdf732816fe0b9796635191f97e59bcebbef4eba6e05a39da05',
    );
  });
});
