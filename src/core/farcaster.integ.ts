import { getFrameMessage } from './getFrameMessage';

describe('getFrameValidatedMessage integration tests', () => {
  it('bulk data lookup should find all users', async () => {
    const body = {
      untrustedData: {
        fid: 194519,
        url: 'https://frame-demo.vercel.app/2',
        messageHash: '0x7099de8afb08984d53f56a02b28d0f96097bfd82',
        timestamp: 1706559790000,
        network: 1,
        buttonIndex: 1,
        castId: { fid: 194519, hash: '0x3d7c0dac1dd0ee588eb58d07105b14786cfca976' },
      },
      trustedData: {
        messageBytes:
          '0a4f080d10d7ef0b18aec6a62e200182013f0a1f68747470733a2f2f6672616d652d64656d6f2e76657263656c2e6170702f321001' +
          '1a1a08d7ef0b12143d7c0dac1dd0ee588eb58d07105b14786cfca97612147099de8afb08984d53f56a02b28d0f96097bfd82180122' +
          '40f40c2e4221589ed569c76fdb285ee2a0ccb1b65954d4c879db6af051c3dd3135655b2f0df1a846d7255194c232072219e8192635' +
          '3120c8908678a00f4f42e805280132208d36f374eb10e27853496cfa342b9021acc7bf3c26262501259657c4bb15a149',
      },
    };
    const response = await getFrameMessage(body);
    expect(response?.isValid).toEqual(true);
    expect(response?.message?.url).toEqual(body.untrustedData.url);
    expect(response?.message?.fid).toEqual(body.untrustedData.fid);
    expect(response?.message?.network).toEqual(body.untrustedData.network);
    expect(response?.message?.castId.fid).toEqual(body.untrustedData.castId.fid);
  });
});
