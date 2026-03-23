import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ModelConfig } from '../../../../../shared/types';
import { useStorageHelper } from '../../../hooks/useStorageHelper';

const defaultModel: ModelConfig = {
  modelId: '',
  provider: 'OpenAI',
  modelName: 'gpt-4o-mini',
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  capabilities: {
    supportVision: true,
    supportTool: true
  },
  stream: true,
  timeout: 60000
};

export const useModelConfig = () => {
  const { getSync, setSync } = useStorageHelper();
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [draft, setDraft] = useState<ModelConfig>(defaultModel);

  useEffect(() => {
    void getSync('models').then((result) => setModels(result ?? []));
  }, [getSync]);

  const saveModel = async () => {
    const nextModel = { ...draft, modelId: draft.modelId || uuidv4() };
    const nextModels = models.some((model) => model.modelId === nextModel.modelId)
      ? models.map((model) => (model.modelId === nextModel.modelId ? nextModel : model))
      : [...models, nextModel];

    setModels(nextModels);
    await setSync('models', nextModels);
    setDraft(defaultModel);
  };

  const editModel = (model: ModelConfig) => setDraft(model);

  const providers = useMemo(() => ['OpenAI', 'Qwen', 'Anthropic', 'Ollama', 'Custom'] as const, []);

  return { models, draft, setDraft, saveModel, editModel, providers };
};
