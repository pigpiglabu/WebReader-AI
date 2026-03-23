export * from './model';
export * from './chat';
export * from './site';

import type { ChatMessage, ChatSession } from './chat';
import type { ModelConfig } from './model';
import type { PageContent, RoleConfig, SiteConfig } from './site';

export interface StorageShape {
  models: ModelConfig[];
  roles: RoleConfig[];
  siteConfigs: SiteConfig[];
  sessions: ChatSession[];
  messages: ChatMessage[];
  pageCache: Record<string, PageContent>;
  uiPreferences: {
    theme: 'light' | 'dark' | 'sepia';
    sidebarEnabled: boolean;
    currentModelId?: string;
    currentRoleId?: string;
  };
}

export interface BackupPayload {
  version: 1;
  exportedAt: string;
  sync: Pick<StorageShape, 'models' | 'roles' | 'siteConfigs' | 'uiPreferences'>;
  local: Pick<StorageShape, 'sessions' | 'messages' | 'pageCache'>;
}
