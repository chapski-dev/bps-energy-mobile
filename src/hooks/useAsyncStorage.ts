import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AsyncStorageValue = string | null | undefined

type cbType = (value: string | null) => void
const subscribers = new Map<string, Set<cbType>>();

export function createStorage(key: string) {
  const getItem = () => AsyncStorage.getItem(key);
  const setItem = async (value: string) => {
    await AsyncStorage.setItem(key, value);
    subscribers.get(key)?.forEach((cb) => cb(value));
  };
  const removeItem = async () => {
    await AsyncStorage.removeItem(key);
    subscribers.get(key)?.forEach((cb) => cb(null));
  };

  const unsubscribe = (cb: cbType) => {
    const setOfSubscribers = subscribers.get(key);
    if (setOfSubscribers) {
      setOfSubscribers.delete(cb);
      if (setOfSubscribers.size === 0) {
        subscribers.delete(key);
      }
    }
  };

  const subscribe = (cb: cbType) => {
    const setOfSubscribers = subscribers.get(key) || new Set();
    subscribers.set(key, setOfSubscribers.add(cb));
    return () => unsubscribe(cb);
  };

  return { getItem, removeItem, setItem, subscribe };
}

/**
 * Provide asyncStorage value as reactive React state.
 * This hook not only creates value in asyncStorage, but creates react state, that is common for all places
 * where we use this hook with the same key.
 * @param key unique string on which we store value
 * @returns [item, setItem, removeItem]
 * item:
 * - undefined while we are loading the stored value
 * - null if the storage don't have data on this key
 * - string if we have stored data
 */
export function useCustomAsyncStorage(key: string) {
  const { getItem, setItem, removeItem, subscribe } = createStorage(key);
  const [value, setValue] = useState<AsyncStorageValue>(undefined);

  useEffect(() => {
    getItem()
      .then((item) => {
        setValue(item);
      })
      .catch((e) => console.error('AsyncStorage getItem error', e));
    return subscribe((val) => setValue(val));
  }, [getItem, subscribe]);

  return [value, setItem, removeItem] as [AsyncStorageValue, (val: string) => Promise<void>, () => Promise<void>];
}

export function useParsedStorage<T>(key: string) {
  const [value, setItem, removeItem] = useCustomAsyncStorage(key);

  const json = useMemo(() => {
    if (value === null || value === undefined) {
      return value;
    }
    try {
      return JSON.parse(value) as T;
    } catch (_) {
      return value;
    }
  }, [value]);

  const setValue = useCallback((v: T) => setItem(JSON.stringify(v)), [setItem]);

  return [json, setValue, removeItem] as const;
}
