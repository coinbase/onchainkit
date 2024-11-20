import { AppContext } from '@/components/AppProvider';
import { initializeStateFromUrl } from '@/lib/url-params';
import { useContext, useEffect, useState } from 'react';

export function usePaymaster() {
  const { chainId, paymasters } = useContext(AppContext);
  const paymasterUrl = chainId ? paymasters?.[chainId]?.url ?? '' : '';
  const enabled = chainId ? paymasters?.[chainId]?.enabled ?? false : false;

  return {
    paymasterUrl,
    enabled,
  };
}

export function useCapabilities() {
  const { paymasterUrl, enabled } = usePaymaster();

  return enabled
    ? {
        ...(paymasterUrl && {
          paymasterService: { url: paymasterUrl },
        }),
      }
    : undefined;
}

type StorageConfig<T> = {
  key: string;
  defaultValue?: T;
  parser?: (value: string) => T;
  serializer?: (value: T) => string;
};

const OCK_NAMESPACE_PREFIX = 'ock-';

export function getStorageKey(key: string) {
  return OCK_NAMESPACE_PREFIX + key;
}

/**
 * Custom hook to manage state with localStorage
 * Also syncs to URL params on first load
 */
export function useStateWithStorage<T>({
  key,
  defaultValue,
  parser = (v) => v as T,
  serializer = (v: T) => (typeof v === 'string' ? v : JSON.stringify(v)),
}: StorageConfig<T>) {
  type ReturnType = typeof defaultValue extends undefined ? T | undefined : T;

  const [state, setState] = useState<ReturnType>(defaultValue as ReturnType);
  const [isInitialized, setIsInitialized] = useState(false);

  // Logging
  useEffect(() => {
    console.log(`${key} changed:`, state);
  }, [state, key]);

  // Load initial value from URL or localStorage
  useEffect(() => {
    if (isInitialized) {
      return;
    }

    const urlState = initializeStateFromUrl();
    const urlValue = urlState[key];

    if (urlValue) {
      setState(parser(urlValue) as ReturnType);
      setIsInitialized(true);
      return;
    }

    try {
      const stored = window.localStorage.getItem(getStorageKey(key));
      if (stored) {
        setState(parser(stored) as ReturnType);
      }
    } catch (e) {
      console.warn(`Error accessing localStorage for ${key}:`, e);
    }
    setIsInitialized(true);
  }, [key, parser, isInitialized]);

  // Sync to localStorage only when state changes after initialization
  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    try {
      if (state !== undefined) {
        window.localStorage.setItem(getStorageKey(key), serializer(state));
      } else {
        window.localStorage.removeItem(getStorageKey(key));
      }
    } catch (e) {
      console.warn(`Error writing to localStorage for ${key}:`, e);
    }
  }, [key, state, serializer, isInitialized]);

  return [state, setState] as const;
}
