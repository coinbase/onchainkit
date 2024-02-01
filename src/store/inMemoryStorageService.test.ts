import { InMemoryStorage } from '../store/inMemoryStorageService';

describe('InMemoryStorage', () => {
  beforeEach(() => {
    // Optionally clear the storage before each test if needed.
    // This depends on whether InMemoryStorage provides a method to clear the storage.
  });

  it('initializes with an empty storage', async () => {
    const value = await InMemoryStorage.getData('someKey');
    expect(value).toBeNull();
  });

  it('stores and retrieves data correctly', async () => {
    await InMemoryStorage.setData('testKey', 'testValue');
    const value = await InMemoryStorage.getData('testKey');
    expect(value).toBe('testValue');
  });

  it('returns null for non-existent keys', async () => {
    const value = await InMemoryStorage.getData('nonExistentKey');
    expect(value).toBeNull();
  });

  it("deletes data when setting a key's value to null", async () => {
    await InMemoryStorage.setData('testKey', 'testValue');
    await InMemoryStorage.setData('testKey', null);
    const value = await InMemoryStorage.getData('testKey');
    expect(value).toBeNull();
  });
});
