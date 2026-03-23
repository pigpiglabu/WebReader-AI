export type ModelProvider = 'OpenAI' | 'Qwen' | 'Anthropic' | 'Ollama' | 'Custom';

export interface ModelCapabilities {
  supportVision: boolean;
  supportTool: boolean;
}

export interface ModelConfig {
  modelId: string;
  provider: ModelProvider;
  modelName: string;
  baseUrl: string;
  apiKey: string;
  capabilities: ModelCapabilities;
  stream: boolean;
  timeout: number;
}
