export const extractSiteName = (): string => {
  const ogSiteName = document.querySelector<HTMLMetaElement>('meta[property="og:site_name"]')?.content;
  if (ogSiteName) {
    return ogSiteName;
  }

  const title = document.title.trim();
  if (title.includes('-')) {
    return title.split('-').at(-1)?.trim() ?? title;
  }
  if (title.includes('|')) {
    return title.split('|').at(-1)?.trim() ?? title;
  }
  return window.location.hostname;
};
