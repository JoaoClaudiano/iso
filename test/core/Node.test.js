import Node from '../../js/core/Node.js';
import Load from '../../js/core/Load.js';
import Support from '../../js/core/Support.js';

describe('Node', () => {
  test('cria um nó com coordenadas', () => {
    const node = new Node(1, 5, 0);
    expect(node.id).toBe(1);
    expect(node.x).toBe(5);
  });

  test('adiciona carga ao nó', () => {
    const node = new Node(1, 0);
    const load = new Load('point', 10, 2);
    node.addLoad(load);
    expect(node.loads.length).toBe(1);
  });

  test('define apoio no nó', () => {
    const node = new Node(1, 0);
    const support = new Support('pinned');
    node.setSupport(support);
    expect(node.support.type).toBe('pinned');
  });
});