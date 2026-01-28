/**

- @class Structure
- @description Classe principal que representa uma estrutura completa
  */
  class Structure {
  /**
  - Cria uma nova estrutura
  - @param {string} type - Tipo: ‘beam’, ‘frame’, ‘grill’, ‘arch’
    */
    constructor(type = ‘beam’) {
    const validTypes = [‘beam’, ‘frame’, ‘grill’, ‘arch’]
    if (!validTypes.includes(type)) {
    throw new Error(`Tipo de estrutura inválido: ${type}`)
    }
  
  this.type = type
  this.nodes = []
  this.beams = []
  this.supports = []
  this.loads = []
  
  this.nodeIdCounter = 0
  this.beamIdCounter = 0
  
  this.isAnalyzed = false
  this.results = null
  this.analysisTime = 0
  }

// ============================================
// GERENCIAMENTO DE NÓS
// ============================================

/**

- Adiciona um nó à estrutura
- @param {number} x - Coordenada X
- @param {number} y - Coordenada Y
- @returns {Node}
  */
  addNode(x, y) {
  const node = new Node(this.nodeIdCounter++, x, y)
  this.nodes.push(node)
  return node
  }

/**

- Remove um nó da estrutura
- @param {number} nodeId
- @returns {boolean}
  */
  removeNode(nodeId) {
  const index = this.nodes.findIndex((n) => n.id === nodeId)
  if (index === -1) return false

```
const node = this.nodes[index]

// Remover barras conectadas
this.beams = this.beams.filter(
  (b) => b.startNode.id !== nodeId && b.endNode.id !== nodeId
)

// Remover apoios
this.supports = this.supports.filter((s) => s.node.id !== nodeId)

// Remover nó
this.nodes.splice(index, 1)
return true
```

}

/**

- Obtém um nó por ID
- @param {number} nodeId
- @returns {Node|null}
  */
  getNode(nodeId) {
  return this.nodes.find((n) => n.id === nodeId) || null
  }

/**

- Obtém todos os nós
- @returns {Array<Node>}
  */
  getNodes() {
  return […this.nodes]
  }

/**

- Obtém nós apoiados (que têm suportes)
- @returns {Array<Node>}
  */
  getSupportedNodes() {
  return this.nodes.filter((n) => n.isSupported())
  }

/**

- Obtém o número de nós
- @returns {number}
  */
  getNodeCount() {
  return this.nodes.length
  }

// ============================================
// GERENCIAMENTO DE BARRAS
// ============================================

/**

- Adiciona uma barra entre dois nós
- @param {number} startNodeId
- @param {number} endNodeId
- @returns {Beam}
  */
  addBeam(startNodeId, endNodeId) {
  if (startNodeId === endNodeId) {
  throw new Error(‘Uma barra deve conectar dois nós diferentes’)
  }

```
const startNode = this.getNode(startNodeId)
const endNode = this.getNode(endNodeId)

if (!startNode || !endNode) {
  throw new Error('Um ou ambos os nós não existem')
}

const beam = new Beam(this.beamIdCounter++, startNode, endNode)
this.beams.push(beam)
return beam
```

}

/**

- Remove uma barra
- @param {number} beamId
- @returns {boolean}
  */
  removeBeam(beamId) {
  const index = this.beams.findIndex((b) => b.id === beamId)
  if (index === -1) return false

```
const beam = this.beams[index]
// Remover cargas da barra
beam.clearLoads()

this.beams.splice(index, 1)
return true
```

}

/**

- Obtém uma barra por ID
- @param {number} beamId
- @returns {Beam|null}
  */
  getBeam(beamId) {
  return this.beams.find((b) => b.id === beamId) || null
  }

/**

- Obtém todas as barras
- @returns {Array<Beam>}
  */
  getBeams() {
  return […this.beams]
  }

/**

- Obtém barras conectadas a um nó
- @param {number} nodeId
- @returns {Array<Beam>}
  */
  getConnectedBeams(nodeId) {
  return this.beams.filter(
  (b) => b.startNode.id === nodeId || b.endNode.id === nodeId
  )
  }

/**

- Obtém o número de barras
- @returns {number}
  */
  getBeamCount() {
  return this.beams.length
  }

// ============================================
// GERENCIAMENTO DE APOIOS
// ============================================

/**

- Adiciona um apoio em um nó
- @param {number} nodeId
- @param {string} type - Tipo de apoio
- @returns {Support}
  */
  addSupport(nodeId, type) {
  const node = this.getNode(nodeId)
  if (!node) {
  throw new Error(‘Nó não encontrado’)
  }

```
// Remover apoio anterior se existir
this.supports = this.supports.filter((s) => s.node.id !== nodeId)

node.setSupport(type)
const support = new Support(node, type)
this.supports.push(support)
return support
```

}

/**

- Remove um apoio
- @param {number} nodeId
- @returns {boolean}
  */
  removeSupport(nodeId) {
  const index = this.supports.findIndex((s) => s.node.id === nodeId)
  if (index === -1) return false

```
const node = this.getNode(nodeId)
if (node) {
  node.setSupport('free')
}

this.supports.splice(index, 1)
return true
```

}

/**

- Obtém um apoio por ID do nó
- @param {number} nodeId
- @returns {Support|null}
  */
  getSupport(nodeId) {
  return this.supports.find((s) => s.node.id === nodeId) || null
  }

/**

- Obtém todos os apoios
- @returns {Array<Support>}
  */
  getSupports() {
  return […this.supports]
  }

/**

- Obtém o número de apoios
- @returns {number}
  */
  getSupportCount() {
  return this.supports.length
  }

// ============================================
// GERENCIAMENTO DE CARGAS
// ============================================

/**

- Adiciona uma carga a uma barra
- @param {number} beamId
- @param {Load} load
- @returns {Load}
  */
  addLoad(beamId, load) {
  const beam = this.getBeam(beamId)
  if (!beam) {
  throw new Error(‘Barra não encontrada’)
  }

```
const errors = load.validate()
if (errors.length > 0) {
  throw new Error('Carga inválida: ' + errors.join(', '))
}

beam.addLoad(load)
this.loads.push(load)
return load
```

}

/**

- Remove uma carga de uma barra
- @param {number} beamId
- @param {number} loadIndex
- @returns {boolean}
  */
  removeLoad(beamId, loadIndex) {
  const beam = this.getBeam(beamId)
  if (!beam) return false

```
const load = beam.loads[loadIndex]
if (!load) return false

beam.removeLoad(loadIndex)

const globalIndex = this.loads.indexOf(load)
if (globalIndex !== -1) {
  this.loads.splice(globalIndex, 1)
}

return true
```

}

/**

- Obtém todas as cargas
- @returns {Array<Load>}
  */
  getLoads() {
  return […this.loads]
  }

/**

- Obtém o número de cargas
- @returns {number}
  */
  getLoadCount() {
  return this.loads.length
  }

/**

- Obtém cargas em uma barra
- @param {number} beamId
- @returns {Array<Load>}
  */
  getBeamLoads(beamId) {
  const beam = this.getBeam(beamId)
  return beam ? beam.getLoads() : []
  }

// ============================================
// ANÁLISE DE ESTATICIDADE
// ============================================

/**

- Calcula o grau de estaticidade da estrutura
- Fórmula: g = r - 3 (vigas)
- Fórmula: g = r - 3n (pórticos e grelhas)
- @returns {number}
  */
  getStaticDeterminacy() {
  const numReactions = this.supports.reduce((sum, sup) => {
  return sum + sup.getNumberOfRestrictions()
  }, 0)

```
if (this.type === 'beam') {
  // Viga: g = r - 3
  return numReactions - 3
} else {
  // Pórtico/Grelha: g = r - 3n
  const numNodes = this.nodes.length
  return numReactions - 3 * numNodes
}
```

}

/**

- Verifica se a estrutura é isostática
- @returns {boolean}
  */
  isStaticallyDeterminate() {
  return this.getStaticDeterminacy() === 0
  }

/**

- Verifica se a estrutura é hiperstática
- @returns {boolean}
  */
  isHyperstatic() {
  return this.getStaticDeterminacy() > 0
  }

/**

- Verifica se a estrutura é hipostática
- @returns {boolean}
  */
  isHypostatic() {
  return this.getStaticDeterminacy() < 0
  }

/**

- Obtém informações sobre a estaticidade
- @returns {Object}
  */
  getStaticityInfo() {
  const degree = this.getStaticDeterminacy()
  let status = ‘’

```
if (degree === 0) {
  status = 'Isostática'
} else if (degree > 0) {
  status = `Hiperstática (${degree}x)`
} else {
  status = `Hipostática (${Math.abs(degree)}x)`
}

return {
  degree,
  status,
  isIsostatic: this.isStaticallyDeterminate(),
  isHyperstatic: this.isHyperstatic(),
  isHypostatic: this.isHypostatic()
}
```

}

/**

- Verifica se a estrutura é válida para análise
- @returns {Object} {valid, errors}
  */
  validate() {
  const errors = []

```
if (this.nodes.length < 2) {
  errors.push('Estrutura deve ter no mínimo 2 nós')
}

if (this.beams.length < 1) {
  errors.push('Estrutura deve ter no mínimo 1 barra')
}

if (this.supports.length === 0) {
  errors.push('Estrutura deve ter no mínimo 1 apoio')
}

if (!this.isStaticallyDeterminate()) {
  errors.push(this.getStaticityInfo().status)
}

// Verificar se há nós soltos
const connectedNodes = new Set()
this.beams.forEach((beam) => {
  connectedNodes.add(beam.startNode.id)
  connectedNodes.add(beam.endNode.id)
})

this.nodes.forEach((node) => {
  if (!connectedNodes.has(node.id)) {
    errors.push(`Nó ${node.id} não está conectado`)
  }
})

return {
  valid: errors.length === 0,
  errors
}
```

}

// ============================================
// LIMPEZA E RESET
// ============================================

/**

- Limpa toda a estrutura
  */
  clear() {
  this.nodes = []
  this.beams = []
  this.supports = []
  this.loads = []
  this.nodeIdCounter = 0
  this.beamIdCounter = 0
  this.isAnalyzed = false
  this.results = null
  }

/**

- Limpa apenas os resultados da análise
  */
  clearResults() {
  this.isAnalyzed = false
  this.results = null
  this.nodes.forEach((n) => n.clearAnalysisResults())
  this.beams.forEach((b) => b.clearInternalForces())
  this.supports.forEach((s) => s.clearReactions())
  }

// ============================================
// EXPORTAÇÃO E IMPORTAÇÃO
// ============================================

/**

- Exporta a estrutura como JSON
- @returns {Object}
  */
  toJSON() {
  return {
  type: this.type,
  nodes: this.nodes.map((n) => n.toJSON()),
  beams: this.beams.map((b) => ({
  id: b.id,
  startNode: b.startNode.id,
  endNode: b.endNode.id,
  loads: b.loads.map((l) => l.toJSON()),
  properties: b.properties
  })),
  supports: this.supports.map((s) => ({
  nodeId: s.node.id,
  type: s.type
  }))
  }
  }

/**

- Importa uma estrutura de um objeto JSON
- @static
- @param {Object} data
- @returns {Structure}
  */
  static fromJSON(data) {
  const structure = new Structure(data.type)

```
// Importar nós
const nodeMap = {}
data.nodes.forEach((nodeData) => {
  const node = structure.addNode(nodeData.x, nodeData.y)
  nodeMap[nodeData.id] = node.id
})

// Importar barras
data.beams.forEach((beamData) => {
  const startId = nodeMap[beamData.startNode]
  const endId = nodeMap[beamData.endNode]
  const beam = structure.addBeam(startId, endId)

  if (beamData.properties) {
    beam.setProperties(beamData.properties)
  }

  if (beamData.loads) {
    beamData.loads.forEach((loadData) => {
      const load = Load.fromJSON(loadData)
      beam.addLoad(load)
      structure.loads.push(load)
    })
  }
})

// Importar apoios
data.supports.forEach((supportData) => {
  const nodeId = nodeMap[supportData.nodeId]
  structure.addSupport(nodeId, supportData.type)
})

return structure
```

}

/**

- Clona a estrutura
- @returns {Structure}
  */
  clone() {
  return Structure.fromJSON(this.toJSON())
  }

// ============================================
// INFORMAÇÕES E RESUMO
// ============================================

/**

- Obtém um resumo da estrutura
- @returns {Object}
  */
  getSummary() {
  return {
  type: this.type,
  nodeCount: this.nodes.length,
  beamCount: this.beams.length,
  supportCount: this.supports.length,
  loadCount: this.loads.length,
  staticDeterminacy: this.getStaticDeterminacy(),
  isStaticallyDeterminate: this.isStaticallyDeterminate(),
  isAnalyzed: this.isAnalyzed,
  analysisTime: this.analysisTime
  }
  }

/**

- Retorna informações da estrutura como string
- @returns {string}
  */
  toString() {
  return (
  `Structure (${this.type}) - ` +
  `Nodes: ${this.nodes.length}, ` +
  `Beams: ${this.beams.length}, ` +
  `Supports: ${this.supports.length}, ` +
  `Loads: ${this.loads.length}`
  )
  }
  }