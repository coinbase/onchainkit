import { swapAPIRequest } from './swap';
import { setOnchainKitConfig } from '../OnchainKitConfig';
import { base } from 'viem/chains';
import { buildRequestBody, sendRequest } from './request';

jest.mock('./request');

describe('Swap Service', () => {
  describe('swapAPIRequest', () => {
    it('should make an API request and return the result', async () => {
      const method = 'someMethod';
      const params = ['param1', 'param2'];
      setOnchainKitConfig({ apiKey: 'test-api-key', chain: base });

      (sendRequest as jest.Mock).mockReturnValue({ result: [] });

      const result = await swapAPIRequest(method, params);

      expect(buildRequestBody).toHaveBeenCalledWith(method, params);
      expect(sendRequest).toHaveBeenCalledWith(buildRequestBody(method, params));
      expect(result).toEqual([]);
    });

    it('should throw an error', async () => {
      const method = 'someMethod';
      const params = ['param1', 'param2'];
      setOnchainKitConfig({ apiKey: 'test-api-key', chain: base });

      (sendRequest as jest.Mock).mockReturnValue({ error: { message: 'error' } });

      await expect(async () => {
        await swapAPIRequest(method, params);
      }).rejects.toThrow(new Error('error'));
    });
  });
});
