import type { ChatMessage, ModelConfig, PageContent } from '../../shared/types';
import { logger } from '../../shared/utils/logger';

export interface ChatGatewayStrategy {
  supports(model: ModelConfig): boolean;
  send(messages: ChatMessage[], model: ModelConfig, pageContent?: PageContent): Promise<string>;
}

class OpenAICompatibleStrategy implements ChatGatewayStrategy {
  supports(model: ModelConfig): boolean {
    return ['OpenAI', 'Qwen', 'Custom', 'Anthropic'].includes(model.provider);
  }

  async send(messages: ChatMessage[], model: ModelConfig, pageContent?: PageContent): Promise<string> {
    const systemContext = pageContent ? `\n\nContext:\n${pageContent.textContent.slice(0, 4000)}` : '';
    const latestUserInput = messages.filter((message) => message.role === 'user').at(-1)?.content ?? '';
    logger.network('apiGateway', 'using mock OpenAI-compatible strategy', { model: model.modelName });
    return `已通过 ${model.provider}/${model.modelName} 接收消息：${latestUserInput}${systemContext ? '，并已附加网页上下文。' : '。'}`;
  }
}

class OllamaStrategy implements ChatGatewayStrategy {
  supports(model: ModelConfig): boolean {
    return model.provider === 'Ollama';
  }

  async send(messages: ChatMessage[], model: ModelConfig): Promise<string> {
    const latestUserInput = messages.filter((message) => message.role === 'user').at(-1)?.content ?? '';
    logger.network('apiGateway', 'using mock ollama strategy', { model: model.modelName });
    return `本地模型 ${model.modelName} 已分析请求：${latestUserInput}`;
  }
}

export class ApiGateway {
  constructor(private readonly strategies: ChatGatewayStrategy[]) {}

  async chat(messages: ChatMessage[], model: ModelConfig, pageContent?: PageContent): Promise<string> {
    const strategy = this.strategies.find((candidate) => candidate.supports(model));
    if (!strategy) {
      throw new Error(`No strategy found for provider ${model.provider}`);
    }

    return strategy.send(messages, model, pageContent);
  }
}

export const apiGateway = new ApiGateway([
  new OpenAICompatibleStrategy(),
  new OllamaStrategy()
]);
