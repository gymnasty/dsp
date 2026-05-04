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
    id: 'copper_ingot',
    outputItemId: ITEMS.COPPER_INGOT.id,
    outputCount: 1,
    time: 1,
    ingredients: [{ itemId: ITEMS.COPPER_ORE.id, count: 1 }],
    producedIn: 'Smelter'
  },
  {
    id: 'stone_brick',
    outputItemId: ITEMS.STONE_BRICK.id,
    outputCount: 1,
    time: 1,
    ingredients: [{ itemId: ITEMS.STONE.id, count: 1 }],
    producedIn: 'Smelter'
  },
  {
    id: 'glass',
    outputItemId: ITEMS.GLASS.id,
    outputCount: 1,
    time: 2,
    ingredients: [{ itemId: ITEMS.STONE.id, count: 2 }],
    producedIn: 'Smelter'
  },
  {
    id: 'steel',
    outputItemId: ITEMS.STEEL.id,
    outputCount: 1,
    time: 3,
    ingredients: [{ itemId: ITEMS.IRON_INGOT.id, count: 3 }],
    producedIn: 'Smelter'
  },
  {
    id: 'energetic_graphite',
    outputItemId: ITEMS.ENERGETIC_GRAPHITE.id,
    outputCount: 1,
    time: 2,
    ingredients: [{ itemId: ITEMS.COAL.id, count: 2 }],
    producedIn: 'Smelter'
  },
  {
    id: 'high_purity_silicon',
    outputItemId: ITEMS.HIGH_PURITY_SILICON.id,
    outputCount: 1,
    time: 2,
    ingredients: [{ itemId: ITEMS.SILICON_ORE.id, count: 2 }],
    producedIn: 'Smelter'
  },
  {
    id: 'titanium_ingot',
    outputItemId: ITEMS.TITANIUM_INGOT.id,
    outputCount: 1,
    time: 2,
    ingredients: [{ itemId: ITEMS.TITANIUM_ORE.id, count: 2 }],
    producedIn: 'Smelter'
  },
  {
    id: 'electric_motor',
    outputItemId: ITEMS.ELECTRIC_MOTOR.id,
    outputCount: 1,
    time: 2,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 2 },
      { itemId: ITEMS.GEAR.id, count: 1 },
      { itemId: ITEMS.MAGNETIC_COIL.id, count: 1 }
    ],
    producedIn: 'Assembler'
  },
  {
    id: 'electromagnetic_turbine',
    outputItemId: ITEMS.ELECTROMAGNETIC_TURBINE.id,
    outputCount: 1,
    time: 2,
    ingredients: [
      { itemId: ITEMS.ELECTRIC_MOTOR.id, count: 2 },
      { itemId: ITEMS.MAGNETIC_COIL.id, count: 2 }
    ],
    producedIn: 'Assembler'
  },
  {
    id: 'microcrystalline_component',
    outputItemId: ITEMS.MICROCRYSTALLINE_COMPONENT.id,
    outputCount: 1,
    time: 2,
    ingredients: [
      { itemId: ITEMS.HIGH_PURITY_SILICON.id, count: 2 },
      { itemId: ITEMS.COPPER_INGOT.id, count: 1 }
    ],
    producedIn: 'Assembler'
  },
  {
    id: 'processor',
    outputItemId: ITEMS.PROCESSOR.id,
    outputCount: 1,
    time: 3,
    ingredients: [
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 2 },
      { itemId: ITEMS.MICROCRYSTALLINE_COMPONENT.id, count: 2 }
    ],
    producedIn: 'Assembler'
  },
  {
    id: 'electromagnetic_matrix',
    outputItemId: ITEMS.ELECTROMAGNETIC_MATRIX.id,
    outputCount: 1,
    time: 3,
    ingredients: [
      { itemId: ITEMS.MAGNETIC_COIL.id, count: 1 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 1 }
    ],
    producedIn: 'Matrix Lab'
  },
  {
    id: 'energy_matrix',
    outputItemId: ITEMS.ENERGY_MATRIX.id,
    outputCount: 1,
    time: 6,
    ingredients: [
      { itemId: ITEMS.ENERGETIC_GRAPHITE.id, count: 2 },
      { itemId: ITEMS.HYDROGEN.id, count: 2 }
    ],
    producedIn: 'Matrix Lab'
  },
  {
    id: 'diamond',
    outputItemId: ITEMS.DIAMOND.id,
    outputCount: 1,
    time: 2,
    ingredients: [{ itemId: ITEMS.ENERGETIC_GRAPHITE.id, count: 2 }],
    producedIn: 'Smelter'
  },
  {
    id: 'diamond_kimberlite',
    outputItemId: ITEMS.DIAMOND.id,
    outputCount: 2,
    time: 1.5,
    ingredients: [{ itemId: ITEMS.KIMBERLITE_ORE.id, count: 1 }],
    producedIn: 'Smelter'
  },
  {
    id: 'plastic',
    outputItemId: ITEMS.PLASTIC.id,
    outputCount: 1,
    time: 3,
    ingredients: [
      { itemId: ITEMS.REFINED_OIL.id, count: 2 },
      { itemId: ITEMS.ENERGETIC_GRAPHITE.id, count: 1 }
    ],
    producedIn: 'Chemical Plant'
  },
  {
    id: 'organic_crystal',
    outputItemId: ITEMS.ORGANIC_CRYSTAL.id,
    outputCount: 1,
    time: 6,
    ingredients: [
      { itemId: ITEMS.PLASTIC.id, count: 2 },
      { itemId: ITEMS.REFINED_OIL.id, count: 1 },
      { itemId: ITEMS.WATER.id, count: 1 }
    ],
    producedIn: 'Chemical Plant'
  },
  {
    id: 'titanium_crystal',
    outputItemId: ITEMS.TITANIUM_CRYSTAL.id,
    outputCount: 1,
    time: 4,
    ingredients: [
      { itemId: ITEMS.ORGANIC_CRYSTAL.id, count: 1 },
      { itemId: ITEMS.TITANIUM_INGOT.id, count: 3 }
    ],
    producedIn: 'Assembler'
  },
  {
    id: 'structure_matrix',
    outputItemId: ITEMS.STRUCTURE_MATRIX.id,
    outputCount: 1,
    time: 8,
    ingredients: [
      { itemId: ITEMS.DIAMOND.id, count: 1 },
      { itemId: ITEMS.TITANIUM_CRYSTAL.id, count: 1 }
    ],
    producedIn: 'Matrix Lab'
  },
  {
    id: 'graphene',
    outputItemId: ITEMS.GRAPHENE.id,
    outputCount: 2,
    time: 3,
    ingredients: [
      { itemId: ITEMS.ENERGETIC_GRAPHITE.id, count: 3 },
      { itemId: ITEMS.SULFURIC_ACID.id, count: 1 }
    ],
    producedIn: 'Chemical Plant'
  },
  {
    id: 'carbon_nanotube',
    outputItemId: ITEMS.CARBON_NANOTUBE.id,
    outputCount: 2,
    time: 4,
    ingredients: [
      { itemId: ITEMS.GRAPHENE.id, count: 3 },
      { itemId: ITEMS.TITANIUM_INGOT.id, count: 1 }
    ],
    producedIn: 'Chemical Plant'
  },
  {
    id: 'sulfuric_acid',
    outputItemId: ITEMS.SULFURIC_ACID.id,
    outputCount: 4,
    time: 6,
    ingredients: [
      { itemId: ITEMS.REFINED_OIL.id, count: 6 },
      { itemId: ITEMS.STONE.id, count: 8 },
      { itemId: ITEMS.WATER.id, count: 4 }
    ],
    producedIn: 'Chemical Plant'
  },
  {
    id: 'refined_oil',
    outputItemId: ITEMS.REFINED_OIL.id,
    outputCount: 2,
    time: 4,
    ingredients: [{ itemId: ITEMS.CRUDE_OIL.id, count: 2 }],
    extraOutputs: [{ itemId: ITEMS.HYDROGEN.id, count: 1 }],
    producedIn: 'Oil Refinery'
  },
  {
    id: 'x_ray_cracking',
    outputItemId: ITEMS.ENERGETIC_GRAPHITE.id,
    outputCount: 1,
    time: 4,
    ingredients: [
      { itemId: ITEMS.REFINED_OIL.id, count: 1 },
      { itemId: ITEMS.HYDROGEN.id, count: 2 }
    ],
    extraOutputs: [{ itemId: ITEMS.HYDROGEN.id, count: 3 }],
    producedIn: 'Oil Refinery'
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
