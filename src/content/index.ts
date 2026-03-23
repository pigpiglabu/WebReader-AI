import { runAutoActions } from './automation/autoActions';
import { expandCollapsedContent } from './extraction/preprocessor';
import { parseReadableContent } from './extraction/readabilityParser';
import { mountFloatingButton } from './ui/floatingButton';

const CONTENT_MESSAGE_TYPES = {
  openSidePanel: 'OPEN_SIDE_PANEL',
  savePageContext: 'SAVE_PAGE_CONTEXT'
} as const;

const floatingButton = mountFloatingButton(() => {
  void chrome.runtime.sendMessage({ type: CONTENT_MESSAGE_TYPES.openSidePanel });
});

const syncFloatingButtonPreference = async () => {
  const result = await chrome.storage.sync.get('uiPreferences');
  floatingButton.setVisible(result.uiPreferences?.sidebarEnabled ?? true);
};

chrome.storage.onChanged.addListener((changes: Record<string, { newValue?: { sidebarEnabled?: boolean } }>, areaName: string) => {
  if (areaName === 'sync' && changes.uiPreferences) {
    floatingButton.setVisible(changes.uiPreferences.newValue?.sidebarEnabled ?? true);
  }
});

const bootstrap = async () => {
  floatingButton.setActive(true);
  await syncFloatingButtonPreference();
  await expandCollapsedContent();
  const pageContent = parseReadableContent();
  const response = await chrome.runtime.sendMessage({ type: CONTENT_MESSAGE_TYPES.savePageContext, payload: pageContent });

  if (response?.matchedRule?.autoActions) {
    await runAutoActions(response.matchedRule.autoActions);
  }

  floatingButton.setActive(false);
  console.info('[content] page context synced', { url: pageContent.url });
};

void bootstrap();
