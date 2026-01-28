/**
 * assets/build.config.js
 * Configuração de build e otimização de assets
 * 
 * Uso:
 * npm run build:assets
 */

export const assetConfig = {
  // Configuração de SVG
  svg: {
    plugins: [
      {
        name: 'removeComments',
      },
      {
        name: 'removeEmptyContainers',
      },
      {
        name: 'cleanupEnableBackground',
      },
      {
        name: 'convertStyleToAttrs',
      },
      {
        name: 'convertPathData',
        params: {
          floatg: 2,
        },
      },
      {
        name: 'removeUselessDefs',
      },
      {
        name: 'removeUselessStrokeAndFill',
      },
      {
        name: 'removeViewBox',
        active: false, // manter viewBox
      },
      {
        name: 'cleanupEnableBackground',
      },
    ],
  },

  // Configuração de imagens
  images: {
    formats: ['webp', 'png', 'jpg'],
    optimization: {
      png: {
        quality: 85,
        oxipng: true,
      },
      jpg: {
        quality: 80,
        progressive: true,
      },
      webp: {
        quality: 80,
      },
    },
  },

  // Configuração de fontes
  fonts: {
    formats: ['woff2', 'woff'],
    subsets: ['latin', 'latin-ext'],
  },

  // Configuração geral
  output: 'dist/assets',
  minify: true,
  sourceMap: false,
  cacheBusting: true,
  
  // Verificação de integridade
  integrity: {
    enabled: true,
    algorithm: 'sha384',
  },

  // Limites de tamanho
  limits: {
    svg: 50 * 1024, // 50KB
    image: 500 * 1024, // 500KB
    font: 200 * 1024, // 200KB
  },
};

/**
 * Mapa de assets para pré-carregamento
 */
export const preloadMap = {
  critical: [
    'icons/beam.svg',
    'icons/frame.svg',
    'icons/grill.svg',
    'icons/arc.svg',
    'icons/node.svg',
    'icons/load.svg',
    'icons/support-fixed.svg',
    'icons/support-pinned.svg',
    'icons/support-roller.svg',
    'icons/moment.svg',
  ],
  deferred: [
    'images/screenshot-1.png',
    'images/screenshot-2.png',
    'images/demo.gif',
  ],
};

/**
 * Configuração de inline (incorporar no HTML)
 */
export const inlineConfig = {
  enabled: true,
  maxSize: 5 * 1024, // 5KB
  
  // Assets que devem ser inlinados
  includes: [
    'icons/*.svg',
  ],
  
  // Assets que NÃO devem ser inlinados
  excludes: [
    'images/*.png',
    'images/*.jpg',
    'fonts/*.woff2',
  ],
};

/**
 * Configuração de hash para cache-busting
 */
export const hashConfig = {
  enabled: true,
  length: 8,
  exclude: ['fonts/'],
};

/**
 * Relatório de assets
 */
export const reportConfig = {
  enabled: true,
  format: 'json', // 'json', 'html', 'both'
  output: 'dist/assets-report.json',
  include: {
    size: true,
    hash: true,
    format: true,
    cached: true,
  },
};

export default assetConfig;
