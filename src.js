# Isostática Lab - Arquitetura JavaScript Completa

## 📁 Estrutura de Arquivos

```
isoestatica-lab/
├── src/
│   ├── core/
│   │   ├── Node.js              # Classe de nó estrutural
│   │   ├── Beam.js              # Classe de barra/elemento
│   │   ├── Load.js              # Classe de carga
│   │   ├── Support.js           # Classe de apoio
│   │   └── Structure.js         # Classe da estrutura
│   ├── analysis/
│   │   ├── Solver.js            # Solver de equações lineares
│   │   ├── BeamAnalyzer.js      # Análise de vigas
│   │   ├── FrameAnalyzer.js     # Análise de pórticos
│   │   ├── GrillAnalyzer.js     # Análise de grelhas
│   │   └── ArcAnalyzer.js       # Análise de arcos
│   ├── visualization/
│   │   ├── CanvasRenderer.js    # Renderizador principal
│   │   ├── DiagramDrawer.js     # Desenho de diagramas
│   │   └── Legend.js            # Sistema de legendas
│   ├── ui/
│   │   ├── UIManager.js         # Gerenciador de UI
│   │   ├── ToolPanel.js         # Painel de ferramentas
│   │   └── ResultsPanel.js      # Painel de resultados
│   ├── utils/
│   │   ├── Constants.js         # Constantes da aplicação
│   │   ├── Math.js              # Funções matemáticas
│   │   ├── Export.js            # Exportação de dados
│   │   └── Validation.js        # Validação de dados
│   └── app.js                   # Aplicação principal
├── css/
│   ├── main.css                 # Estilos principais
│   ├── components.css           # Componentes
│   └── responsive.css           # Media queries
├── tests/
│   ├── core/
│   ├── analysis/
│   └── utils/
├── docs/
│   ├── README.md                # Documentação
│   ├── INSTALLATION.md          # Instalação
│   ├── USER_GUIDE.md            # Guia do usuário
│   ├── API.md                   # Documentação da API
│   └── CONTRIBUTING.md          # Guia de contribuição
├── examples/
│   ├── beam-point.json          # Viga com carga pontual
│   ├── beam-distributed.json    # Viga com carga distribuída
│   ├── frame-simple.json        # Pórtico simples
│   └── grill-square.json        # Grelha quadrada
├── .eslintrc.json               # Configuração ESLint
├── .prettierrc                  # Configuração Prettier
├── package.json                 # Dependências
├── .gitignore                   # Arquivos ignorados
└── index.html                   # Página principal
```

-----

## 📚 Descrição dos Módulos JavaScript

### **CORE (Núcleo da Estrutura)**

#### `Node.js`

```javascript
class Node {
  constructor(id, x, y)
  setSupport(type)
  getPosition()
  isSupported()
  getDegreesOfFreedom()
  // Properties: id, x, y, support, reactions, displacements
}
```

#### `Beam.js`

```javascript
class Beam {
  constructor(id, startNode, endNode)
  getLength()
  getAngle()
  addLoad(load)
  getLoadsAt(position)
  // Properties: id, startNode, endNode, loads, internalForces, properties
}
```

#### `Load.js`

```javascript
class Load {
  constructor(type, magnitude, position, direction)
  getComponents()
  // Types: 'point', 'distributed', 'moment'
}
```

#### `Support.js`

```javascript
class Support {
  constructor(node, type)
  getRestrictions()
  // Types: 'pinned', 'roller', 'fixed'
}
```

#### `Structure.js`

```javascript
class Structure {
  constructor(type)
  addNode(x, y)
  addBeam(startNodeId, endNodeId)
  addSupport(nodeId, type)
  addLoad(beamId, load)
  getStaticDeterminacy()
  isStaticallyDeterminate()
  clear()
  // Types: 'beam', 'frame', 'grill', 'arch'
}
```

### **ANALYSIS (Análise Estrutural)**

#### `Solver.js`

```javascript
class Solver {
  // Métodos de resolução:
  solveGaussJordan(matrix, vector)
  solveLU(matrix, vector)
  invertMatrix(matrix)
  getDeterminant(matrix)
  // Álgebra linear para estruturas
}
```

#### `BeamAnalyzer.js`

```javascript
class BeamAnalyzer {
  analyze(structure)
  calculateReactions()
  calculateInternalForces()
  getShearDiagram()
  getMomentDiagram()
  getNormalDiagram()
}
```

#### `FrameAnalyzer.js`

```javascript
class FrameAnalyzer {
  analyze(structure)
  buildStiffnessMatrix()
  applyBoundaryConditions()
  solveDisplacements()
  calculateInternalForces()
}
```

#### `GrillAnalyzer.js`

```javascript
class GrillAnalyzer {
  analyze(structure)
  calculateBending()
  calculateTorsion()
}
```

#### `ArcAnalyzer.js`

```javascript
class ArcAnalyzer {
  analyze(structure)
  calculatePressureLine()
  validateArcGeometry()
}
```

### **VISUALIZATION (Visualização)**

#### `CanvasRenderer.js`

```javascript
class CanvasRenderer {
  constructor(canvas, structure)
  render()
  drawBeams()
  drawNodes()
  drawSupports()
  drawLoads()
  drawDiagrams()
  worldToScreen(x, y)
  screenToWorld(x, y)
  setScale(scale)
  // Renderiza a estrutura e resultados
}
```

#### `DiagramDrawer.js`

```javascript
class DiagramDrawer {
  constructor(renderer)
  drawNormalDiagram(beam)
  drawShearDiagram(beam)
  drawMomentDiagram(beam)
  drawTorsionDiagram(beam)
  drawDeformedShape(structure)
  // Desenha diagramas de esforços
}
```

#### `Legend.js`

```javascript
class Legend {
  constructor(renderer)
  draw(x, y, type)
  getScale()
  setScale(scale)
}
```

### **UI (Interface de Usuário)**

#### `UIManager.js`

```javascript
class UIManager {
  constructor(app)
  setupEventListeners()
  updateStructureInfo()
  showResults(results)
  showTutorial()
  showError(message)
  // Gerencia toda a UI
}
```

#### `ToolPanel.js`

```javascript
class ToolPanel {
  constructor(ui)
  setActiveTool(tool)
  setupToolButtons()
  // Painel de ferramentas
}
```

#### `ResultsPanel.js`

```javascript
class ResultsPanel {
  constructor(ui)
  displayReactions(reactions)
  displayInternalForces(forces)
  displayExtremes(extremes)
  displayEquations(equations)
  // Painel de resultados
}
```

### **UTILS (Utilitários)**

#### `Constants.js`

```javascript
// Constantes da aplicação
const MATERIALS = {
  steel: { E: 210000, density: 7850 },
  concrete: { E: 30000, density: 2400 },
  wood: { E: 12000, density: 600 }
}

const SUPPORT_TYPES = ['free', 'roller', 'pinned', 'fixed']
const LOAD_TYPES = ['point', 'distributed', 'moment']
const STRUCTURE_TYPES = ['beam', 'frame', 'grill', 'arch']

const UI_COLORS = {
  beam: '#000000',
  support: '#F44336',
  load: '#4CAF50',
  moment: '#FF9800'
}
```

#### `Math.js`

```javascript
// Funções matemáticas
function distance(p1, p2)
function angle(p1, p2)
function rotate(point, angle, origin)
function getLineIntersection(line1, line2)
function solveQuadratic(a, b, c)
function trapezoidalIntegration(values, dx)
function numericalDerivative(values, dx)
```

#### `Export.js`

```javascript
class Exporter {
  exportJSON(structure, results)
  exportPDF(structure, results)
  exportCSV(results)
  exportImage(canvas)
}
```

#### `Validation.js`

```javascript
class Validator {
  validateStructure(structure)
  validateLoads(loads)
  validateSupports(supports)
  validateBeamProperties(beam)
}
```

### **APP (Aplicação Principal)**

#### `app.js`

```javascript
class IsostatikaApp {
  constructor()
  init()
  setupUI()
  setupCanvas()
  attachEventListeners()
  
  // Métodos de modelo
  addNode(x, y)
  addBeam(startId, endId)
  addSupport(nodeId, type)
  addLoad(beamId, load)
  deleteElement(id, type)
  
  // Métodos de análise
  analyze()
  clearResults()
  
  // Métodos de UI
  onToolChanged(tool)
  onCanvasMouseDown(e)
  onCanvasMouseMove(e)
  onCanvasMouseUp(e)
  
  // Métodos de exemplos
  loadExample(exampleName)
  loadExamples()
  
  // Métodos de exportação
  exportResults()
  importStructure()
}

// Instância global
const app = new IsostatikaApp()
```

-----

## 🔧 Exemplo de Uso

```javascript
// 1. Criar estrutura
const structure = new Structure('beam')

// 2. Adicionar nós
const n0 = structure.addNode(0, 0)
const n1 = structure.addNode(5, 0)
const n2 = structure.addNode(10, 0)

// 3. Adicionar barras
structure.addBeam(0, 1)
structure.addBeam(1, 2)

// 4. Adicionar apoios
structure.addSupport(0, 'pinned')
structure.addSupport(2, 'roller')

// 5. Adicionar cargas
const load = new Load('point', 10, 2.5, -90)
structure.beams[0].addLoad(load)

// 6. Analisar
const analyzer = new StructuralAnalyzer(structure)
const results = analyzer.analyze()

// 7. Visualizar
const renderer = new CanvasRenderer(canvas, structure)
renderer.render()

// 8. Exibir resultados
console.log('Reações:', results.reactions)
console.log('Esforços:', results.internalForces)
```

-----

## 📊 Fluxo de Dados

```
┌─────────────────┐
│  User Input     │
│  (Canvas Click) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  UIManager      │
│  (Event Handler)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Structure      │
│  (Data Model)   │
└────────┬────────┘
         │
    ┌────┴─────────────────────┐
    │                          │
    ▼                          ▼
┌─────────────────┐   ┌─────────────────┐
│ CanvasRenderer  │   │  Analyzer       │
│ (Visualization) │   │ (Calculations)  │
└────────┬────────┘   └────────┬────────┘
         │                     │
         └──────────┬──────────┘
                    │
                    ▼
            ┌─────────────────┐
            │  Results Panel  │
            │ (Display Output)│
            └─────────────────┘
```

-----

## 🧪 Testes (Jest)

```javascript
// tests/core/Beam.test.js
describe('Beam', () => {
  test('calculate length correctly', () => {
    const n1 = new Node(0, 0, 0)
    const n2 = new Node(1, 3, 4)
    const beam = new Beam(0, n1, n2)
    expect(beam.getLength()).toBe(5)
  })
})

// tests/analysis/BeamAnalyzer.test.js
describe('BeamAnalyzer', () => {
  test('analyze simple beam', () => {
    // Setup structure
    // Analyze
    // Assert results
  })
})
```

-----

## 📝 package.json

```json
{
  "name": "isoestatica-lab",
  "version": "1.0.0",
  "description": "Laboratório Virtual de Análise de Estruturas Isostáticas",
  "main": "js/app.js",
  "scripts": {
    "start": "http-server . -p 8000",
    "lint": "eslint js/",
    "format": "prettier --write js/ css/",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "build": "echo 'Compilation not required for vanilla JS'",
    "docs": "jsdoc -c jsdoc.json"
  },
  "keywords": ["estructuras", "engenharia", "educacional"],
  "author": "João Claudiano",
  "license": "MIT",
  "devDependencies": {
    "eslint": "^8.0.0",
    "prettier": "^2.8.0",
    "jest": "^29.0.0",
    "jsdoc": "^4.0.0",
    "http-server": "^14.1.0"
  }
}
```

-----

## 🚀 Próximos Passos

1. ✅ Implementar cada classe do módulo `core/`
1. ✅ Implementar analisadores em `analysis/`
1. ✅ Criar renderizador em `visualization/`
1. ✅ Desenvolver UI em `ui/`
1. ✅ Adicionar testes para cada módulo
1. ✅ Criar exemplos
1. ✅ Documentar API
1. ✅ Deploy no GitHub Pages

-----

Esta arquitetura fornece uma base sólida, escalável e profissional para o projeto.
