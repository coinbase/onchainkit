import { base } from 'viem/chains';
import { createEasGraphQLClient } from './createEasGraphQLClient';
import { describe, expect, it } from 'vitest';

describe('createEasGraphQLClient', () => {
  it('should return a easGraphqlClient', () => {
    const easGraphqlClient = createEasGraphQLClient(base);
    expect(easGraphqlClient.requestConfig).toEqual({});
  });
});
