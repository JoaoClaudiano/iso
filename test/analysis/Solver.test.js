import { solveLinearSystem } from '../../js/analysis/Solver.js';

test('resolve sistema linear simples', () => {
  const A = [[2, 1], [1, -1]];
  const b = [3, 0];
  const x = solveLinearSystem(A, b);
  expect(x[0]).toBeCloseTo(1);
  expect(x[1]).toBeCloseTo(1);
});