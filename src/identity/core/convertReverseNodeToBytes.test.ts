/**
 * @jest-environment jsdom
 */

import { convertReverseNodeToBytes } from './convertReverseNodeToBytes';

describe('convertReverseNodeToBytes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct resolver data', async () => {
    const reversedAddress = convertReverseNodeToBytes(
      '0x8c8F1a1e1bFdb15E7ed562efc84e5A588E68aD73',
    );
    expect(reversedAddress).toBe(
      '0x6139cf12ddf8f0552eba843e6452ccbb64d5b033ce908f8fb939e4287ece0e68',
    );
  });
});
