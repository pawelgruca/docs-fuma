import meta from '@/content/docs/meta.json';
import { source } from './source';

const SEPARATOR_PREFIX = '---';
const INDEX_PAGE = 'index';

export function getOrderedPages() {
  return meta.pages
    .filter((entry) => !entry.startsWith(SEPARATOR_PREFIX))
    .map((entry) => source.getPage(entry === INDEX_PAGE ? [] : [entry]))
    .filter((page) => page !== undefined);
}
