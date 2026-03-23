import type { ChangeEvent } from 'react';
import type { ModelConfig, RoleConfig, SiteConfig } from '../../../../../shared/types';
import { Button } from '../../../components/atoms/Button';
import { Input, TextArea } from '../../../components/atoms/Input';

interface SiteRuleFormProps {
  draft: SiteConfig;
  roles: RoleConfig[];
  models: ModelConfig[];
  onChange: (value: SiteConfig) => void;
  onSave: () => void;
}

export function SiteRuleForm({ draft, roles, models, onChange, onSave }: SiteRuleFormProps) {
  const update = (key: keyof SiteConfig) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange({ ...draft, [key]: event.target.value } as SiteConfig);
  };

  return (
    <div className="wr-panel wr-grid">
      <h3>站点规则</h3>
      <select className="wr-input" value={draft.matchType} onChange={update('matchType')}>
        <option value="siteName">站点名</option>
        <option value="domain">域名</option>
        <option value="url_prefix">URL 前缀</option>
        <option value="regex">正则</option>
      </select>
      <Input placeholder="匹配规则" value={draft.matchRule} onChange={update('matchRule')} />
      <select className="wr-input" value={draft.defaultRoleId} onChange={update('defaultRoleId')}>
        <option value="">选择默认角色</option>
        {roles.map((role) => <option key={role.roleId} value={role.roleId}>{role.roleName}</option>)}
      </select>
      <select className="wr-input" value={draft.defaultModelId} onChange={update('defaultModelId')}>
        <option value="">选择默认模型</option>
        {models.map((model) => <option key={model.modelId} value={model.modelId}>{model.modelName}</option>)}
      </select>
      <select className="wr-input" value={draft.analysisMethod} onChange={update('analysisMethod')}>
        <option value="readability">智能分析</option>
        <option value="screenshot">长图分析</option>
        <option value="hybrid">混合分析</option>
      </select>
      <TextArea placeholder='自动化动作 JSON，例如 [{"action":"click","selector":"button.more"}]' value={JSON.stringify(draft.autoActions ?? [], null, 2)} onChange={(event: { target: { value: string } }) => {
        try {
          const autoActions = JSON.parse(event.target.value) as SiteConfig['autoActions'];
          onChange({ ...draft, autoActions });
        } catch {
          onChange({ ...draft, autoActions: draft.autoActions });
        }
      }} />
      <Button onClick={onSave}>保存规则</Button>
    </div>
  );
}
