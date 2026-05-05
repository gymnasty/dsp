import { Item } from '../types';
import i18n from '../i18n';

export const getItemName = (item: Item | undefined): string => {
  if (!item) return '';
  const lang = i18n.language;
  if (lang.startsWith('ja')) {
    return item.nameJa || item.name;
  }
  return item.name;
};
