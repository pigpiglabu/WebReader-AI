import { useCallback } from 'react';
import type { StorageShape } from '../../../shared/types';

export const useStorageHelper = () => {
  const getSync = useCallback(async <K extends keyof Pick<StorageShape, 'models' | 'roles' | 'siteConfigs' | 'uiPreferences'>>(key: K): Promise<StorageShape[K]> => {
    const result = await chrome.storage.sync.get(key);
    return result[key] as StorageShape[K];
  }, []);

  const setSync = useCallback(async <K extends keyof Pick<StorageShape, 'models' | 'roles' | 'siteConfigs' | 'uiPreferences'>>(key: K, value: StorageShape[K]): Promise<void> => {
    await chrome.storage.sync.set({ [key]: value });
  }, []);

  const getLocal = useCallback(async <K extends keyof Pick<StorageShape, 'sessions' | 'messages' | 'pageCache'>>(key: K): Promise<StorageShape[K]> => {
    const result = await chrome.storage.local.get(key);
    return result[key] as StorageShape[K];
  }, []);

  return { getSync, setSync, getLocal };
};
