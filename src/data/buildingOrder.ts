import { CATEGORIES } from '../types';

export const BUILDING_ORDER: Record<string, string[]> = {
  [CATEGORIES.POWER]: [
    'wind_turbine',
    'solar_panel',
    'thermal_power_plant',
    'mini_fusion_power_plant',
    'geothermal_power_station',
    'artificial_star',
    'tesla_tower',
    'wireless_power_tower',
    'satellite_substation',
    'accumulator',
    'full_accumulator',
    'energy_exchanger'
  ],
  [CATEGORIES.COLLECTION]: [
    'mining_machine',
    'advanced_mining_machine',
    'water_pump',
    'oil_extractor',
    'orbital_collector'
  ],
  [CATEGORIES.LOGISTICS]: [
    'conveyor_belt_mki',
    'conveyor_belt_mkii',
    'conveyor_belt_mkiii',
    'sorter_mki',
    'sorter_mkii',
    'sorter_mkiii',
    'pile_sorter',
    'splitter',
    'automatic_piler',
    'traffic_monitor',
    'spray_coater',
    'holo_beacon'
  ],
  [CATEGORIES.STORAGE]: [
    'storage_mki',
    'storage_mkii',
    'storage_tank'
  ],
  [CATEGORIES.PRODUCTION_BUILDING]: [
    'arc_smelter',
    'plane_smelter',
    'negentropy_smelter',
    'assembling_machine_mki',
    'assembling_machine_mkii',
    'assembling_machine_mkiii',
    're_composing_assembler',
    'oil_refinery',
    'chemical_plant',
    'quantum_chemical_plant',
    'fractionator',
    'miniature_particle_collider'
  ],
  [CATEGORIES.TRANSPORT]: [
    'logistics_distributor',
    'planetary_logistics_station',
    'interstellar_logistics_station'
  ],
  [CATEGORIES.DEFENSE]: [
    'gauss_turret',
    'missile_turret',
    'implosion_cannon',
    'laser_turret',
    'plasma_turret',
    'sr_plasma_turret',
    'jammer_tower',
    'signal_tower',
    'planetary_shield_generator',
    'battlefield_analysis_base'
  ],
  [CATEGORIES.COSMO]: [
    'matrix_lab',
    'self_evolution_lab',
    'em_rail_ejector',
    'ray_receiver',
    'vertical_launching_silo'
  ],
  [CATEGORIES.ENVIRONMENT]: [
    'foundation'
  ]
};
