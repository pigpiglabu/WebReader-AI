import type { SiteConfig } from '../../../../../shared/types';

interface SiteRuleListProps {
  siteConfigs: SiteConfig[];
}

export function SiteRuleList({ siteConfigs }: SiteRuleListProps) {
  return (
    <div className="wr-panel">
      <h3>规则列表</h3>
      <div className="wr-list">
        {siteConfigs.map((rule) => (
          <div key={rule.siteId} className="wr-card">
            <strong>{rule.matchRule}</strong>
            <div>
              <span className="wr-chip">{rule.matchType}</span>
              <span className="wr-chip">{rule.analysisMethod}</span>
            </div>
            <p>Model: {rule.defaultModelId || '未绑定'} / Role: {rule.defaultRoleId || '未绑定'}</p>
          </div>
        ))}
        {siteConfigs.length === 0 && <p>暂无规则。</p>}
      </div>
    </div>
  );
}
