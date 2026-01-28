import Support from '../../js/core/Support.js';

describe('Support', () => {
  test('cria apoio com reações zeradas', () => {
    const support = new Support('roller');
    expect(support.reactions.y).toBe(0);
  });
});