/**
 * assets/__tests__/utils.test.js
 * Testes para funções de carregamento e gerenciamento de assets
 */

import {
  ASSET_PATHS,
  loadSVGAsset,
  createSVGElement,
  loadImage,
  clearAssetCache,
  getAssetInfo,
  loadAssets,
  AssetLoadingMonitor,
} from '../utils.js';

describe('Asset Utils', () => {
  // ========================================================================
  // TESTES: loadSVGAsset
  // ========================================================================

  describe('loadSVGAsset', () => {
    beforeEach(() => {
      clearAssetCache();
    });

    test('deve carregar um SVG com sucesso', async () => {
      const svg = await loadSVGAsset(ASSET_PATHS.icons.structures.beam);
      expect(svg).toBeTruthy();
      expect(svg).toContain('<svg');
    });

    test('deve usar cache na segunda chamada', async () => {
      const assetPath = ASSET_PATHS.icons.structures.beam;
      
      // Primeira chamada
      const svg1 = await loadSVGAsset(assetPath, { cache: true });
      
      // Segunda chamada (deve usar cache)
      const svg2 = await loadSVGAsset(assetPath, { cache: true });
      
      expect(svg1).toBe(svg2);
    });

    test('deve permitir desabilitar cache', async () => {
      const assetPath = ASSET_PATHS.icons.structures.frame;
      
      const svg1 = await loadSVGAsset(assetPath, { cache: false });
      const svg2 = await loadSVGAsset(assetPath, { cache: false });
      
      // Não devem ser a mesma instância
      expect(svg1).toEqual(svg2);
    });

    test('deve rejeitar com erro se fetch falhar', async () => {
      const invalidPath = 'invalid/path/icon.svg';
      
      await expect(loadSVGAsset(invalidPath))
        .rejects
        .toThrow();
    });

    test('deve respeitar timeout', async () => {
      const assetPath = ASSET_PATHS.icons.elements.node;
      
      // Carregamento rápido deve suceder
      const svg = await loadSVGAsset(assetPath, { timeout: 10000 });
      expect(svg).toBeTruthy();
    });
  });

  // ========================================================================
  // TESTES: createSVGElement
  // ========================================================================

  describe('createSVGElement', () => {
    beforeEach(() => {
      clearAssetCache();
    });

    test('deve criar elemento SVG válido', async () => {
      const svg = await createSVGElement(ASSET_PATHS.icons.elements.node);
      
      expect(svg).toBeTruthy();
      expect(svg.tagName.toLowerCase()).toBe('svg');
    });

    test('deve aplicar atributos customizados', async () => {
      const svg = await createSVGElement(
        ASSET_PATHS.icons.elements.load,
        {
          width: '48',
          height: '48',
          class: 'custom-icon',
          'data-test': 'value',
        }
      );

      expect(svg.getAttribute('width')).toBe('48');
      expect(svg.getAttribute('height')).toBe('48');
      expect(svg.getAttribute('class')).toBe('custom-icon');
      expect(svg.getAttribute('data-test')).toBe('value');
    });

    test('deve criar elemento sem atributos opcionais', async () => {
      const svg = await createSVGElement(
        ASSET_PATHS.icons.elements.moment
      );

      expect(svg).toBeTruthy();
      expect(svg.tagName.toLowerCase()).toBe('svg');
    });
  });

  // ========================================================================
  // TESTES: clearAssetCache
  // ========================================================================

  describe('clearAssetCache', () => {
    test('deve limpar o cache', async () => {
      const assetPath = ASSET_PATHS.icons.structures.grill;
      
      // Carregar e cachear
      await loadSVGAsset(assetPath);
      let info = getAssetInfo(assetPath);
      expect(info.cached).toBe(true);

      // Limpar cache
      clearAssetCache();
      info = getAssetInfo(assetPath);
      expect(info.cached).toBe(false);
    });

    test('deve permitir recarregar após limpar cache', async () => {
      const assetPath = ASSET_PATHS.icons.structures.arc;

      // Primeira carga
      const svg1 = await loadSVGAsset(assetPath);
      
      // Limpar
      clearAssetCache();
      
      // Segunda carga (não deve usar cache)
      const svg2 = await loadSVGAsset(assetPath);
      
      expect(svg1).toEqual(svg2);
    });
  });

  // ========================================================================
  // TESTES: getAssetInfo
  // ========================================================================

  describe('getAssetInfo', () => {
    beforeEach(() => {
      clearAssetCache();
    });

    test('deve retornar informações sobre um asset não-cacheado', () => {
      const assetPath = ASSET_PATHS.icons.elements.node;
      const info = getAssetInfo(assetPath);

      expect(info).toHaveProperty('path');
      expect(info).toHaveProperty('type');
      expect(info).toHaveProperty('cached');
      expect(info).toHaveProperty('cachedSize');
      expect(info.cached).toBe(false);
      expect(info.type).toBe('svg');
    });

    test('deve retornar informações sobre um asset cacheado', async () => {
      const assetPath = ASSET_PATHS.icons.elements.load;
      
      // Cachear o asset
      await loadSVGAsset(assetPath);
      
      const info = getAssetInfo(assetPath);
      expect(info.cached).toBe(true);
      expect(info.cachedSize).toBeGreaterThan(0);
    });
  });

  // ========================================================================
  // TESTES: loadAssets
  // ========================================================================

  describe('loadAssets', () => {
    beforeEach(() => {
      clearAssetCache();
    });

    test('deve carregar múltiplos assets em paralelo', async () => {
      const paths = [
        ASSET_PATHS.icons.structures.beam,
        ASSET_PATHS.icons.structures.frame,
        ASSET_PATHS.icons.elements.node,
      ];

      const results = await loadAssets(paths);

      expect(Object.keys(results)).toHaveLength(3);
      paths.forEach(path => {
        expect(results[path]).toBeTruthy();
      });
    });

    test('deve retornar null para assets que falharem', async () => {
      const paths = [
        ASSET_PATHS.icons.structures.beam,
        'invalid/path.svg',
      ];

      const results = await loadAssets(paths);

      expect(results[paths[0]]).toBeTruthy();
      expect(results[paths[1]]).toBeNull();
    });

    test('deve usar chaves de caminho corretas', async () => {
      const paths = [
        ASSET_PATHS.icons.structures.frame,
        ASSET_PATHS.icons.elements.moment,
      ];

      const results = await loadAssets(paths);

      expect(results).toHaveProperty(paths[0]);
      expect(results).toHaveProperty(paths[1]);
    });
  });

  // ========================================================================
  // TESTES: AssetLoadingMonitor
  // ========================================================================

  describe('AssetLoadingMonitor', () => {
    test('deve inicializar vazio', () => {
      const monitor = new AssetLoadingMonitor();
      const status = monitor.getStatus();

      expect(status.loading).toBe(0);
      expect(status.loaded).toBe(0);
      expect(status.failed).toBe(0);
      expect(status.isComplete).toBe(true);
    });

    test('deve rastrear assets em carregamento', () => {
      const monitor = new AssetLoadingMonitor();
      const path = 'assets/icons/beam.svg';

      monitor.startLoading(path);
      let status = monitor.getStatus();
      expect(status.loading).toBe(1);
      expect(status.isComplete).toBe(false);

      monitor.markLoaded(path);
      status = monitor.getStatus();
      expect(status.loading).toBe(0);
      expect(status.loaded).toBe(1);
      expect(status.isComplete).toBe(true);
    });

    test('deve rastrear assets que falharam', () => {
      const monitor = new AssetLoadingMonitor();
      const path = 'assets/icons/invalid.svg';

      monitor.startLoading(path);
      monitor.markFailed(path);
      
      const status = monitor.getStatus();
      expect(status.failed).toBe(1);
      expect(status.failedAssets).toContain(path);
    });

    test('deve resetar estado', () => {
      const monitor = new AssetLoadingMonitor();

      monitor.startLoading('path1');
      monitor.markLoaded('path1');
      monitor.startLoading('path2');
      monitor.markFailed('path2');

      let status = monitor.getStatus();
      expect(status.total).toBe(2);

      monitor.reset();
      status = monitor.getStatus();
      expect(status.loading).toBe(0);
      expect(status.loaded).toBe(0);
      expect(status.failed).toBe(0);
    });

    test('deve calcular total corretamente', () => {
      const monitor = new AssetLoadingMonitor();

      monitor.startLoading('path1');
      monitor.startLoading('path2');
      monitor.markLoaded('path1');
      monitor.startLoading('path3');
      monitor.markFailed('path3');

      const status = monitor.getStatus();
      expect(status.total).toBe(3);
      expect(status.loading).toBe(1);
      expect(status.loaded).toBe(1);
      expect(status.failed).toBe(1);
    });
  });

  // ========================================================================
  // TESTES: ASSET_PATHS
  // ========================================================================

  describe('ASSET_PATHS', () => {
    test('deve ter estrutura correta', () => {
      expect(ASSET_PATHS).toHaveProperty('icons');
      expect(ASSET_PATHS).toHaveProperty('images');
      expect(ASSET_PATHS).toHaveProperty('fonts');
    });

    test('deve ter todos os ícones de estrutura', () => {
      const icons = ASSET_PATHS.icons.structures;
      expect(icons).toHaveProperty('beam');
      expect(icons).toHaveProperty('frame');
      expect(icons).toHaveProperty('grill');
      expect(icons).toHaveProperty('arc');
    });

    test('deve ter todos os ícones de elementos', () => {
      const icons = ASSET_PATHS.icons.elements;
      expect(icons).toHaveProperty('node');
      expect(icons).toHaveProperty('load');
      expect(icons).toHaveProperty('moment');
    });

    test('deve ter todos os ícones de apoios', () => {
      const icons = ASSET_PATHS.icons.supports;
      expect(icons).toHaveProperty('fixed');
      expect(icons).toHaveProperty('pinned');
      expect(icons).toHaveProperty('roller');
    });

    test('caminhos devem ser strings válidas', () => {
      Object.values(ASSET_PATHS).forEach(category => {
        Object.values(category).forEach(paths => {
          Object.values(paths).forEach(path => {
            expect(typeof path).toBe('string');
            expect(path.length).toBeGreaterThan(0);
          });
        });
      });
    });
  });

  // ========================================================================
  // TESTES: Integração
  // ========================================================================

  describe('Integração', () => {
    beforeEach(() => {
      clearAssetCache();
    });

    test('deve carregar e cacheear um asset completo', async () => {
      const path = ASSET_PATHS.icons.structures.beam;

      // Primeira carga
      const start1 = performance.now();
      const svg1 = await loadSVGAsset(path);
      const time1 = performance.now() - start1;

      // Segunda carga (do cache)
      const start2 = performance.now();
      const svg2 = await loadSVGAsset(path);
      const time2 = performance.now() - start2;

      expect(svg1).toBe(svg2);
      expect(time2).toBeLessThan(time1); // Cache deve ser mais rápido
    });

    test('deve gerenciar múltiplos assets com monitor', async () => {
      const monitor = new AssetLoadingMonitor();
      const paths = [
        ASSET_PATHS.icons.structures.beam,
        ASSET_PATHS.icons.structures.frame,
        ASSET_PATHS.icons.elements.node,
      ];

      // Simular carregamento
      paths.forEach(path => monitor.startLoading(path));
      expect(monitor.getStatus().loading).toBe(3);

      // Marcar como carregados
      paths.slice(0, 2).forEach(path => monitor.markLoaded(path));
      monitor.markFailed(paths[2]);

      const status = monitor.getStatus();
      expect(status.loaded).toBe(2);
      expect(status.failed).toBe(1);
      expect(status.isComplete).toBe(true);
    });
  });
});

export default {
  // Testes automaticamente descobertos pelo Jest
};
