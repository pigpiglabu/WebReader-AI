import type { AutoAction } from '../../shared/types';

export const runAutoActions = async (actions: AutoAction[]): Promise<void> => {
  for (const action of actions) {
    if (action.action === 'click' && action.selector) {
      document.querySelector<HTMLElement>(action.selector)?.click();
    }

    if (action.action === 'scroll') {
      window.scrollBy({ top: action.value ?? window.innerHeight, behavior: 'smooth' });
    }

    await new Promise((resolve) => window.setTimeout(resolve, action.action === 'wait' ? (action.value ?? 500) : 300));
  }
};
