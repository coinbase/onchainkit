import { useEffect, useState } from 'react';
import { StorageInterface, ActionFunction, ActionKey, StorageValue } from '../types';

type ExtractStorageValue<T> = T extends StorageValue ? T : never;

/**
 * A generic hook to fetch and store data using a specified storage service.
 * It fetches data based on the given dependencies and stores it using the provided storage service.
 * @param action - The action function to fetch data.
 * @param actionKey - A key associated with the action for caching purposes.
 * @param storageService - The storage service to use for caching.
 * @returns The data fetched by the action function.
 */
export function useOnchainActionWithCache<T>(
  action: ActionFunction<T>,
  actionKey: ActionKey,
  storageService: StorageInterface,
) {
  const [data, setData] = useState<StorageValue>(undefined);

  useEffect(() => {
    let isSubscribed = true;

    const callAction = async () => {
      let fetchedData: StorageValue;
      // Use cache only if actionKey is not empty
      if (actionKey) {
        fetchedData = await storageService.getData(actionKey);
      }

      // If no cached data or actionKey is empty, fetch new data
      if (!fetchedData) {
        fetchedData = (await action()) as ExtractStorageValue<T>;
        // Cache the data only if actionKey is not empty
        if (actionKey) {
          await storageService.setData(actionKey, fetchedData);
        }
      }

      if (isSubscribed) {
        setData(fetchedData);
      }
    };

    void callAction();

    return () => {
      isSubscribed = false;
    };
  }, [storageService, actionKey, action]);

  return data;
}
