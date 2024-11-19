import { AppContext } from '@/components/AppProvider';
import { useEffect, useState, useContext } from 'react';
import { initializeStateFromUrl } from '@/lib/url-params';

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

/**
 * Custom hook to manage state with localStorage
 * Also syncs to URL params on first load
 */
export function useStateWithStorage<T>({
  key,
  defaultValue,
  parser = (v) => v as T,
  serializer = JSON.stringify,
}: StorageConfig<T>) {
  const [state, setState] = useState<T | undefined>(() => {
    // Check URL params first
    const urlState = initializeStateFromUrl();
    const urlValue = urlState[key.toLowerCase()];

    if (urlValue) {
      return parser(urlValue);
    }

    // Then check localStorage
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return parser(stored);
      } catch (e) {
        console.warn(`Error parsing stored value for ${key}:`, e);
        return defaultValue;
      }
    }

    return defaultValue;
  });

  // Sync to localStorage whenever state changes
  useEffect(() => {
    if (state !== undefined) {
      localStorage.setItem(key, serializer(state));
    } else {
      localStorage.removeItem(key);
    }
  }, [key, state, serializer]);

  return [state, setState] as const;
}
