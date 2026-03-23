import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage, ChatSession, StorageShape } from '../../shared/types';

export class ChatManager {
  createSession(input: Pick<ChatSession, 'title' | 'modelId' | 'roleId' | 'siteId'>): ChatSession {
    return {
      sessionId: uuidv4(),
      createdAt: Date.now(),
      ...input
    };
  }

  createMessage(input: Pick<ChatMessage, 'sessionId' | 'role' | 'content' | 'attachments'>): ChatMessage {
    return {
      messageId: uuidv4(),
      createdAt: Date.now(),
      ...input
    };
  }

  appendMessage(messages: StorageShape['messages'], message: ChatMessage): StorageShape['messages'] {
    return [...messages, message];
  }
}

export const chatManager = new ChatManager();
