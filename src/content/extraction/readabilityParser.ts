import { Readability } from '@mozilla/readability';
import type { PageContent } from '../../shared/types';
import { extractSiteName } from './siteExtractor';

export const parseReadableContent = (): PageContent => {
  const clonedDocument = document.cloneNode(true) as Document;
  const article = new Readability(clonedDocument).parse();
  return {
    url: window.location.href,
    title: article?.title ?? document.title,
    siteName: extractSiteName(),
    textContent: article?.textContent ?? document.body.innerText,
    htmlContent: article?.content ?? document.body.innerHTML,
    attachments: Array.from(document.images).slice(0, 5).map((image) => ({ type: 'image', dataUrl: image.src, name: image.alt || 'image' }))
  };
};
