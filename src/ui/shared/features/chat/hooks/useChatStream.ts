import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE_TYPES } from '../../../../../shared/constants';
import type { Attachment, ChatMessage, ChatSession, ModelConfig, RoleConfig } from '../../../../../shared/types';

interface SendChatInput {
  content: string;
  pageUrl: string;
  attachments?: Attachment[];
  session?: ChatSession;
  model?: ModelConfig;
  role?: RoleConfig;
}

export const useChatStream = () => {
  const [isSending, setIsSending] = useState(false);

  const sendChat = async ({ content, pageUrl, attachments, session, model, role }: SendChatInput): Promise<{ session: ChatSession; messages: ChatMessage[]; }> => {
    setIsSending(true);
    try {
      const sessionDraft = session ?? {
        sessionId: uuidv4(),
        title: content.slice(0, 20) || '新会话',
        modelId: model?.modelId ?? '',
        roleId: role?.roleId ?? '',
        siteId: undefined,
        createdAt: Date.now()
      };
      const response = await chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.SEND_CHAT,
        payload: {
          sessionId: session?.sessionId,
          sessionDraft,
          pageUrl,
          content,
          attachments: attachments ?? []
        }
      });

      if (!response?.ok) {
        throw new Error(response?.error ?? '发送失败');
      }

      return response;
    } finally {
      setIsSending(false);
    }
  };

  return { sendChat, isSending };
};
