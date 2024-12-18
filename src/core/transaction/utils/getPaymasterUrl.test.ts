import { describe, expect, it } from 'vitest';
import { getPaymasterUrl } from './getPaymasterUrl';

describe('getPaymasterUrl', () => {
  it('should return null if capabilities is undefined', () => {
    const result = getPaymasterUrl(undefined);
    expect(result).toEqual(null);
  });

  it('should return null if capabilities is null', () => {
    // @ts-expect-error - testing null
    const result = getPaymasterUrl(null);
    expect(result).toEqual(null);
  });

  it('should return null if paymasterService is undefined', () => {
    const result = getPaymasterUrl({});
    expect(result).toEqual(null);
  });

  it('should return null if paymasterService is null', () => {
    const result = getPaymasterUrl({ paymasterService: null });
    expect(result).toEqual(null);
  });

  it('should return null if url is undefined', () => {
    const result = getPaymasterUrl({ paymasterService: {} });
    expect(result).toEqual(null);
  });

  it('should return null if url is null', () => {
    const result = getPaymasterUrl({ paymasterService: { url: null } });
    expect(result).toEqual(null);
  });

  it('should return the url if it exists', () => {
    const result = getPaymasterUrl({ paymasterService: { url: 'url' } });
    expect(result).toEqual('url');
  });
});
