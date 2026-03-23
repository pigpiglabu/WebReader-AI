export const STORAGE_KEYS = {
  models: 'models',
  roles: 'roles',
  siteConfigs: 'siteConfigs',
  sessions: 'sessions',
  messages: 'messages',
  pageCache: 'pageCache',
  uiPreferences: 'uiPreferences'
} as const;

export const MESSAGE_TYPES = {
  GET_PAGE_CONTEXT: 'GET_PAGE_CONTEXT',
  OPEN_OPTIONS: 'OPEN_OPTIONS',
  OPEN_SIDE_PANEL: 'OPEN_SIDE_PANEL',
  SAVE_PAGE_CONTEXT: 'SAVE_PAGE_CONTEXT',
  SEND_CHAT: 'SEND_CHAT',
  EXPORT_BACKUP: 'EXPORT_BACKUP',
  IMPORT_BACKUP: 'IMPORT_BACKUP'
} as const;
