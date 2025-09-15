import Econ from '../js/systems/economicCalculations.js';

import { describe, it, expect } from 'vitest';

describe('EconomicCalculations helpers', () => {
  it('computeIndustryResourceConsumption(10) => 2', () => {
    expect(Econ.computeIndustryResourceConsumption(10, {})).toBe(2);
  });

  it('computeEnergyPenalty(50, 100) matches formula', () => {
    const p = Econ.computeEnergyPenalty(50, 100);
    const expected = 1 - ((100 - 50) / Math.max(100,1)) * 0.6;
    expect(p).toBeCloseTo(expected, 6);
  });

  it('computeConsumerGoodsIndex returns expected value for sample', () => {
    const idx = Econ.computeConsumerGoodsIndex({ IndustrialEfficiency: 50 }, { Graos:100, Combustivel:100, EnergiaDisponivel:0 });
    expect(idx).toBe(85);
  });
});
