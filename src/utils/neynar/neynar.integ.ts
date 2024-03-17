import { neynarBulkUserLookup } from './user/neynarBulkUserLookup';
import { neynarFrameValidation } from './frame/neynarFrameValidation';
import { getCustodyAddressForFidNeynar } from './user/getCustodyAddressForFidNeynar';
import { getVerifiedAddressesForFidNeynar } from './user/getVerifiedAddressesForFidNeynar';

describe('neynar integration tests', () => {
  it('bulk data lookup should find all users', async () => {
    const fidsToLookup = [3, 194519]; // dwr and polak.eth fids
    const response = await neynarBulkUserLookup(fidsToLookup);
    expect(response?.users.length).toEqual(2);
    for (const user of response?.users!) {
      expect(fidsToLookup).toContain(user.fid);
    }
  });

  it('frame validation returns correct data', async () => {
    const messageBytes =
      '0a4f080d10d7ef0b18aec6a62e200182013f0a1f68747470733a2f2f6672616d652d64656d6f2e76657263656c2e6170702f321001' +
      '1a1a08d7ef0b12143d7c0dac1dd0ee588eb58d07105b14786cfca97612147099de8afb08984d53f56a02b28d0f96097bfd82180122' +
      '40f40c2e4221589ed569c76fdb285ee2a0ccb1b65954d4c879db6af051c3dd3135655b2f0df1a846d7255194c232072219e8192635' +
      '3120c8908678a00f4f42e805280132208d36f374eb10e27853496cfa342b9021acc7bf3c26262501259657c4bb15a149';

    const response = await neynarFrameValidation(messageBytes);
    expect(response?.valid).toEqual(true);
    expect(response?.button).toEqual(1);
    expect(response?.interactor.fid).toEqual(194519);
    expect(response?.interactor.custody_address).toEqual(
      '0xe975a573784f2970c507b51a76c5834e798b2bd5',
    );
    expect(response?.interactor.verified_accounts.length).toBeGreaterThan(0);
  });

  it('get custody address for FID returns correct address', async () => {
    const fid = 3;
    const response = await getCustodyAddressForFidNeynar(fid);
    expect(response).toEqual('0x6b0bda3f2ffed5efc83fa8c024acff1dd45793f1');
  });

  it('get verified addresses for FID returns correct addresses', async () => {
    const fid = 3;
    const response = await getVerifiedAddressesForFidNeynar(fid);
    expect(response).toEqual([
      '0x8fc5d6afe572fefc4ec153587b63ce543f6fa2ea',
      '0xd7029bdea1c17493893aafe29aad69ef892b8ff2',
    ]);
  });
});
