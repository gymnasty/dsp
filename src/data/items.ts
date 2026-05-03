import { Item } from '../types';

export const ITEMS: Record<string, Item> = {
  IRON_ORE: { id: 'iron_ore', name: '鉄鉱石', category: 'Resource' },
  COPPER_ORE: { id: 'copper_ore', name: '銅鉱石', category: 'Resource' },
  IRON_INGOT: { id: 'iron_ingot', name: '鉄材', category: 'Resource' },
  COPPER_INGOT: { id: 'copper_ingot', name: '銅材', category: 'Resource' },
  MAGNET: { id: 'magnet', name: '磁石', category: 'Resource' },
  MAGNETIC_COIL: { id: 'magnetic_coil', name: '磁気コイル', category: 'Component' },
  GEAR: { id: 'gear', name: '歯車', category: 'Component' },
  CIRCUIT_BOARD: { id: 'circuit_board', name: '回路基板', category: 'Component' },
};
