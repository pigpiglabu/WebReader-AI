import { useEffect, useState } from 'react';
import type { ChatMessage } from '../../../../../shared/types';

export const useChatHistory = (sessionId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    void chrome.storage.local.get('messages').then((result: { messages?: ChatMessage[] }) => {
      const allMessages = (result.messages as ChatMessage[] | undefined) ?? [];
      setMessages(sessionId ? allMessages.filter((message) => message.sessionId === sessionId) : allMessages);
    });
  }, [sessionId]);

  return { messages, setMessages };
};
