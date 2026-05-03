import { Item } from '../types';

export const ITEMS: Record<string, Item> = {
  IRON_ORE: { id: 'iron_ore', name: '鉄鉱石', category: 'Components', iconPath: '/icons/iron_ore.png' },
  COPPER_ORE: { id: 'copper_ore', name: '銅鉱石', category: 'Components', iconPath: '/icons/copper_ore.png' },
  IRON_INGOT: { id: 'iron_ingot', name: '鉄材', category: 'Components', iconPath: '/icons/iron_ingot.png' },
  COPPER_INGOT: { id: 'copper_ingot', name: '銅材', category: 'Components', iconPath: '/icons/copper_ingot.png' },
  MAGNET: { id: 'magnet', name: '磁石', category: 'Components', iconPath: '/icons/magnet.png' },
  MAGNETIC_COIL: { id: 'magnetic_coil', name: '磁気コイル', category: 'Components', iconPath: '/icons/magnetic_coil.png' },
  GEAR: { id: 'gear', name: '歯車', category: 'Components', iconPath: '/icons/gear.png' },
  CIRCUIT_BOARD: { id: 'circuit_board', name: '回路基板', category: 'Components', iconPath: '/icons/circuit_board.png' },
};
