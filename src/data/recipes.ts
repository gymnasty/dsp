import { Recipe, FACILITIES } from '../types';
import { ITEMS } from './items';

export const RECIPES: Recipe[] = [
  {
    id: 'iron_ingot',
    outputItemId: ITEMS.IRON_INGOT.id,
    outputCount: 1,
    time: 1,
    ingredients: [{ itemId: ITEMS.IRON_ORE.id, count: 1 }],
    producedIn: FACILITIES.SMELTER
  },
  {
    id: 'magnet',
    outputItemId: ITEMS.MAGNET.id,
    outputCount: 1,
    time: 1.5,
    ingredients: [{ itemId: ITEMS.IRON_ORE.id, count: 1 }],
    producedIn: FACILITIES.SMELTER
  },
  {
    id: 'gear',
    outputItemId: ITEMS.GEAR.id,
    outputCount: 1,
    time: 1,
    ingredients: [{ itemId: ITEMS.IRON_INGOT.id, count: 1 }],
    producedIn: FACILITIES.ASSEMBLER
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
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'copper_ingot',
    outputItemId: ITEMS.COPPER_INGOT.id,
    outputCount: 1,
    time: 1,
    ingredients: [{ itemId: ITEMS.COPPER_ORE.id, count: 1 }],
    producedIn: FACILITIES.SMELTER
  },
  {
    id: 'stone_brick',
    outputItemId: ITEMS.STONE_BRICK.id,
    outputCount: 1,
    time: 1,
    ingredients: [{ itemId: ITEMS.STONE.id, count: 1 }],
    producedIn: FACILITIES.SMELTER
  },
  {
    id: 'glass',
    outputItemId: ITEMS.GLASS.id,
    outputCount: 1,
    time: 2,
    ingredients: [{ itemId: ITEMS.STONE.id, count: 2 }],
    producedIn: FACILITIES.SMELTER
  },
  {
    id: 'steel',
    outputItemId: ITEMS.STEEL.id,
    outputCount: 1,
    time: 3,
    ingredients: [{ itemId: ITEMS.IRON_INGOT.id, count: 3 }],
    producedIn: FACILITIES.SMELTER
  },
  {
    id: 'energetic_graphite',
    outputItemId: ITEMS.ENERGETIC_GRAPHITE.id,
    outputCount: 1,
    time: 2,
    ingredients: [{ itemId: ITEMS.COAL.id, count: 2 }],
    producedIn: FACILITIES.SMELTER
  },
  {
    id: 'high_purity_silicon',
    outputItemId: ITEMS.HIGH_PURITY_SILICON.id,
    outputCount: 1,
    time: 2,
    ingredients: [{ itemId: ITEMS.SILICON_ORE.id, count: 2 }],
    producedIn: FACILITIES.SMELTER
  },
  {
    id: 'titanium_ingot',
    outputItemId: ITEMS.TITANIUM_INGOT.id,
    outputCount: 1,
    time: 2,
    ingredients: [{ itemId: ITEMS.TITANIUM_ORE.id, count: 2 }],
    producedIn: FACILITIES.SMELTER
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
    producedIn: FACILITIES.ASSEMBLER
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
    producedIn: FACILITIES.ASSEMBLER
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
    producedIn: FACILITIES.ASSEMBLER
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
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'titanium_glass',
    outputItemId: ITEMS.TITANIUM_GLASS.id,
    outputCount: 2,
    time: 5,
    ingredients: [
      { itemId: ITEMS.GLASS.id, count: 2 },
      { itemId: ITEMS.TITANIUM_INGOT.id, count: 2 },
      { itemId: ITEMS.WATER.id, count: 2 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'crystal_silicon',
    outputItemId: ITEMS.CRYSTAL_SILICON.id,
    outputCount: 1,
    time: 2,
    ingredients: [{ itemId: ITEMS.HIGH_PURITY_SILICON.id, count: 1 }],
    producedIn: FACILITIES.SMELTER
  },
  {
    id: 'crystal_silicon_fractal',
    outputItemId: ITEMS.CRYSTAL_SILICON.id,
    outputCount: 2,
    time: 1.5,
    ingredients: [{ itemId: ITEMS.FRACTAL_SILICON.id, count: 1 }],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'casimir_crystal',
    outputItemId: ITEMS.CASIMIR_CRYSTAL.id,
    outputCount: 1,
    time: 4,
    ingredients: [
      { itemId: ITEMS.TITANIUM_CRYSTAL.id, count: 1 },
      { itemId: ITEMS.GRAPHENE.id, count: 2 },
      { itemId: ITEMS.HYDROGEN.id, count: 12 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'casimir_crystal_advanced',
    outputItemId: ITEMS.CASIMIR_CRYSTAL.id,
    outputCount: 1,
    time: 4,
    ingredients: [
      { itemId: ITEMS.GRATING_CRYSTAL.id, count: 1 },
      { itemId: ITEMS.GRAPHENE.id, count: 2 },
      { itemId: ITEMS.HYDROGEN.id, count: 12 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'particle_broadband',
    outputItemId: ITEMS.PARTICLE_BROADBAND.id,
    outputCount: 1,
    time: 8,
    ingredients: [
      { itemId: ITEMS.CARBON_NANOTUBE.id, count: 2 },
      { itemId: ITEMS.CRYSTAL_SILICON.id, count: 2 },
      { itemId: ITEMS.PLASTIC.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'plane_filter',
    outputItemId: ITEMS.PLANE_FILTER.id,
    outputCount: 1,
    time: 12,
    ingredients: [
      { itemId: ITEMS.TITANIUM_GLASS.id, count: 1 },
      { itemId: ITEMS.CASIMIR_CRYSTAL.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'quantum_chip',
    outputItemId: ITEMS.QUANTUM_CHIP.id,
    outputCount: 1,
    time: 6,
    ingredients: [
      { itemId: ITEMS.PROCESSOR.id, count: 2 },
      { itemId: ITEMS.PLANE_FILTER.id, count: 2 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'strange_matter',
    outputItemId: ITEMS.STRANGE_MATTER.id,
    outputCount: 1,
    time: 8,
    ingredients: [
      { itemId: ITEMS.PARTICLE_CONTAINER.id, count: 2 },
      { itemId: ITEMS.DEUTERIUM.id, count: 10 }
    ],
    producedIn: FACILITIES.PARTICLE_COLLIDER
  },
  {
    id: 'frame_material',
    outputItemId: ITEMS.FRAME_MATERIAL.id,
    outputCount: 1,
    time: 6,
    ingredients: [
      { itemId: ITEMS.CARBON_NANOTUBE.id, count: 4 },
      { itemId: ITEMS.TITANIUM_ALLOY.id, count: 1 },
      { itemId: ITEMS.HIGH_PURITY_SILICON.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'solar_sail',
    outputItemId: ITEMS.SOLAR_SAIL.id,
    outputCount: 2,
    time: 4,
    ingredients: [
      { itemId: ITEMS.GRAPHENE.id, count: 1 },
      { itemId: ITEMS.PHOTON_COMBINER.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'dyson_sphere_component',
    outputItemId: ITEMS.DYSON_SPHERE_COMPONENT.id,
    outputCount: 1,
    time: 8,
    ingredients: [
      { itemId: ITEMS.FRAME_MATERIAL.id, count: 3 },
      { itemId: ITEMS.PROCESSOR.id, count: 3 },
      { itemId: ITEMS.SOLAR_SAIL.id, count: 3 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'small_carrier_rocket',
    outputItemId: ITEMS.SMALL_CARRIER_ROCKET.id,
    outputCount: 1,
    time: 6,
    ingredients: [
      { itemId: ITEMS.DYSON_SPHERE_COMPONENT.id, count: 2 },
      { itemId: ITEMS.DEUTERON_FUEL_ROD.id, count: 4 },
      { itemId: ITEMS.QUANTUM_CHIP.id, count: 2 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'information_matrix',
    outputItemId: ITEMS.INFORMATION_MATRIX.id,
    outputCount: 1,
    time: 10,
    ingredients: [
      { itemId: ITEMS.PROCESSOR.id, count: 2 },
      { itemId: ITEMS.PARTICLE_BROADBAND.id, count: 1 }
    ],
    producedIn: FACILITIES.MATRIX_LAB
  },
  {
    id: 'gravity_matrix',
    outputItemId: ITEMS.GRAVITY_MATRIX.id,
    outputCount: 2,
    time: 24,
    ingredients: [
      { itemId: ITEMS.GRAVITON_LENS.id, count: 1 },
      { itemId: ITEMS.QUANTUM_CHIP.id, count: 1 }
    ],
    producedIn: FACILITIES.MATRIX_LAB
  },
  {
    id: 'universe_matrix',
    outputItemId: ITEMS.UNIVERSE_MATRIX.id,
    outputCount: 1,
    time: 15,
    ingredients: [
      { itemId: ITEMS.ELECTROMAGNETIC_MATRIX.id, count: 1 },
      { itemId: ITEMS.ENERGY_MATRIX.id, count: 1 },
      { itemId: ITEMS.STRUCTURE_MATRIX.id, count: 1 },
      { itemId: ITEMS.INFORMATION_MATRIX.id, count: 1 },
      { itemId: ITEMS.GRAVITY_MATRIX.id, count: 1 },
      { itemId: ITEMS.ANTIMATTER.id, count: 1 }
    ],
    producedIn: FACILITIES.MATRIX_LAB
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
    producedIn: FACILITIES.MATRIX_LAB
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
    producedIn: FACILITIES.MATRIX_LAB
  },
  {
    id: 'diamond',
    outputItemId: ITEMS.DIAMOND.id,
    outputCount: 1,
    time: 2,
    ingredients: [{ itemId: ITEMS.ENERGETIC_GRAPHITE.id, count: 2 }],
    producedIn: FACILITIES.SMELTER
  },
  {
    id: 'diamond_kimberlite',
    outputItemId: ITEMS.DIAMOND.id,
    outputCount: 2,
    time: 1.5,
    ingredients: [{ itemId: ITEMS.KIMBERLITE_ORE.id, count: 1 }],
    producedIn: FACILITIES.SMELTER
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
    producedIn: FACILITIES.CHEMICAL_PLANT
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
    producedIn: FACILITIES.CHEMICAL_PLANT
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
    producedIn: FACILITIES.ASSEMBLER
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
    producedIn: FACILITIES.MATRIX_LAB
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
    producedIn: FACILITIES.CHEMICAL_PLANT
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
    producedIn: FACILITIES.CHEMICAL_PLANT
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
    producedIn: FACILITIES.CHEMICAL_PLANT
  },
  {
    id: 'refined_oil',
    outputItemId: ITEMS.REFINED_OIL.id,
    outputCount: 2,
    time: 4,
    ingredients: [{ itemId: ITEMS.CRUDE_OIL.id, count: 2 }],
    extraOutputs: [{ itemId: ITEMS.HYDROGEN.id, count: 1 }],
    producedIn: FACILITIES.OIL_REFINERY
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
    producedIn: FACILITIES.OIL_REFINERY
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
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'plasma_exciter',
    outputItemId: ITEMS.PLASMA_EXCITER.id,
    outputCount: 1,
    time: 2,
    ingredients: [
      { itemId: ITEMS.MAGNETIC_COIL.id, count: 4 },
      { itemId: ITEMS.PRISM.id, count: 2 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'super_magnetic_ring',
    outputItemId: ITEMS.SUPER_MAGNETIC_RING.id,
    outputCount: 1,
    time: 3,
    ingredients: [
      { itemId: ITEMS.ELECTROMAGNETIC_TURBINE.id, count: 2 },
      { itemId: ITEMS.MAGNET.id, count: 3 },
      { itemId: ITEMS.ENERGETIC_GRAPHITE.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'assembling_machine_mki',
    outputItemId: ITEMS.ASSEMBLING_MACHINE_MKI.id,
    outputCount: 1,
    time: 2,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 4 },
      { itemId: ITEMS.GEAR.id, count: 8 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 4 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'assembling_machine_mkii',
    outputItemId: ITEMS.ASSEMBLING_MACHINE_MKII.id,
    outputCount: 1,
    time: 3,
    ingredients: [
      { itemId: ITEMS.ASSEMBLING_MACHINE_MKI.id, count: 1 },
      { itemId: ITEMS.GRAPHENE.id, count: 8 },
      { itemId: ITEMS.PROCESSOR.id, count: 4 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'assembling_machine_mkiii',
    outputItemId: ITEMS.ASSEMBLING_MACHINE_MKIII.id,
    outputCount: 1,
    time: 4,
    ingredients: [
      { itemId: ITEMS.ASSEMBLING_MACHINE_MKII.id, count: 1 },
      { itemId: ITEMS.PARTICLE_BROADBAND.id, count: 8 },
      { itemId: ITEMS.QUANTUM_CHIP.id, count: 2 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'tesla_tower',
    outputItemId: ITEMS.TESLA_TOWER.id,
    outputCount: 1,
    time: 1,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 2 },
      { itemId: ITEMS.MAGNETIC_COIL.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'wireless_power_tower',
    outputItemId: ITEMS.WIRELESS_POWER_TOWER.id,
    outputCount: 1,
    time: 3,
    ingredients: [
      { itemId: ITEMS.TESLA_TOWER.id, count: 1 },
      { itemId: ITEMS.PLASMA_EXCITER.id, count: 3 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'satellite_substation',
    outputItemId: ITEMS.SATELLITE_SUBSTATION.id,
    outputCount: 1,
    time: 5,
    ingredients: [
      { itemId: ITEMS.WIRELESS_POWER_TOWER.id, count: 1 },
      { itemId: ITEMS.SUPER_MAGNETIC_RING.id, count: 10 },
      { itemId: ITEMS.FRAME_MATERIAL.id, count: 2 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'wind_turbine',
    outputItemId: ITEMS.WIND_TURBINE.id,
    outputCount: 1,
    time: 4,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 6 },
      { itemId: ITEMS.GEAR.id, count: 1 },
      { itemId: ITEMS.MAGNETIC_COIL.id, count: 3 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'thermal_power_plant',
    outputItemId: ITEMS.THERMAL_POWER_PLANT.id,
    outputCount: 1,
    time: 5,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 10 },
      { itemId: ITEMS.STONE_BRICK.id, count: 4 },
      { itemId: ITEMS.GEAR.id, count: 4 },
      { itemId: ITEMS.MAGNETIC_COIL.id, count: 4 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'solar_panel',
    outputItemId: ITEMS.SOLAR_PANEL.id,
    outputCount: 1,
    time: 6,
    ingredients: [
      { itemId: ITEMS.COPPER_INGOT.id, count: 10 },
      { itemId: ITEMS.HIGH_PURITY_SILICON.id, count: 10 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 5 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'mining_machine',
    outputItemId: ITEMS.MINING_MACHINE.id,
    outputCount: 1,
    time: 3,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 10 },
      { itemId: ITEMS.MAGNETIC_COIL.id, count: 4 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 2 },
      { itemId: ITEMS.GEAR.id, count: 2 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'water_pump',
    outputItemId: ITEMS.WATER_PUMP.id,
    outputCount: 1,
    time: 4,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 8 },
      { itemId: ITEMS.STONE_BRICK.id, count: 4 },
      { itemId: ITEMS.ELECTRIC_MOTOR.id, count: 4 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 2 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'oil_extractor',
    outputItemId: ITEMS.OIL_EXTRACTOR.id,
    outputCount: 1,
    time: 8,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 12 },
      { itemId: ITEMS.STONE_BRICK.id, count: 8 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 4 },
      { itemId: ITEMS.PLASMA_EXCITER.id, count: 4 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'arc_smelter',
    outputItemId: ITEMS.ARC_SMELTER.id,
    outputCount: 1,
    time: 3,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 4 },
      { itemId: ITEMS.STONE_BRICK.id, count: 2 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 4 },
      { itemId: ITEMS.MAGNETIC_COIL.id, count: 2 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'oil_refinery',
    outputItemId: ITEMS.OIL_REFINERY.id,
    outputCount: 1,
    time: 6,
    ingredients: [
      { itemId: ITEMS.STEEL.id, count: 10 },
      { itemId: ITEMS.STONE_BRICK.id, count: 10 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 6 },
      { itemId: ITEMS.PLASMA_EXCITER.id, count: 6 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'chemical_plant',
    outputItemId: ITEMS.CHEMICAL_PLANT.id,
    outputCount: 1,
    time: 5,
    ingredients: [
      { itemId: ITEMS.STEEL.id, count: 8 },
      { itemId: ITEMS.STONE_BRICK.id, count: 8 },
      { itemId: ITEMS.GLASS.id, count: 8 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 2 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'matrix_lab',
    outputItemId: ITEMS.MATRIX_LAB.id,
    outputCount: 1,
    time: 3,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 8 },
      { itemId: ITEMS.GLASS.id, count: 4 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 4 },
      { itemId: ITEMS.MAGNETIC_COIL.id, count: 4 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'thruster',
    outputItemId: ITEMS.THRUSTER.id,
    outputCount: 1,
    time: 4,
    ingredients: [
      { itemId: ITEMS.STEEL.id, count: 2 },
      { itemId: ITEMS.COPPER_INGOT.id, count: 3 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'reinforced_thruster',
    outputItemId: ITEMS.REINFORCED_THRUSTER.id,
    outputCount: 1,
    time: 6,
    ingredients: [
      { itemId: ITEMS.TITANIUM_ALLOY.id, count: 5 },
      { itemId: ITEMS.ELECTROMAGNETIC_TURBINE.id, count: 5 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'conveyor_belt_mki',
    outputItemId: ITEMS.CONVEYOR_BELT_MKI.id,
    outputCount: 3,
    time: 1,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 2 },
      { itemId: ITEMS.GEAR.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'conveyor_belt_mkii',
    outputItemId: ITEMS.CONVEYOR_BELT_MKII.id,
    outputCount: 3,
    time: 1,
    ingredients: [
      { itemId: ITEMS.CONVEYOR_BELT_MKI.id, count: 3 },
      { itemId: ITEMS.ELECTROMAGNETIC_TURBINE.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'conveyor_belt_mkiii',
    outputItemId: ITEMS.CONVEYOR_BELT_MKIII.id,
    outputCount: 3,
    time: 1,
    ingredients: [
      { itemId: ITEMS.CONVEYOR_BELT_MKII.id, count: 3 },
      { itemId: ITEMS.SUPER_MAGNETIC_RING.id, count: 1 },
      { itemId: ITEMS.GRAPHENE.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'sorter_mki',
    outputItemId: ITEMS.SORTER_MKI.id,
    outputCount: 1,
    time: 1,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 1 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'sorter_mkii',
    outputItemId: ITEMS.SORTER_MKII.id,
    outputCount: 2,
    time: 1,
    ingredients: [
      { itemId: ITEMS.SORTER_MKI.id, count: 2 },
      { itemId: ITEMS.ELECTRIC_MOTOR.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'sorter_mkiii',
    outputItemId: ITEMS.SORTER_MKIII.id,
    outputCount: 2,
    time: 1,
    ingredients: [
      { itemId: ITEMS.SORTER_MKII.id, count: 2 },
      { itemId: ITEMS.ELECTROMAGNETIC_TURBINE.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'splitter',
    outputItemId: ITEMS.SPLITTER.id,
    outputCount: 1,
    time: 2,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 3 },
      { itemId: ITEMS.GEAR.id, count: 2 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'storage_mki',
    outputItemId: ITEMS.STORAGE_MKI.id,
    outputCount: 1,
    time: 2,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 4 },
      { itemId: ITEMS.STONE.id, count: 4 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'storage_mkii',
    outputItemId: ITEMS.STORAGE_MKII.id,
    outputCount: 1,
    time: 4,
    ingredients: [
      { itemId: ITEMS.STEEL.id, count: 8 },
      { itemId: ITEMS.STONE.id, count: 8 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'storage_tank',
    outputItemId: ITEMS.STORAGE_TANK.id,
    outputCount: 1,
    time: 2,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 8 },
      { itemId: ITEMS.STONE.id, count: 4 },
      { itemId: ITEMS.GLASS.id, count: 4 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'planetary_logistics_station',
    outputItemId: ITEMS.PLANETARY_LOGISTICS_STATION.id,
    outputCount: 1,
    time: 20,
    ingredients: [
      { itemId: ITEMS.STEEL.id, count: 40 },
      { itemId: ITEMS.TITANIUM_INGOT.id, count: 40 },
      { itemId: ITEMS.PROCESSOR.id, count: 40 },
      { itemId: ITEMS.PARTICLE_CONTAINER.id, count: 20 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'interstellar_logistics_station',
    outputItemId: ITEMS.INTERSTELLAR_LOGISTICS_STATION.id,
    outputCount: 1,
    time: 30,
    ingredients: [
      { itemId: ITEMS.PLANETARY_LOGISTICS_STATION.id, count: 1 },
      { itemId: ITEMS.TITANIUM_ALLOY.id, count: 40 },
      { itemId: ITEMS.PARTICLE_CONTAINER.id, count: 20 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'logistics_drone',
    outputItemId: ITEMS.LOGISTICS_DRONE.id,
    outputCount: 1,
    time: 4,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 5 },
      { itemId: ITEMS.PROCESSOR.id, count: 2 },
      { itemId: ITEMS.THRUSTER.id, count: 2 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'logistics_vessel',
    outputItemId: ITEMS.LOGISTICS_VESSEL.id,
    outputCount: 1,
    time: 6,
    ingredients: [
      { itemId: ITEMS.TITANIUM_ALLOY.id, count: 10 },
      { itemId: ITEMS.PROCESSOR.id, count: 10 },
      { itemId: ITEMS.REINFORCED_THRUSTER.id, count: 2 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'engine',
    outputItemId: ITEMS.ENGINE.id,
    outputCount: 1,
    time: 2,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 2 },
      { itemId: ITEMS.STEEL.id, count: 2 },
      { itemId: ITEMS.GEAR.id, count: 1 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'gauss_turret',
    outputItemId: ITEMS.GAUSS_TURRET.id,
    outputCount: 1,
    time: 4,
    ingredients: [
      { itemId: ITEMS.IRON_INGOT.id, count: 8 },
      { itemId: ITEMS.GEAR.id, count: 8 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 2 },
      { itemId: ITEMS.MAGNETIC_COIL.id, count: 4 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'missile_turret',
    outputItemId: ITEMS.MISSILE_TURRET.id,
    outputCount: 1,
    time: 6,
    ingredients: [
      { itemId: ITEMS.STEEL.id, count: 8 },
      { itemId: ITEMS.ELECTRIC_MOTOR.id, count: 6 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 12 },
      { itemId: ITEMS.ENGINE.id, count: 6 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'laser_turret',
    outputItemId: ITEMS.LASER_TURRET.id,
    outputCount: 1,
    time: 6,
    ingredients: [
      { itemId: ITEMS.STEEL.id, count: 9 },
      { itemId: ITEMS.PLASMA_EXCITER.id, count: 6 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 6 },
      { itemId: ITEMS.PHOTON_COMBINER.id, count: 9 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'plasma_turret',
    outputItemId: ITEMS.PLASMA_TURRET.id,
    outputCount: 1,
    time: 10,
    ingredients: [
      { itemId: ITEMS.TITANIUM_ALLOY.id, count: 20 },
      { itemId: ITEMS.TITANIUM_GLASS.id, count: 10 },
      { itemId: ITEMS.SUPER_MAGNETIC_RING.id, count: 10 },
      { itemId: ITEMS.PLASMA_EXCITER.id, count: 5 },
      { itemId: ITEMS.PROCESSOR.id, count: 5 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'battlefield_analysis_base',
    outputItemId: ITEMS.BATTLEFIELD_ANALYSIS_BASE.id,
    outputCount: 1,
    time: 6,
    ingredients: [
      { itemId: ITEMS.STEEL.id, count: 12 },
      { itemId: ITEMS.CIRCUIT_BOARD.id, count: 18 },
      { itemId: ITEMS.MICROCRYSTALLINE_COMPONENT.id, count: 6 },
      { itemId: ITEMS.ENGINE.id, count: 12 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'signal_tower',
    outputItemId: ITEMS.SIGNAL_TOWER.id,
    outputCount: 1,
    time: 6,
    ingredients: [
      { itemId: ITEMS.WIRELESS_POWER_TOWER.id, count: 2 },
      { itemId: ITEMS.STEEL.id, count: 12 },
      { itemId: ITEMS.CRYSTAL_SILICON.id, count: 6 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  },
  {
    id: 'planetary_shield_generator',
    outputItemId: ITEMS.PLANETARY_SHIELD_GENERATOR.id,
    outputCount: 1,
    time: 10,
    ingredients: [
      { itemId: ITEMS.STEEL.id, count: 20 },
      { itemId: ITEMS.ELECTROMAGNETIC_TURBINE.id, count: 20 },
      { itemId: ITEMS.SUPER_MAGNETIC_RING.id, count: 5 },
      { itemId: ITEMS.PARTICLE_CONTAINER.id, count: 5 }
    ],
    producedIn: FACILITIES.ASSEMBLER
  }
];
