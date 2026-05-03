import { Recipe } from '../types';
import { ITEMS } from './items';

export const RECIPES: Recipe[] = [
  {
    id: 'iron_ingot',
    outputItemId: ITEMS.IRON_INGOT.id,
    outputCount: 1,
    time: 1,
    ingredients: [{ itemId: ITEMS.IRON_ORE.id, count: 1 }],
    producedIn: 'Smelter'
  },
  {
    id: 'magnet',
    outputItemId: ITEMS.MAGNET.id,
    outputCount: 1,
    time: 1.5,
    ingredients: [{ itemId: ITEMS.IRON_ORE.id, count: 1 }],
    producedIn: 'Smelter'
  },
  {
    id: 'gear',
    outputItemId: ITEMS.GEAR.id,
    outputCount: 1,
    time: 1,
    ingredients: [{ itemId: ITEMS.IRON_INGOT.id, count: 1 }],
    producedIn: 'Assembler'
  },
  {
    id: 'magnetic_coil',
    outputItemId: ITEMS.MAGNETIC_COIL.id,
    outputCount: 2,
    time: 1,
    ingredients: [
      { itemId: ITEMS.MAGNET.id, count: 2 },
      { itemId: ITEMS.COPPER_INGOT.id, count: 1 }
    ],
    producedIn: 'Assembler'
  },
  {
    id: 'circuit_board',
    outputItemId: ITEMS.CIRCUIT_BOARD.id,
    outputCount: 2,
    time: 1,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 2 },
      { itemId: ITEMS.COPPER_INGOT.id, count: 1 }
    ],
    producedIn: 'Assembler'
  }
];
