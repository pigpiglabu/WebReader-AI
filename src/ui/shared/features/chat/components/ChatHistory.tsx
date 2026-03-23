import type { ChatMessage } from '../../../../../shared/types';

interface ChatHistoryProps {
  messages: ChatMessage[];
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <div className="wr-panel wr-list" style={{ minHeight: 260 }}>
      {messages.map((message) => (
        <div key={message.messageId} className={`wr-message wr-message--${message.role === 'user' ? 'user' : 'assistant'}`}>
          <strong>{message.role === 'user' ? '你' : 'AI'}</strong>
          <div>{message.content}</div>
        </div>
      ))}
      {messages.length === 0 && <p>暂无消息，先向当前网页发起提问。</p>}
    </div>
  );
}
