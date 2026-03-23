import type { SiteConfig } from '../../../../../shared/types';
import { Button } from '../../../components/atoms/Button';

interface SiteRuleListProps {
  siteConfigs: SiteConfig[];
  selectedId?: string;
  onEdit: (rule: SiteConfig) => void;
}

export function SiteRuleList({ siteConfigs, selectedId, onEdit }: SiteRuleListProps) {
  return (
    <div className="wr-panel">
      <h3>规则列表</h3>
      <div className="wr-list">
        {siteConfigs.map((rule) => (
          <button key={rule.siteId} type="button" className={`wr-card wr-card--interactive ${selectedId === rule.siteId ? 'wr-card--active' : ''}`.trim()} onClick={() => onEdit(rule)}>
            <strong>{rule.matchRule || '未命名规则'}</strong>
            <div>
              <span className="wr-chip">{rule.matchType}</span>
              <span className="wr-chip">{rule.analysisMethod}</span>
            </div>
            <p>Model: {rule.defaultModelId || '未绑定'} / Role: {rule.defaultRoleId || '未绑定'}</p>
            <Button tone="secondary" type="button" onClick={(event: { stopPropagation: () => void }) => {
              event.stopPropagation();
              onEdit(rule);
            }}>编辑</Button>
          </button>
        ))}
        {siteConfigs.length === 0 && <p>暂无规则。</p>}
      </div>
    </div>
  );
}
