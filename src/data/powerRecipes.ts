import { PowerRecipe } from '../types';
import { ITEMS } from './items';

export const POWER_RECIPES: PowerRecipe[] = [
  // Wind Turbine
  {
    id: 'wind_turbine',
    facilityId: ITEMS.WIND_TURBINE.id,
    powerGeneration: 300,
    fuelConsumption: 0
  },
  // Solar Panel
  {
    id: 'solar_panel',
    facilityId: ITEMS.SOLAR_PANEL.id,
    powerGeneration: 360,
    fuelConsumption: 0
  },
  // Geothermal Power Station
  {
    id: 'geothermal_power_station',
    facilityId: ITEMS.GEOTHERMAL_POWER_STATION.id,
    powerGeneration: 4800,
    fuelConsumption: 0
  },
  // Thermal Power Plant
  {
    id: 'thermal_coal',
    facilityId: ITEMS.THERMAL_POWER_PLANT.id,
    fuelItemId: ITEMS.COAL.id,
    powerGeneration: 2160,
    fuelConsumption: 1.0
  },
  {
    id: 'thermal_graphite',
    facilityId: ITEMS.THERMAL_POWER_PLANT.id,
    fuelItemId: ITEMS.ENERGETIC_GRAPHITE.id,
    powerGeneration: 2160,
    fuelConsumption: 0.4
  },
  {
    id: 'thermal_hydrogen',
    facilityId: ITEMS.THERMAL_POWER_PLANT.id,
    fuelItemId: ITEMS.HYDROGEN.id,
    powerGeneration: 2160,
    fuelConsumption: 0.3375
  },
  {
    id: 'thermal_refined_oil',
    facilityId: ITEMS.THERMAL_POWER_PLANT.id,
    fuelItemId: ITEMS.REFINED_OIL.id,
    powerGeneration: 2160,
    fuelConsumption: 0.6136
  },
  {
    id: 'thermal_hydrogen_rod',
    facilityId: ITEMS.THERMAL_POWER_PLANT.id,
    fuelItemId: ITEMS.HYDROGEN_FUEL_ROD.id,
    powerGeneration: 2160,
    fuelConsumption: 0.05
  },
  // Mini Fusion Power Plant
  {
    id: 'fusion_deuteron_rod',
    facilityId: ITEMS.MINI_FUSION_POWER_PLANT.id,
    fuelItemId: ITEMS.DEUTERON_FUEL_ROD.id,
    powerGeneration: 15000,
    fuelConsumption: 0.025
  },
  // Artificial Star
  {
    id: 'artificial_star_antimatter_rod',
    facilityId: ITEMS.ARTIFICIAL_STAR.id,
    fuelItemId: ITEMS.ANTIMATTER_FUEL_ROD.id,
    powerGeneration: 72000,
    fuelConsumption: 0.01
  }
];
