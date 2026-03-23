import { MESSAGE_TYPES } from '../shared/constants';
import { logger } from '../shared/utils/logger';
import { runAutoActions } from './automation/autoActions';
import { expandCollapsedContent } from './extraction/preprocessor';
import { parseReadableContent } from './extraction/readabilityParser';

const bootstrap = async () => {
  await expandCollapsedContent();
  const pageContent = parseReadableContent();
  const response = await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SAVE_PAGE_CONTEXT, payload: pageContent });

  if (response?.matchedRule?.autoActions) {
    await runAutoActions(response.matchedRule.autoActions);
  }

  logger.info('content', 'page context synced', { url: pageContent.url });
};

void bootstrap();
