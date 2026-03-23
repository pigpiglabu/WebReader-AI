import { MESSAGE_TYPES } from '../shared/constants';
import type { BackupPayload, PageContent } from '../shared/types';
import { isBackupPayload } from '../shared/utils/validators';
import { apiGateway } from './modules/apiGateway';
import { chatManager } from './modules/chatManager';
import { routingEngine } from './modules/routingEngine';
import { storageService } from './services/storageService';

chrome.runtime.onInstalled.addListener(() => {
  void storageService.getAll();
  if (chrome.sidePanel?.setPanelBehavior) {
    void chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }
});

chrome.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: (response?: any) => void) => {
  if (message?.type === MESSAGE_TYPES.SAVE_PAGE_CONTEXT) {
    void (async () => {
      await storageService.savePageContent(message.payload.url, message.payload);
      const storage = await storageService.getAll();
      const matchedRule = routingEngine.match(storage.siteConfigs, message.payload as PageContent);
      sendResponse({ ok: true, matchedRule });
    })();
    return true;
  }

  if (message?.type === MESSAGE_TYPES.SEND_CHAT) {
    void (async () => {
      const storage = await storageService.getAll();
      const session = storage.sessions.find((item) => item.sessionId === message.payload.sessionId)
        ?? chatManager.createSession(message.payload.sessionDraft);
      const userMessage = chatManager.createMessage({
        sessionId: session.sessionId,
        role: 'user',
        content: message.payload.content,
        attachments: message.payload.attachments ?? []
      });
      const model = storage.models.find((item) => item.modelId === session.modelId) ?? storage.models[0];
      const pageContent = storage.pageCache[message.payload.pageUrl];

      if (!model) {
        sendResponse({ ok: false, error: 'No model configured.' });
        return;
      }

      const replyContent = await apiGateway.chat([userMessage], model, pageContent);
      const assistantMessage = chatManager.createMessage({
        sessionId: session.sessionId,
        role: 'assistant',
        content: replyContent,
        attachments: []
      });

      await chrome.storage.local.set({
        sessions: storage.sessions.some((item) => item.sessionId === session.sessionId) ? storage.sessions : [...storage.sessions, session],
        messages: [...storage.messages, userMessage, assistantMessage]
      });

      sendResponse({ ok: true, session, messages: [userMessage, assistantMessage] });
    })();
    return true;
  }

  if (message?.type === MESSAGE_TYPES.EXPORT_BACKUP) {
    void (async () => {
      const payload = await storageService.exportBackup();
      sendResponse({ ok: true, payload });
    })();
    return true;
  }

  if (message?.type === MESSAGE_TYPES.IMPORT_BACKUP) {
    void (async () => {
      const payload: BackupPayload = message.payload;
      if (!isBackupPayload(payload)) {
        sendResponse({ ok: false, error: 'Invalid backup payload.' });
        return;
      }
      await storageService.importBackup(payload);
      sendResponse({ ok: true });
    })();
    return true;
  }


  if (message?.type === MESSAGE_TYPES.OPEN_SIDE_PANEL) {
    void (async () => {
      const tabId = _sender?.tab?.id ?? message.tabId;
      if (typeof tabId !== 'number') {
        sendResponse({ ok: false, error: 'No active tab available.' });
        return;
      }

      await chrome.sidePanel.setOptions({
        tabId,
        path: 'sidepanel.html',
        enabled: true
      });
      await chrome.sidePanel.open({ tabId });
      sendResponse({ ok: true });
    })();
    return true;
  }

  if (message?.type === MESSAGE_TYPES.OPEN_OPTIONS) {
    void chrome.runtime.openOptionsPage();
    sendResponse({ ok: true });
    return false;
  }

  return false;
});
