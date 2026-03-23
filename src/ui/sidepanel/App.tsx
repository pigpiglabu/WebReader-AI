import { useEffect, useState } from 'react';
import type { ChatMessage, ChatSession, ModelConfig, PageContent, RoleConfig } from '../../shared/types';
import { ChatHistory, ChatInput, useChatHistory, useChatStream } from '../shared/features/chat';
import '../shared/styles/global.css';

export function App() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [roles, setRoles] = useState<RoleConfig[]>([]);
  const [session, setSession] = useState<ChatSession | undefined>(undefined);
  const { messages, setMessages } = useChatHistory(session?.sessionId);
  const { sendChat, isSending } = useChatStream();

  useEffect(() => {
    void Promise.all([
      chrome.storage.local.get('pageCache'),
      chrome.storage.sync.get(['models', 'roles', 'uiPreferences'])
    ]).then(([localResult, syncResult]) => {
      const pageCache = localResult.pageCache as Record<string, PageContent> | undefined;
      const latestPage = pageCache ? Object.values(pageCache).at(-1) ?? null : null;
      setPageContent(latestPage);
      const allModels = (syncResult.models as ModelConfig[] | undefined) ?? [];
      const allRoles = (syncResult.roles as RoleConfig[] | undefined) ?? [];
      const currentModelId = syncResult.uiPreferences?.currentModelId as string | undefined;
      const currentRoleId = syncResult.uiPreferences?.currentRoleId as string | undefined;
      setModels(currentModelId ? [...allModels.filter((item) => item.modelId === currentModelId), ...allModels.filter((item) => item.modelId !== currentModelId)] : allModels);
      setRoles(currentRoleId ? [...allRoles.filter((item) => item.roleId === currentRoleId), ...allRoles.filter((item) => item.roleId !== currentRoleId)] : allRoles);
    });
  }, []);

  const handleSend = async (content: string) => {
    if (!pageContent) return;
    const response = await sendChat({
      content,
      pageUrl: pageContent.url,
      session,
      model: models[0],
      role: roles[0]
    });
    setSession(response.session);
    setMessages((current: ChatMessage[]) => [...current, ...response.messages]);
  };

  return (
    <main className="wr-shell" style={{ minWidth: 380 }}>
      <section className="wr-panel">
        <h2>{pageContent?.siteName ?? '当前网页'}</h2>
        <p>{pageContent?.title ?? '等待内容脚本提取上下文...'}</p>
        <div>
          <span className="wr-chip">智能分析</span>
          <span className="wr-chip">长图分析(预留)</span>
          <span className="wr-chip">混合分析(预留)</span>
        </div>
      </section>
      <ChatHistory messages={messages} />
      <ChatInput onSend={handleSend} disabled={isSending || !pageContent} />
    </main>
  );
}
