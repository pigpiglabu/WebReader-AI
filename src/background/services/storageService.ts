import { STORAGE_KEYS } from '../../shared/constants';
import type { BackupPayload, StorageShape } from '../../shared/types';

const defaultStorage: StorageShape = {
  models: [],
  roles: [],
  siteConfigs: [],
  sessions: [],
  messages: [],
  pageCache: {},
  uiPreferences: {
    theme: 'light',
    sidebarEnabled: true,
    currentModelId: undefined,
    currentRoleId: undefined
  }
};

export class StorageService {
  async getAll(): Promise<StorageShape> {
    const [syncData, localData] = await Promise.all([
      chrome.storage.sync.get([STORAGE_KEYS.models, STORAGE_KEYS.roles, STORAGE_KEYS.siteConfigs, STORAGE_KEYS.uiPreferences]),
      chrome.storage.local.get([STORAGE_KEYS.sessions, STORAGE_KEYS.messages, STORAGE_KEYS.pageCache])
    ]);

    return {
      ...defaultStorage,
      models: syncData.models ?? defaultStorage.models,
      roles: syncData.roles ?? defaultStorage.roles,
      siteConfigs: syncData.siteConfigs ?? defaultStorage.siteConfigs,
      uiPreferences: syncData.uiPreferences ?? defaultStorage.uiPreferences,
      sessions: localData.sessions ?? defaultStorage.sessions,
      messages: localData.messages ?? defaultStorage.messages,
      pageCache: localData.pageCache ?? defaultStorage.pageCache
    };
  }

  async savePageContent(url: string, pageContent: StorageShape['pageCache'][string]): Promise<void> {
    const existing = await chrome.storage.local.get(STORAGE_KEYS.pageCache);
    const pageCache = existing.pageCache ?? {};
    pageCache[url] = pageContent;
    await chrome.storage.local.set({ pageCache });
  }

  async exportBackup(): Promise<BackupPayload> {
    const all = await this.getAll();
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      sync: {
        models: all.models,
        roles: all.roles,
        siteConfigs: all.siteConfigs,
        uiPreferences: all.uiPreferences
      },
      local: {
        sessions: all.sessions,
        messages: all.messages,
        pageCache: all.pageCache
      }
    };
  }

  async importBackup(payload: BackupPayload): Promise<void> {
    await Promise.all([
      chrome.storage.sync.set(payload.sync),
      chrome.storage.local.set(payload.local)
    ]);
  }
}

export const storageService = new StorageService();
