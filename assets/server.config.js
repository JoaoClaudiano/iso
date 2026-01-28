/**
 * assets/server.config.js
 * Configuração de servidor de desenvolvimento para assets
 * 
 * Uso:
 * npm run dev
 */

export const serverConfig = {
  // Configuração geral do servidor
  host: 'localhost',
  port: 8080,
  https: false,

  // Configuração de assets
  assets: {
    // Diretório base dos assets
    baseDir: 'assets',
    
    // Rota pública dos assets
    publicPath: '/assets',
    
    // Tipos MIME customizados
    mimeTypes: {
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.woff2': 'font/woff2',
      '.woff': 'font/woff',
    },

    // Compressão
    compression: {
      enabled: true,
      level: 6, // 1-9
      types: [
        'text/svg+xml',
        'image/svg+xml',
        'text/javascript',
        'application/javascript',
      ],
    },

    // Cache
    cache: {
      enabled: true,
      maxAge: 3600000, // 1 hora em ms
      eTag: true,
    },

    // CORS
    cors: {
      enabled: true,
      origin: '*',
      methods: ['GET', 'HEAD', 'OPTIONS'],
    },

    // Headers customizados
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },

  // Watcher para reload automático
  watch: {
    enabled: true,
    dirs: [
      'assets/icons',
      'assets/images',
      'assets/fonts',
      'js',
      'css',
      'index.html',
    ],
    debounce: 300, // ms
  },

  // Hot Module Replacement (HMR)
  hmr: {
    enabled: true,
    protocol: 'ws',
    host: 'localhost',
    port: 8081,
  },

  // Logging
  logging: {
    level: 'info', // 'debug', 'info', 'warn', 'error'
    format: 'combined', // 'combined', 'simple'
    directory: 'logs',
  },

  // Desenvolvimento
  development: {
    sourceMap: true,
    openBrowser: true,
    showErrorOverlay: true,
  },

  // Produção
  production: {
    sourceMap: false,
    minify: true,
    uglify: true,
  },
};

/**
 * Middleware de assets
 */
export const assetMiddleware = {
  // Serving de assets estáticos
  static: {
    paths: [
      { path: '/assets', dir: './assets' },
      { path: '/public', dir: './public' },
    ],
    index: false,
  },

  // Compressão Gzip
  gzip: {
    enabled: true,
    threshold: 1024, // bytes
  },

  // ETag para cache
  etag: {
    enabled: true,
    algorithm: 'md5',
  },

  // Fallback para index.html (SPA)
  spa: {
    enabled: true,
    index: 'index.html',
    disableDotfiles: false,
  },
};

/**
 * Configuração de build para assets
 */
export const buildConfig = {
  // Entrada e saída
  input: 'assets',
  output: 'dist/assets',

  // Otimizações
  optimization: {
    minify: true,
    sourceMaps: true,
    removeComments: true,
    removeDuplicates: true,
  },

  // Pré-processamento
  preprocessing: {
    svgo: {
      enabled: true,
      config: {
        plugins: [
          { name: 'removeComments' },
          { name: 'removeEmptyContainers' },
          { name: 'convertPathData', params: { floatg: 2 } },
        ],
      },
    },

    imagemin: {
      enabled: true,
      plugins: [
        {
          name: 'imagemin-mozjpeg',
          options: { quality: 80 },
        },
        {
          name: 'imagemin-pngquant',
          options: { quality: [0.6, 0.8] },
        },
        {
          name: 'imagemin-webp',
          options: { quality: 75 },
        },
      ],
    },

    fontmin: {
      enabled: true,
      subsets: ['latin', 'latin-ext'],
    },
  },

  // Inlining
  inlining: {
    enabled: true,
    svgThreshold: 5120, // 5KB
    imageThreshold: 10240, // 10KB
  },

  // Hashing para cache-busting
  hashing: {
    enabled: true,
    algorithm: 'md5',
    length: 8,
  },
};

/**
 * Configuração de performance
 */
export const performanceConfig = {
  // Monitoramento de tamanho de bundle
  budgets: {
    type: 'bundle', // 'bundle' ou 'delta'
    bundles: [
      {
        name: 'main',
        maxSize: '500kb',
      },
      {
        name: 'assets',
        maxSize: '200kb',
      },
    ],
  },

  // Métricas de performance
  metrics: {
    enabled: true,
    track: [
      'LCP', // Largest Contentful Paint
      'FID', // First Input Delay
      'CLS', // Cumulative Layout Shift
      'TTFB', // Time To First Byte
    ],
  },

  // Lazy loading
  lazyLoading: {
    enabled: true,
    strategy: 'intersection-observer',
    threshold: 0.1,
  },
};

export default {
  serverConfig,
  assetMiddleware,
  buildConfig,
  performanceConfig,
};
