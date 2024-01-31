import { InMemoryStorageService } from './inMemoryStorageService';

describe('InMemoryStorageService', () => {
  let storageService: InMemoryStorageService;

  beforeEach(() => {
    storageService = new InMemoryStorageService();
  });

  it('initializes an empty storage', async () => {
    expect(storageService).toBeDefined();
    const value = await storageService.getData('someKey');
    expect(value).toBeNull();
  });

  it('stores and retrieves data correctly', async () => {
    await storageService.setData('testKey', 'testValue');
    const value = await storageService.getData('testKey');
    expect(value).toBe('testValue');
  });

  it('returns null for non-existent keys', async () => {
    const value = await storageService.getData('nonExistentKey');
    expect(value).toBeNull();
  });

  it("deletes data when setting a key's value to null", async () => {
    await storageService.setData('testKey', 'testValue');
    await storageService.setData('testKey', null);
    const value = await storageService.getData('testKey');
    expect(value).toBeNull();
  });
});
