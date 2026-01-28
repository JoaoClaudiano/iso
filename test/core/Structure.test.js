import Structure from '../../js/core/Structure.js';
import Node from '../../js/core/Node.js';
import Beam from '../../js/core/Beam.js';

describe('Structure', () => {
  test('adiciona nós e vigas', () => {
    const s = new Structure();
    s.addNode(new Node(1, 0));
    s.addBeam(new Beam(1, new Node(1, 0), new Node(2, 5)));
    expect(s.nodes.length).toBe(1);
    expect(s.beams.length).toBe(1);
  });
});