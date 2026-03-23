export const expandCollapsedContent = async (): Promise<void> => {
  const expandButtons = Array.from(document.querySelectorAll<HTMLElement>('button, [role="button"], a'))
    .filter((element) => /展开|更多|read more|show more/i.test(element.innerText));

  expandButtons.slice(0, 3).forEach((button) => button.click());

  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  await new Promise((resolve) => window.setTimeout(resolve, 300));
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
