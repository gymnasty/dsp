export const ITEM_TYPES = {
  COMPONENT: 'Component',
  BUILDING: 'Building',
} as const;

export type ItemType = typeof ITEM_TYPES[keyof typeof ITEM_TYPES];

export const CATEGORIES = {
  NATURAL_RESOURCES: 'Natural Resources',
  INTERMEDIATE_PRODUCTS: 'Intermediate Products',
  DARK_FOG_COMPONENTS: 'Dark Fog Components',
  ENERGY_SOURCES: 'Energy Sources',
  AMMUNITION: 'Ammunition',
  OTHER_CONSUMABLES: 'Other Consumables',
  LOGISTICS_SHIPS: 'Logistics Ships',
  COMBAT_UNITS: 'Combat Units',
  DYSON_SPHERE: 'Dyson Sphere',
  // New Building Categories
  POWER: 'Power',
  COLLECTION: 'Collection',
  LOGISTICS: 'Logistics',
  STORAGE: 'Storage',
  PRODUCTION_BUILDING: 'Production',
  TRANSPORT: 'Transport',
  DEFENSE: 'Defense',
  COSMO: 'COSMO',
  ENVIRONMENT: 'Environment',
  } as const;
export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];

export const FACILITIES = {
  SMELTER: 'Smelter',
  ASSEMBLER: 'Assembler',
  CHEMICAL_PLANT: 'Chemical Plant',
  OIL_REFINERY: 'Oil Refinery',
  MATRIX_LAB: 'Matrix Lab',
  PARTICLE_COLLIDER: 'Particle Collider',
  FRACTIONATOR: 'Fractionator',
  WATER_PUMP: 'Water Pump',
  OIL_EXTRACTOR: 'Oil Extractor',
  ORBITAL_COLLECTOR: 'Orbital Collector',
  MINING_MACHINE: 'Mining Machine',
  ENERGY_EXCHANGER: 'Energy Exchanger',
} as const;

export type Facility = typeof FACILITIES[keyof typeof FACILITIES];

export interface Item {
  id: string;
  type: ItemType;
  category: Category;
  description?: string;
  iconPath?: string;
  facilityType?: Facility; // For buildings, which facility type it is
  productionSpeed?: number; // For buildings, its base production speed (e.g. 0.75, 1, 2)
}

export interface Ingredient {
  itemId: string;
  count: number;
}

export interface Recipe {
  id: string;
  outputItemId: string;
  outputCount: number;
  extraOutputs?: Ingredient[];
  time: number; // in seconds
  ingredients: Ingredient[];
  producedIn: Facility;
}
