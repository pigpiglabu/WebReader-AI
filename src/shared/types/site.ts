import type { Attachment } from './chat';

export interface AutoAction {
  action: 'click' | 'scroll' | 'wait';
  selector?: string;
  value?: number;
}

export interface RoleConfig {
  roleId: string;
  roleName: string;
  icon: string;
  prompts: string;
  parameters?: Record<string, unknown>;
}

export interface SiteConfig {
  siteId: string;
  matchType: 'siteName' | 'domain' | 'url_prefix' | 'regex';
  matchRule: string;
  defaultRoleId: string;
  defaultModelId: string;
  analysisMethod: 'readability' | 'screenshot' | 'hybrid';
  autoActions?: AutoAction[];
}

export interface PageContent {
  url: string;
  title: string;
  siteName: string;
  textContent: string;
  htmlContent: string;
  screenshotData?: string;
  attachments: Attachment[];
}
