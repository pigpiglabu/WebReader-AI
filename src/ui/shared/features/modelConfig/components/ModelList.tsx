import type { ModelConfig } from '../../../../../shared/types';
import { Button } from '../../../components/atoms/Button';

interface ModelListProps {
  models: ModelConfig[];
  selectedId?: string;
  onEdit: (model: ModelConfig) => void;
}

export function ModelList({ models, selectedId, onEdit }: ModelListProps) {
  return (
    <div className="wr-panel">
      <h3>模型列表</h3>
      <div className="wr-list">
        {models.map((model) => (
          <button key={model.modelId} type="button" className={`wr-card wr-card--interactive ${selectedId === model.modelId ? 'wr-card--active' : ''}`.trim()} onClick={() => onEdit(model)}>
            <strong>{model.modelName}</strong>
            <div><span className="wr-chip">{model.provider}</span><span className="wr-chip">{model.stream ? 'Streaming' : 'Non-stream'}</span></div>
            <p>{model.baseUrl}</p>
            <Button tone="secondary" type="button" onClick={(event: { stopPropagation: () => void }) => {
              event.stopPropagation();
              onEdit(model);
            }}>编辑</Button>
          </button>
        ))}
        {models.length === 0 && <p>暂无模型，请先创建一个默认模型。</p>}
      </div>
    </div>
  );
}
