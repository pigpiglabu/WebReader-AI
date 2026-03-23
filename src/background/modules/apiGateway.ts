import type { ChatMessage, ModelConfig, PageContent } from '../../shared/types';
import { logger } from '../../shared/utils/logger';

export interface ModelTestResult {
  ok: boolean;
  message: string;
}

export interface ChatGatewayStrategy {
  supports(model: ModelConfig): boolean;
  send(messages: ChatMessage[], model: ModelConfig, pageContent?: PageContent): Promise<string>;
  test(model: ModelConfig): Promise<ModelTestResult>;
}

const buildUrl = (baseUrl: string, path: string): string => `${baseUrl.replace(/\/$/, '')}${path}`;

const withTimeout = async (timeout: number, request: (signal: AbortSignal) => Promise<Response>): Promise<Response> => {
  const controller = new AbortController();
  const timer = globalThis.setTimeout(() => controller.abort(), timeout);

  try {
    return await request(controller.signal);
  } finally {
    globalThis.clearTimeout(timer);
  }
};

const toResult = async (response: Response, successMessage: string): Promise<ModelTestResult> => {
  if (response.ok) {
    return { ok: true, message: successMessage };
  }

  const body = await response.text();
  return {
    ok: false,
    message: `请求失败 (${response.status})：${body.slice(0, 200)}`
  };
};

class OpenAICompatibleStrategy implements ChatGatewayStrategy {
  supports(model: ModelConfig): boolean {
    return ['OpenAI', 'Qwen', 'Custom'].includes(model.provider);
  }

  async send(messages: ChatMessage[], model: ModelConfig, pageContent?: PageContent): Promise<string> {
    const systemContext = pageContent ? `

Context:
${pageContent.textContent.slice(0, 4000)}` : '';
    const latestUserInput = messages.filter((message) => message.role === 'user').at(-1)?.content ?? '';
    logger.network('apiGateway', 'using mock OpenAI-compatible strategy', { model: model.modelName });
    return `已通过 ${model.provider}/${model.modelName} 接收消息：${latestUserInput}${systemContext ? '，并已附加网页上下文。' : '。'}`;
  }

  async test(model: ModelConfig): Promise<ModelTestResult> {
    if (!model.baseUrl || !model.modelName) {
      return { ok: false, message: '请先填写 Base URL 和模型名称。' };
    }

    const response = await withTimeout(model.timeout, (signal) => fetch(buildUrl(model.baseUrl, '/chat/completions'), {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        ...(model.apiKey ? { Authorization: `Bearer ${model.apiKey}` } : {})
      },
      body: JSON.stringify({
        model: model.modelName,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5,
        stream: false
      })
    }));

    return toResult(response, `${model.provider}/${model.modelName} 测试通过。`);
  }
}

class AnthropicStrategy implements ChatGatewayStrategy {
  supports(model: ModelConfig): boolean {
    return model.provider === 'Anthropic';
  }

  async send(messages: ChatMessage[], model: ModelConfig): Promise<string> {
    const latestUserInput = messages.filter((message) => message.role === 'user').at(-1)?.content ?? '';
    logger.network('apiGateway', 'using mock anthropic strategy', { model: model.modelName });
    return `Anthropic ${model.modelName} 已收到消息：${latestUserInput}`;
  }

  async test(model: ModelConfig): Promise<ModelTestResult> {
    if (!model.baseUrl || !model.modelName || !model.apiKey) {
      return { ok: false, message: 'Anthropic 测试需要 Base URL、模型名称和 API Key。' };
    }

    const response = await withTimeout(model.timeout, (signal) => fetch(buildUrl(model.baseUrl, '/messages'), {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': model.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model.modelName,
        max_tokens: 5,
        messages: [{ role: 'user', content: 'ping' }]
      })
    }));

    return toResult(response, `Anthropic/${model.modelName} 测试通过。`);
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

  async test(model: ModelConfig): Promise<ModelTestResult> {
    if (!model.baseUrl || !model.modelName) {
      return { ok: false, message: 'Ollama 测试需要 Base URL 和模型名称。' };
    }

    const response = await withTimeout(model.timeout, (signal) => fetch(buildUrl(model.baseUrl, '/api/chat'), {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model.modelName,
        stream: false,
        messages: [{ role: 'user', content: 'ping' }]
      })
    }));

    return toResult(response, `Ollama/${model.modelName} 测试通过。`);
  }
}

export class ApiGateway {
  constructor(private readonly strategies: ChatGatewayStrategy[]) {}

  private resolveStrategy(model: ModelConfig): ChatGatewayStrategy {
    const strategy = this.strategies.find((candidate) => candidate.supports(model));
    if (!strategy) {
      throw new Error(`No strategy found for provider ${model.provider}`);
    }
    return strategy;
  }

  async chat(messages: ChatMessage[], model: ModelConfig, pageContent?: PageContent): Promise<string> {
    return this.resolveStrategy(model).send(messages, model, pageContent);
  }

  async testModel(model: ModelConfig): Promise<ModelTestResult> {
    try {
      return await this.resolveStrategy(model).test(model);
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : '测试请求失败。'
      };
    }
  }
}

export const apiGateway = new ApiGateway([
  new OpenAICompatibleStrategy(),
  new AnthropicStrategy(),
  new OllamaStrategy()
]);
