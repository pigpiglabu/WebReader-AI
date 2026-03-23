import type { ModelConfig } from '../../../../../shared/types';
import { Button } from '../../../components/atoms/Button';

interface ModelListProps {
  models: ModelConfig[];
  onEdit: (model: ModelConfig) => void;
}

export function ModelList({ models, onEdit }: ModelListProps) {
  return (
    <div className="wr-panel">
      <h3>模型列表</h3>
      <div className="wr-list">
        {models.map((model) => (
          <div key={model.modelId} className="wr-card">
            <strong>{model.modelName}</strong>
            <div><span className="wr-chip">{model.provider}</span><span className="wr-chip">{model.stream ? 'Streaming' : 'Non-stream'}</span></div>
            <p>{model.baseUrl}</p>
            <Button tone="secondary" onClick={() => onEdit(model)}>编辑</Button>
          </div>
        ))}
        {models.length === 0 && <p>暂无模型，请先创建一个默认模型。</p>}
      </div>
    </div>
  );
}
