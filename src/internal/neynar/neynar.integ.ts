import { NeynarClient } from './neynarClient';

describe('integration tests', () => {
  const neynarClient = new NeynarClient();

  it('bulk data lookup should find all users', async () => {
    const fidsToLookup = [3, 194519]; // dwr and polak.eth fids
    const response = await neynarClient.user.bulkUserLookup(fidsToLookup);
    expect(response?.users.length).toEqual(2);
    for (const user of response?.users!) {
      expect(fidsToLookup).toContain(user.fid);
    }
  });
});
