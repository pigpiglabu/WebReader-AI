import type { BackupPayload, ChatMessage, ChatSession, ModelConfig, PageContent, RoleConfig, SiteConfig, StorageShape } from '../types';

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

const isModelConfig = (value: unknown): value is ModelConfig => {
  if (!isObject(value) || !isObject(value.capabilities)) return false;
  return isString(value.modelId) && isString(value.provider) && isString(value.modelName) && isString(value.baseUrl) && isString(value.apiKey) && isBoolean(value.capabilities.supportVision) && isBoolean(value.capabilities.supportTool) && isBoolean(value.stream) && isNumber(value.timeout);
};

const isRoleConfig = (value: unknown): value is RoleConfig => isObject(value) && isString(value.roleId) && isString(value.roleName) && isString(value.icon) && isString(value.prompts);

const isSiteConfig = (value: unknown): value is SiteConfig => isObject(value) && isString(value.siteId) && isString(value.matchType) && isString(value.matchRule) && isString(value.defaultRoleId) && isString(value.defaultModelId) && isString(value.analysisMethod);

const isChatSession = (value: unknown): value is ChatSession => isObject(value) && isString(value.sessionId) && isString(value.title) && isString(value.modelId) && isString(value.roleId) && isNumber(value.createdAt);

const isChatMessage = (value: unknown): value is ChatMessage => isObject(value) && isString(value.messageId) && isString(value.sessionId) && isString(value.role) && isString(value.content) && isNumber(value.createdAt);

const isPageContent = (value: unknown): value is PageContent => isObject(value) && isString(value.url) && isString(value.title) && isString(value.siteName) && isString(value.textContent) && isString(value.htmlContent) && Array.isArray(value.attachments);

export const isStorageShape = (value: unknown): value is StorageShape => {
  if (!isObject(value) || !Array.isArray(value.models) || !Array.isArray(value.roles) || !Array.isArray(value.siteConfigs) || !Array.isArray(value.sessions) || !Array.isArray(value.messages) || !isObject(value.pageCache) || !isObject(value.uiPreferences)) {
    return false;
  }

  return value.models.every(isModelConfig)
    && value.roles.every(isRoleConfig)
    && value.siteConfigs.every(isSiteConfig)
    && value.sessions.every(isChatSession)
    && value.messages.every(isChatMessage)
    && Object.values(value.pageCache).every(isPageContent)
    && isString(value.uiPreferences.theme)
    && isBoolean(value.uiPreferences.sidebarEnabled)
    && (value.uiPreferences.currentModelId === undefined || isString(value.uiPreferences.currentModelId))
    && (value.uiPreferences.currentRoleId === undefined || isString(value.uiPreferences.currentRoleId));
};

export const isBackupPayload = (value: unknown): value is BackupPayload => {
  if (!isObject(value) || value.version !== 1 || !isString(value.exportedAt) || !isObject(value.sync) || !isObject(value.local)) {
    return false;
  }

  const syncCandidate = {
    models: value.sync.models,
    roles: value.sync.roles,
    siteConfigs: value.sync.siteConfigs,
    uiPreferences: value.sync.uiPreferences,
    sessions: [],
    messages: [],
    pageCache: {}
  };

  const localCandidate = {
    models: [],
    roles: [],
    siteConfigs: [],
    uiPreferences: { theme: 'light', sidebarEnabled: true },
    sessions: value.local.sessions,
    messages: value.local.messages,
    pageCache: value.local.pageCache
  };

  return isStorageShape(syncCandidate) && isStorageShape(localCandidate);
};
