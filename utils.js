/**
 * assets/utils.js
 * Utilitários para gerenciar e carregar assets
 */

/**
 * Caminho base dos assets
 */
export const ASSETS_BASE_PATH = 'assets';

/**
 * Caminhos dos assets organizados por tipo
 */
export const ASSET_PATHS = {
  icons: {
    structures: {
      beam: `${ASSETS_BASE_PATH}/icons/beam.svg`,
      frame: `${ASSETS_BASE_PATH}/icons/frame.svg`,
      grill: `${ASSETS_BASE_PATH}/icons/grill.svg`,
      arc: `${ASSETS_BASE_PATH}/icons/arc.svg`,
    },
    elements: {
      node: `${ASSETS_BASE_PATH}/icons/node.svg`,
      load: `${ASSETS_BASE_PATH}/icons/load.svg`,
      moment: `${ASSETS_BASE_PATH}/icons/moment.svg`,
    },
    supports: {
      fixed: `${ASSETS_BASE_PATH}/icons/support-fixed.svg`,
      pinned: `${ASSETS_BASE_PATH}/icons/support-pinned.svg`,
      roller: `${ASSETS_BASE_PATH}/icons/support-roller.svg`,
    },
  },
  images: {
    screenshot1: `${ASSETS_BASE_PATH}/images/screenshot-1.png`,
    screenshot2: `${ASSETS_BASE_PATH}/images/screenshot-2.png`,
    demo: `${ASSETS_BASE_PATH}/images/demo.gif`,
  },
  fonts: {
    inter: `${ASSETS_BASE_PATH}/fonts/inter.woff2`,
    monaco: `${ASSETS_BASE_PATH}/fonts/monaco.woff2`,
  },
};

/**
 * Cache de assets carregados
 */
const assetCache = new Map();

/**
 * Carrega um asset SVG
 * @param {string} assetPath - Caminho do asset
 * @param {Object} options - Opções de carregamento
 * @returns {Promise<string>} SVG como string
 */
export async function loadSVGAsset(assetPath, options = {}) {
  const {
    cache = true,
    timeout = 5000,
  } = options;

  // Verificar cache
  if (cache && assetCache.has(assetPath)) {
    return assetCache.get(assetPath);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(assetPath, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Falha ao carregar asset: ${response.status}`);
    }

    const svgString = await response.text();

    if (cache) {
      assetCache.set(assetPath, svgString);
    }

    return svgString;
  } catch (error) {
    console.error(`Erro ao carregar asset ${assetPath}:`, error);
    throw error;
  }
}

/**
 * Carrega uma imagem
 * @param {string} imagePath - Caminho da imagem
 * @returns {Promise<HTMLImageElement>}
 */
export async function loadImage(imagePath) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Falha ao carregar imagem: ${imagePath}`));
    img.src = imagePath;
  });
}

/**
 * Cria um elemento SVG a partir de um caminho
 * @param {string} assetPath - Caminho do asset
 * @param {Object} attributes - Atributos do SVG
 * @returns {Promise<SVGElement>}
 */
export async function createSVGElement(assetPath, attributes = {}) {
  const svgString = await loadSVGAsset(assetPath);
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  
  const svg = doc.documentElement;
  
  // Aplicar atributos customizados
  Object.entries(attributes).forEach(([key, value]) => {
    svg.setAttribute(key, value);
  });

  return svg;
}

/**
 * Limpa o cache de assets
 */
export function clearAssetCache() {
  assetCache.clear();
}

/**
 * Obtém informações sobre um asset
 * @param {string} assetPath - Caminho do asset
 * @returns {Object}
 */
export function getAssetInfo(assetPath) {
  const cached = assetCache.has(assetPath);
  
  return {
    path: assetPath,
    type: assetPath.split('.').pop(),
    cached,
    cachedSize: cached ? new Blob([assetCache.get(assetPath)]).size : 0,
  };
}

/**
 * Carrega múltiplos assets em paralelo
 * @param {string[]} assetPaths - Array de caminhos
 * @returns {Promise<Object>}
 */
export async function loadAssets(assetPaths) {
  const promises = assetPaths.map(path => 
    loadSVGAsset(path).catch(err => {
      console.warn(`Falha ao carregar ${path}:`, err);
      return null;
    })
  );

  const results = await Promise.all(promises);
  
  return assetPaths.reduce((acc, path, idx) => {
    acc[path] = results[idx];
    return acc;
  }, {});
}

/**
 * Pré-carrega assets importantes
 * @returns {Promise<void>}
 */
export async function preloadCriticalAssets() {
  const criticalAssets = [
    ASSET_PATHS.icons.structures.beam,
    ASSET_PATHS.icons.structures.frame,
    ASSET_PATHS.icons.elements.node,
    ASSET_PATHS.icons.elements.load,
    ASSET_PATHS.icons.supports.fixed,
    ASSET_PATHS.icons.supports.pinned,
    ASSET_PATHS.icons.supports.roller,
  ];

  try {
    await loadAssets(criticalAssets);
    console.info('Assets críticos pré-carregados com sucesso');
  } catch (error) {
    console.error('Erro ao pré-carregar assets críticos:', error);
  }
}

/**
 * Monitora o status do carregamento de assets
 */
export class AssetLoadingMonitor {
  constructor() {
    this.loading = new Set();
    this.failed = new Set();
    this.loaded = new Set();
  }

  startLoading(assetPath) {
    this.loading.add(assetPath);
  }

  markLoaded(assetPath) {
    this.loading.delete(assetPath);
    this.loaded.add(assetPath);
  }

  markFailed(assetPath) {
    this.loading.delete(assetPath);
    this.failed.add(assetPath);
  }

  getStatus() {
    return {
      loading: this.loading.size,
      loaded: this.loaded.size,
      failed: this.failed.size,
      total: this.loading.size + this.loaded.size + this.failed.size,
      isComplete: this.loading.size === 0,
      failedAssets: Array.from(this.failed),
    };
  }

  reset() {
    this.loading.clear();
    this.failed.clear();
    this.loaded.clear();
  }
}

export default {
  ASSETS_BASE_PATH,
  ASSET_PATHS,
  loadSVGAsset,
  loadImage,
  createSVGElement,
  clearAssetCache,
  getAssetInfo,
  loadAssets,
  preloadCriticalAssets,
  AssetLoadingMonitor,
};
