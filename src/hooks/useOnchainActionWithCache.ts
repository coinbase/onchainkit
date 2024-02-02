import { useEffect, useState } from 'react';
import { InMemoryStorage } from '../store/inMemoryStorageService';
import type { ActionFunction, ActionKey } from './types';
import type { StorageValue } from '../store/types';

type ExtractStorageValue<T> = T extends StorageValue ? T : never;

/**
 * A generic hook to fetch and store data using a specified storage service.
 * It fetches data based on the given dependencies and stores it using the provided storage service.
 * @param action - The action function to fetch data.
 * @param actionKey - A key associated with the action for caching purposes.
 * @returns The data fetched by the action function and a boolean indicating whether the data is being fetched.
 */
export function useOnchainActionWithCache<T>(action: ActionFunction<T>, actionKey: ActionKey) {
  const [data, setData] = useState<StorageValue>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    const callAction = async () => {
      let fetchedData: StorageValue;
      // Use cache only if actionKey is not empty
      if (actionKey) {
        fetchedData = await InMemoryStorage.getData(actionKey);
      }

      // If no cached data or actionKey is empty, fetch new data
      if (!fetchedData) {
        fetchedData = (await action()) as ExtractStorageValue<T>;
        // Cache the data only if actionKey is not empty
        if (actionKey) {
          await InMemoryStorage.setData(actionKey, fetchedData);
        }
      }

      if (isSubscribed) {
        setData(fetchedData);
        setIsLoading(false);
      }
    };

    void callAction();

    return () => {
      isSubscribed = false;
    };
  }, [actionKey, action]);

  return { data, isLoading };
}
