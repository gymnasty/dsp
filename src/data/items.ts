import { Item } from '../types';

export const ITEMS: Record<string, Item> = {
  IRON_ORE: { id: 'iron_ore', name: '鉄鉱石', category: 'Components' },
  COPPER_ORE: { id: 'copper_ore', name: '銅鉱石', category: 'Components' },
  IRON_INGOT: { id: 'iron_ingot', name: '鉄材', category: 'Components' },
  COPPER_INGOT: { id: 'copper_ingot', name: '銅材', category: 'Components' },
  MAGNET: { id: 'magnet', name: '磁石', category: 'Components' },
  MAGNETIC_COIL: { id: 'magnetic_coil', name: '磁気コイル', category: 'Components' },
  GEAR: { id: 'gear', name: '歯車', category: 'Components' },
  CIRCUIT_BOARD: { id: 'circuit_board', name: '回路基板', category: 'Components' },
};
