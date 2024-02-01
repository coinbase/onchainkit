import { StorageInterface } from '../types';

// Module-level storage variable (replaces the class property)
const storage = new Map<string, string | null | undefined>();

/**
 * Asynchronously retrieves data from the in-memory storage.
 *
 * @param {string} key - The key for which to retrieve the data.
 * @returns {Promise<string | null | undefined>} The data associated with the key, or null if not found.
 */
const getData = async (key: string): Promise<string | null | undefined> => {
  try {
    return storage.has(key) ? storage.get(key) : null;
  } catch (error) {
    console.error('error reading data from storage', error);
    return null;
  }
};

/**
 * Asynchronously sets data in the in-memory storage.
 *
 * @param {string} key - The key to store the data against.
 * @param {string | null | undefined} value - The data to store.
 */
const setData = async (key: string, value: string | null | undefined): Promise<void> => {
  if (value === null) {
    storage.delete(key);
  } else {
    try {
      storage.set(key, value);
    } catch (error) {
      console.error('error when setting data in storage', error);
    }
  }
};

// Exporting the module functions
export const InMemoryStorage: StorageInterface = {
  getData,
  setData,
};
