/**

- @fileoverview Constantes globais da aplicação
  */

const Constants = {
// ============================================
// ESTRUTURAS
// ============================================
STRUCTURE_TYPES: {
BEAM: ‘beam’,
FRAME: ‘frame’,
GRILL: ‘grill’,
ARCH: ‘arch’
},

STRUCTURE_NAMES: {
beam: ‘Viga Isostática’,
frame: ‘Pórtico Plano’,
grill: ‘Grelha Isostática’,
arch: ‘Arco Isostático’
},

// ============================================
// APOIOS
// ============================================
SUPPORT_TYPES: {
FREE: ‘free’,
ROLLER: ‘roller’,
PINNED: ‘pinned’,
FIXED: ‘fixed’
},

SUPPORT_NAMES: {
free: ‘Livre’,
roller: ‘Apoio Móvel’,
pinned: ‘Apoio Articulado’,
fixed: ‘Engastado’
},

SUPPORT_SYMBOLS: {
free: ‘○’,
roller: ‘⊕’,
pinned: ‘⊙’,
fixed: ‘■’
},

SUPPORT_DESCRIPTIONS: {
free: ‘Sem restrições - Permite movimento livre’,
roller: ‘Restringe um eixo - Permite deslizamento’,
pinned: ‘Restringe dois eixos - Permite rotação’,
fixed: ‘Restringe todos os eixos - Totalmente fixo’
},

// ============================================
// CARGAS
// ============================================
LOAD_TYPES: {
POINT: ‘point’,
DISTRIBUTED: ‘distributed’,
MOMENT: ‘moment’
},

LOAD_NAMES: {
point: ‘Carga Pontual’,
distributed: ‘Carga Distribuída’,
moment: ‘Momento’
},

// ============================================
// MATERIAIS
// ============================================
MATERIALS: {
steel: {
name: ‘Aço’,
E: 210000, // GPa
G: 81000, // GPa
density: 7850, // kg/m³
fy: 250 // MPa (tensão de escoamento)
},
concrete: {
name: ‘Concreto’,
E: 30000, // GPa
G: 12000, // GPa
density: 2400, // kg/m³
fc: 30 // MPa (resistência à compressão)
},
wood: {
name: ‘Madeira’,
E: 12000, // MPa (pinus)
G: 600, // MPa
density: 600, // kg/m³
fb: 12 // MPa (resistência à flexão)
},
aluminum: {
name: ‘Alumínio’,
E: 70000, // MPa
G: 27000, // MPa
density: 2700, // kg/m³
fy: 275 // MPa
}
},

// ============================================
// ESFORÇOS INTERNOS
// ============================================
FORCE_TYPES: {
NORMAL: ‘N’,
SHEAR: ‘V’,
MOMENT: ‘M’,
TORSION: ‘T’
},

FORCE_NAMES: {
N: ‘Esforço Normal’,
V: ‘Esforço Cortante’,
M: ‘Momento Fletor’,
T: ‘Torção’
},

FORCE_UNITS: {
N: ‘kN’,
V: ‘kN’,
M: ‘kN·m’,
T: ‘kN·m’
},

// ============================================
// CORES
// ============================================
COLORS: {
primary: ‘#2196F3’,
primaryDark: ‘#1976D2’,
primaryLight: ‘#BBDEFB’,
secondary: ‘#FF9800’,
secondaryDark: ‘#F57C00’,
success: ‘#4CAF50’,
danger: ‘#F44336’,
warning: ‘#FFC107’,
info: ‘#2196F3’,

```
// Elementos estruturais
beam: '#000000',
node: '#2196F3',
support: '#F44336',
load: '#4CAF50',
moment: '#FF9800',

// Diagramas
diagramN: '#00BCD4', // Azul claro
diagramV: '#2196F3', // Azul
diagramM: '#FF5722', // Laranja
diagramT: '#9C27B0', // Roxo

// Background
background: '#FAFAFA',
surface: '#FFFFFF',
border: '#E0E0E0',
text: '#212121',
textSecondary: '#757575'
```

},

// ============================================
// CANVAS E VISUALIZAÇÃO
// ============================================
CANVAS: {
gridSize: 50, // pixels
nodeRadius: 6, // pixels
beamWidth: 3, // pixels
supportSize: 12, // pixels
arrowHeadLength: 15, // pixels
arrowHeadAngle: Math.PI / 6, // radianos
selectionRadius: 8, // pixels
minZoom: 0.5,
maxZoom: 5,
zoomStep: 0.1
},

// ============================================
// TOLERÂNCIAS NUMÉRICAS
// ============================================
TOLERANCE: {
position: 0.01, // metros
force: 1e-6, // kN
moment: 1e-6, // kN·m
displacement: 1e-6, // metros
angle: 1e-8 // radianos
},

// ============================================
// UNIDADES
// ============================================
UNITS: {
length: ‘m’,
force: ‘kN’,
moment: ‘kN·m’,
stress: ‘MPa’,
displacement: ‘mm’,
angle: ‘°’
},

// ============================================
// NÚMEROS DE SEÇÕES
// ============================================
ANALYSIS: {
numSections: 100, // Número de seções para calcular esforços
maxIterations: 1000, // Iterações máximas para solver iterativo
convergenceTolerance: 1e-8
},

// ============================================
// MENSAGENS
// ============================================
MESSAGES: {
SUCCESS: ‘Sucesso!’,
ERROR: ‘Erro!’,
WARNING: ‘Aviso!’,
INFO: ‘Informação’,
SAVED: ‘Estrutura salva!’,
CLEARED: ‘Estrutura limpa!’,
ANALYZED: ‘Estrutura analisada com sucesso!’,
INVALID_STRUCTURE: ‘Estrutura inválida para análise’,
ADDED: ‘Adicionado com sucesso!’,
REMOVED: ‘Removido com sucesso!’,
UPDATED: ‘Atualizado com sucesso!’
},

// ============================================
// CONFIGURAÇÕES DE EXEMPLO
// ============================================
EXAMPLES: {
‘beam-point’: {
name: ‘Viga com Carga Pontual’,
description: ‘Viga biapoiada com carga concentrada no meio’,
type: ‘beam’
},
‘beam-distributed’: {
name: ‘Viga com Carga Distribuída’,
description: ‘Viga em balanço com carga uniformemente distribuída’,
type: ‘beam’
},
‘frame-simple’: {
name: ‘Pórtico Simples’,
description: ‘Pórtico plano retangular com carga horizontal’,
type: ‘frame’
},
‘grill-square’: {
name: ‘Grelha Quadrada’,
description: ‘Grelha quadrada com carga vertical centralizada’,
type: ‘grill’
},
‘arch-simple’: {
name: ‘Arco Simples’,
description: ‘Arco parabólico com carga distribuída’,
type: ‘arch’
}
},

// ============================================
// CONFIGURAÇÕES DE ESCALA
// ============================================
SCALE_PRESETS: {
1: { label: ‘1:1’, value: 1 },
10: { label: ‘1:10’, value: 10 },
50: { label: ‘1:50’, value: 50 },
100: { label: ‘1:100’, value: 100 },
200: { label: ‘1:200’, value: 200 },
500: { label: ‘1:500’, value: 500 }
},

// ============================================
// CONFIGURAÇÕES DE ANIMAÇÃO
// ============================================
ANIMATION: {
duration: 300, // ms
easing: ‘ease-in-out’
},

// ============================================
// TECLAS DE ATALHO
// ============================================
SHORTCUTS: {
CALCULATE: ‘Enter’,
CLEAR: ‘Delete’,
UNDO: ‘Ctrl+Z’,
REDO: ‘Ctrl+Y’,
SAVE: ‘Ctrl+S’,
LOAD: ‘Ctrl+O’,
EXPORT: ‘Ctrl+E’,
SELECT_ALL: ‘Ctrl+A’,
DESELECT: ‘Escape’
},

// ============================================
// LIMITES
// ============================================
LIMITS: {
maxNodes: 1000,
maxBeams: 5000,
maxLoads: 10000,
maxSupports: 1000,
maxCanvasWidth: 4000,
maxCanvasHeight: 3000
}
}

// Exportar para uso global
if (typeof module !== ‘undefined’ && module.exports) {
module.exports = Constants
}