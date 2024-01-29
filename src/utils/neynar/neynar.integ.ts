import { neynarBulkUserLookup } from './user/neynarUserFunctions';

describe('neynar integration tests', () => {
  it('bulk data lookup should find all users', async () => {
    const fidsToLookup = [3, 194519]; // dwr and polak.eth fids
    const response = await neynarBulkUserLookup(fidsToLookup);
    expect(response?.users.length).toEqual(2);
    for (const user of response?.users!) {
      expect(fidsToLookup).toContain(user.fid);
    }
  });
});
