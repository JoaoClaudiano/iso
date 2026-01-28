import Node from '../../js/core/Node.js';
import Beam from '../../js/core/Beam.js';
import Load from '../../js/core/Load.js';

describe('Beam', () => {
  test('calcula comprimento corretamente', () => {
    const n1 = new Node(1, 0);
    const n2 = new Node(2, 6);
    const beam = new Beam(1, n1, n2);
    expect(beam.length).toBe(6);
  });

  test('adiciona carga à viga', () => {
    const beam = new Beam(1, new Node(1, 0), new Node(2, 5));
    beam.addLoad(new Load('point', 10, 2));
    expect(beam.loads.length).toBe(1);
  });
});