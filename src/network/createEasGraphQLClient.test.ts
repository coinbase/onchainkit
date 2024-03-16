import { base } from 'viem/chains';
import { createEasGraphQLClient } from './createEasGraphQLClient';

describe('createEasGraphQLClient', () => {
  it('should return a easGraphqlClient', () => {
    const easGraphqlClient = createEasGraphQLClient(base);
    expect(easGraphqlClient.requestConfig).toEqual({});
  });
});
