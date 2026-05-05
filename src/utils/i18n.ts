import { Item } from '../types';
import i18n from '../i18n';

export const getItemName = (item: Item | undefined): string => {
  if (!item) return '';
  return i18n.t(`items.${item.id}`);
};
