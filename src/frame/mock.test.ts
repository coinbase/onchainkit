import { buildFarcasterResponse } from './mock';

describe('mock', () => {
  describe('buildFarcasterResponse', () => {
    it('should return the correct response', () => {
      const response = buildFarcasterResponse(42);
      expect(response.value).toEqual({
        valid: true,
        message: {
          data: {
            fid: 42,
          },
        },
      });
    });
  });
});
