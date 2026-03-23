import type { ChangeEvent } from 'react';
import type { ModelConfig } from '../../../../../shared/types';
import { Button } from '../../../components/atoms/Button';
import { Input } from '../../../components/atoms/Input';

interface ModelFormProps {
  draft: ModelConfig;
  providers: readonly ModelConfig['provider'][];
  onChange: (value: ModelConfig) => void;
  onSave: () => void;
}

export function ModelForm({ draft, providers, onChange, onSave }: ModelFormProps) {
  const update = (key: keyof ModelConfig) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked : event.target.value;
    if (key === 'timeout') {
      onChange({ ...draft, timeout: Number(value) });
      return;
    }
    onChange({ ...draft, [key]: value } as ModelConfig);
  };

  return (
    <div className="wr-panel wr-grid">
      <h3>模型配置</h3>
      <select className="wr-input" value={draft.provider} onChange={update('provider')}>
        {providers.map((provider) => <option key={provider} value={provider}>{provider}</option>)}
      </select>
      <Input placeholder="模型名称" value={draft.modelName} onChange={update('modelName')} />
      <Input placeholder="Base URL" value={draft.baseUrl} onChange={update('baseUrl')} />
      <Input placeholder="API Key" value={draft.apiKey} onChange={update('apiKey')} />
      <Input type="number" placeholder="超时(ms)" value={draft.timeout} onChange={update('timeout')} />
      <label><input type="checkbox" checked={draft.stream} onChange={update('stream')} /> 默认流式输出</label>
      <label><input type="checkbox" checked={draft.capabilities.supportVision} onChange={(event: { target: { checked: boolean } }) => onChange({ ...draft, capabilities: { ...draft.capabilities, supportVision: event.target.checked } })} /> 支持视觉</label>
      <label><input type="checkbox" checked={draft.capabilities.supportTool} onChange={(event: { target: { checked: boolean } }) => onChange({ ...draft, capabilities: { ...draft.capabilities, supportTool: event.target.checked } })} /> 支持工具调用</label>
      <Button onClick={onSave}>保存模型</Button>
    </div>
  );
}
