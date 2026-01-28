import Load from '../../js/core/Load.js';

describe('Load', () => {
  test('cria carga pontual', () => {
    const load = new Load('point', 10, 3);
    expect(load.type).toBe('point');
    expect(load.value).toBe(10);
  });

  test('cria carga distribuída', () => {
    const load = new Load('distributed', 5, null, 0, 4);
    expect(load.start).toBe(0);
    expect(load.end).toBe(4);
  });
});