import { StorageInterface } from '../types';

// InMemoryStorageService: A service to store data in JavaScript memory.
// It's a simple key-value storage using a Map. The data is stored as long as the page is not reloaded.
export class InMemoryStorageService implements StorageInterface {
  private storage: Map<string, string | null | undefined>;

  constructor() {
    this.storage = new Map<string, string | null | undefined>();
  }

  async getData(key: string): Promise<string | null | undefined> {
    try {
      return this.storage.has(key) ? this.storage.get(key) : null;
    } catch (error) {
      console.error('error reading data from storage', error);
      return null;
    }
  }

  async setData(key: string, value: string | null | undefined): Promise<void> {
    if (value === null) {
      this.storage.delete(key);
    } else {
      try {
        this.storage.set(key, value);
      } catch (error) {
        console.error('error when setting data in storage', error);
      }
    }
  }
}
