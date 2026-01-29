import Node from '../../js/core/Node.js';
import Beam from '../../js/core/Beam.js';
import Load from '../../js/core/Load.js';
import BeamAnalyzer from '../../js/analysis/BeamAnalyzer.js';

test('calcula reações em viga biapoiada com carga central', () => {
  const n1 = new Node(1, 0);
  const n2 = new Node(2, 6);
  const beam = new Beam(1, n1, n2);
  beam.addLoad(new Load('point', 12, 3));

  const analyzer = new BeamAnalyzer(beam);
  const { RA, RB } = analyzer.analyze();

  expect(RA).toBeCloseTo(6);
  expect(RB).toBeCloseTo(6);
});