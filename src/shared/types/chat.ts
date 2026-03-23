export interface Attachment {
  type: 'image' | 'pdf_converted_image' | 'file';
  dataUrl: string;
  name?: string;
}

export interface ChatSession {
  sessionId: string;
  siteId?: string;
  title: string;
  modelId: string;
  roleId: string;
  createdAt: number;
}

export interface ChatMessage {
  messageId: string;
  sessionId: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  createdAt: number;
}
