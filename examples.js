/**
 * assets/examples.js
 * Exemplos de como carregar e usar assets na aplicação
 */

import {
  ASSET_PATHS,
  loadSVGAsset,
  createSVGElement,
  loadImage,
  preloadCriticalAssets,
  AssetLoadingMonitor,
} from './utils.js';

// ============================================================================
// EXEMPLO 1: Carregando um ícone SVG simples
// ============================================================================

/**
 * Carrega um ícone SVG e o adiciona ao DOM
 */
async function example1_LoadSimpleSVG() {
  try {
    // Carregando ícone de viga
    const svgString = await loadSVGAsset(ASSET_PATHS.icons.structures.beam);
    
    // Criando um container
    const container = document.getElementById('icon-container');
    container.innerHTML = svgString;
    
    console.log('✓ Ícone carregado com sucesso');
  } catch (error) {
    console.error('✗ Erro ao carregar ícone:', error);
  }
}

// ============================================================================
// EXEMPLO 2: Criando elemento SVG com atributos personalizados
// ============================================================================

/**
 * Cria um elemento SVG e aplica atributos customizados
 */
async function example2_CreateSVGElement() {
  try {
    const nodeIcon = await createSVGElement(
      ASSET_PATHS.icons.elements.node,
      {
        width: '64',
        height: '64',
        class: 'node-icon',
        'data-id': 'node-1',
      }
    );

    // Aplicando estilos
    nodeIcon.style.cursor = 'pointer';
    nodeIcon.style.transition = 'all 0.3s ease';

    // Adicionando ao DOM
    document.body.appendChild(nodeIcon);

    // Adicionando listeners
    nodeIcon.addEventListener('mouseenter', () => {
      nodeIcon.style.filter = 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))';
    });

    nodeIcon.addEventListener('mouseleave', () => {
      nodeIcon.style.filter = 'drop-shadow(0 0 0px)';
    });

    console.log('✓ Elemento SVG criado com sucesso');
  } catch (error) {
    console.error('✗ Erro ao criar elemento:', error);
  }
}

// ============================================================================
// EXEMPLO 3: Carregando múltiplos ícones em paralelo
// ============================================================================

/**
 * Carrega todos os ícones de estrutura de uma vez
 */
async function example3_LoadMultipleIcons() {
  try {
    const structures = [
      { name: 'Viga', path: ASSET_PATHS.icons.structures.beam },
      { name: 'Pórtico', path: ASSET_PATHS.icons.structures.frame },
      { name: 'Grelha', path: ASSET_PATHS.icons.structures.grill },
      { name: 'Arco', path: ASSET_PATHS.icons.structures.arc },
    ];

    // Carregando em paralelo
    const promises = structures.map(s => loadSVGAsset(s.path));
    const results = await Promise.all(promises);

    // Criando UI com os ícones
    const container = document.getElementById('structure-buttons');
    structures.forEach((s, idx) => {
      const button = document.createElement('button');
      button.innerHTML = results[idx];
      button.title = s.name;
      button.className = 'structure-btn';
      container.appendChild(button);
    });

    console.log('✓ Ícones carregados em paralelo');
  } catch (error) {
    console.error('✗ Erro ao carregar ícones:', error);
  }
}

// ============================================================================
// EXEMPLO 4: Criando uma barra de ferramentas com ícones
// ============================================================================

/**
 * Cria uma barra de ferramentas com ícones dinamicamente
 */
async function example4_CreateToolbar() {
  const tools = [
    { id: 'add-node', label: 'Adicionar Nó', icon: 'node' },
    { id: 'add-load', label: 'Adicionar Carga', icon: 'load' },
    { id: 'add-moment', label: 'Adicionar Momento', icon: 'moment' },
  ];

  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';
  toolbar.id = 'main-toolbar';

  for (const tool of tools) {
    try {
      const button = document.createElement('button');
      button.id = tool.id;
      button.className = 'toolbar-btn';
      button.title = tool.label;

      // Carregando ícone
      const iconPath = ASSET_PATHS.icons.elements[tool.icon];
      const svgString = await loadSVGAsset(iconPath);
      
      button.innerHTML = svgString;
      button.addEventListener('click', () => {
        console.log(`Clicou em: ${tool.label}`);
      });

      toolbar.appendChild(button);
    } catch (error) {
      console.error(`Erro ao carregar ícone ${tool.icon}:`, error);
    }
  }

  document.body.appendChild(toolbar);
  console.log('✓ Toolbar criada com sucesso');
}

// ============================================================================
// EXEMPLO 5: Pré-carregamento de assets críticos
// ============================================================================

/**
 * Pré-carrega assets críticos na inicialização
 */
async function example5_PreloadAssets() {
  const monitor = new AssetLoadingMonitor();

  try {
    // Inicia o pré-carregamento
    const preloadPromise = preloadCriticalAssets();
    
    // Monitora o progresso
    const checkInterval = setInterval(() => {
      const status = monitor.getStatus();
      console.log(`Assets carregados: ${status.loaded}/${status.total}`);
      
      if (status.isComplete) {
        clearInterval(checkInterval);
        console.log('✓ Todos os assets foram pré-carregados');
      }
    }, 100);

    await preloadPromise;
  } catch (error) {
    console.error('✗ Erro ao pré-carregar assets:', error);
  }
}

// ============================================================================
// EXEMPLO 6: Usando assets em CSS
// ============================================================================

/**
 * Exemplo de como usar assets em CSS (inline style)
 */
function example6_AssetsInCSS() {
  // Criando elementos com background SVG
  const button = document.createElement('button');
  button.className = 'svg-bg-button';
  button.textContent = 'Viga';
  
  // Usando CSS inline
  button.style.backgroundImage = `url('${ASSET_PATHS.icons.structures.beam}')`;
  button.style.backgroundSize = '20px 20px';
  button.style.backgroundRepeat = 'no-repeat';
  button.style.backgroundPosition = 'left 10px center';
  button.style.paddingLeft = '40px';

  document.body.appendChild(button);
  console.log('✓ Assets aplicados via CSS');
}

// ============================================================================
// EXEMPLO 7: Carregando imagens rasterizadas
// ============================================================================

/**
 * Carrega imagens PNG/JPG
 */
async function example7_LoadRasterImages() {
  try {
    const screenshot1 = await loadImage(ASSET_PATHS.images.screenshot1);
    const screenshot2 = await loadImage(ASSET_PATHS.images.screenshot2);

    const gallery = document.createElement('div');
    gallery.className = 'gallery';

    [screenshot1, screenshot2].forEach(img => {
      img.className = 'gallery-image';
      img.style.maxWidth = '400px';
      img.style.margin = '10px';
      gallery.appendChild(img);
    });

    document.body.appendChild(gallery);
    console.log('✓ Imagens carregadas com sucesso');
  } catch (error) {
    console.error('✗ Erro ao carregar imagens:', error);
  }
}

// ============================================================================
// EXEMPLO 8: Gerenciar apoios dinamicamente
// ============================================================================

/**
 * Cria controles para diferentes tipos de apoio
 */
async function example8_SupportControls() {
  const supports = [
    { type: 'fixed', label: 'Engastado', icon: 'fixed' },
    { type: 'pinned', label: 'Articulado', icon: 'pinned' },
    { type: 'roller', label: 'Móvel', icon: 'roller' },
  ];

  const supportPanel = document.createElement('div');
  supportPanel.className = 'support-panel';
  supportPanel.innerHTML = '<h3>Tipos de Apoio</h3>';

  for (const support of supports) {
    try {
      const div = document.createElement('div');
      div.className = 'support-option';

      const label = document.createElement('label');
      label.textContent = support.label;

      const iconPath = ASSET_PATHS.icons.supports[support.icon];
      const svgString = await loadSVGAsset(iconPath);

      div.innerHTML = svgString + label.outerHTML;
      div.style.cursor = 'pointer';
      div.addEventListener('click', () => {
        console.log(`Selecionado: ${support.label}`);
      });

      supportPanel.appendChild(div);
    } catch (error) {
      console.error(`Erro ao carregar apoio ${support.type}:`, error);
    }
  }

  document.body.appendChild(supportPanel);
  console.log('✓ Painel de apoios criado');
}

// ============================================================================
// EXEMPLO 9: Animação com SVG
// ============================================================================

/**
 * Cria animação com ícones SVG
 */
async function example9_SVGAnimation() {
  try {
    const loadIcon = await createSVGElement(ASSET_PATHS.icons.elements.load);
    
    loadIcon.style.width = '100px';
    loadIcon.style.height = '100px';
    loadIcon.style.animation = 'spin 2s linear infinite';

    // Adicionar estilo de animação
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(loadIcon);
    console.log('✓ Animação criada');
  } catch (error) {
    console.error('✗ Erro ao criar animação:', error);
  }
}

// ============================================================================
// EXEMPLO 10: Inicialização completa da aplicação
// ============================================================================

/**
 * Inicializa a aplicação com pré-carregamento e setup de assets
 */
async function example10_AppInitialization() {
  console.log('🚀 Inicializando aplicação...');

  try {
    // 1. Pré-carregar assets críticos
    console.log('📦 Pré-carregando assets...');
    await preloadCriticalAssets();

    // 2. Criar toolbar
    console.log('🛠️ Criando toolbar...');
    await example4_CreateToolbar();

    // 3. Criar painel de apoios
    console.log('📐 Criando painel de apoios...');
    await example8_SupportControls();

    // 4. Carregar imagens
    console.log('🖼️ Carregando imagens...');
    await example7_LoadRasterImages();

    console.log('✅ Aplicação inicializada com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante inicialização:', error);
  }
}

// ============================================================================
// EXPORTAR EXEMPLOS
// ============================================================================

export {
  example1_LoadSimpleSVG,
  example2_CreateSVGElement,
  example3_LoadMultipleIcons,
  example4_CreateToolbar,
  example5_PreloadAssets,
  example6_AssetsInCSS,
  example7_LoadRasterImages,
  example8_SupportControls,
  example9_SVGAnimation,
  example10_AppInitialization,
};

// Para usar no console do navegador:
// window.assetExamples = { example1_LoadSimpleSVG, ... }
