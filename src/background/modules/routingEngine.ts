import type { PageContent, SiteConfig } from '../../shared/types';

export class RoutingEngine {
  match(siteConfigs: SiteConfig[], pageContent: PageContent): SiteConfig | undefined {
    return [...siteConfigs].sort((a, b) => this.priority(a.matchType) - this.priority(b.matchType)).find((config) => this.matches(config, pageContent));
  }

  private priority(matchType: SiteConfig['matchType']): number {
    switch (matchType) {
      case 'siteName':
        return 1;
      case 'domain':
      case 'url_prefix':
        return 2;
      case 'regex':
      default:
        return 3;
    }
  }

  private matches(config: SiteConfig, pageContent: PageContent): boolean {
    switch (config.matchType) {
      case 'siteName':
        return pageContent.siteName.toLowerCase().includes(config.matchRule.toLowerCase());
      case 'domain':
        return new URL(pageContent.url).hostname.includes(config.matchRule.replace(/^\*\./, ''));
      case 'url_prefix':
        return pageContent.url.startsWith(config.matchRule);
      case 'regex':
        return new RegExp(config.matchRule).test(pageContent.url);
      default:
        return false;
    }
  }
}

export const routingEngine = new RoutingEngine();
