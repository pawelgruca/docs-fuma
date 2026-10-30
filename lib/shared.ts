import { createGetUrl } from 'fumadocs-core/source';
import documentInfo from './document-info.json';

export { documentInfo };

export const appName = 'eSklep · Podręcznik Administratora';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';
export const printRoute = '/druk';
export const pdfRoute = '/podrecznik.pdf';
export const pdfFileName = `Podrecznik-Administratora-Systemu-GCUW-${documentInfo.version}.pdf`;

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
