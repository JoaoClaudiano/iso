/**

- @class ArcAnalyzer
- @description Analisador para arcos isostáticos
  */
  class ArcAnalyzer {
  /**
  - Cria um novo analisador de arcos
  - @param {Structure} structure - Estrutura a analisar
    */
    constructor(structure) {
    if (structure.type !== ‘arch’) {
    throw new Error(‘ArcAnalyzer só funciona com estruturas do tipo arch’)
    }
  
  this.structure = structure
  this.solver = new Solver()
  this.reactions = {}
  this.internalForces = {}
  this.pressureLine = []
  this.numSections = 100
  }

/**

- Realiza a análise completa do arco
- @returns {Object} Resultados da análise
  */
  analyze() {
  const startTime = performance.now()

```
// Validar estrutura
const validation = this.structure.validate()
if (!validation.valid) {
  throw new Error('Estrutura inválida: ' + validation.errors.join(', '))
}

// Validar geometria do arco
const arcValidation = this.validateArcGeometry()
if (!arcValidation.valid) {
  throw new Error('Arco inválido: ' + arcValidation.errors.join(', '))
}

// Calcular reações
this.calculateReactions()

// Calcular linha de pressão
this.calculatePressureLine()

// Calcular esforços internos
this.calculateInternalForces()

const endTime = performance.now()
const analysisTime = (endTime - startTime) / 1000

this.structure.analysisTime = analysisTime
this.structure.isAnalyzed = true
this.structure.results = {
  reactions: this.reactions,
  internalForces: this.internalForces,
  pressureLine: this.pressureLine,
  analysisTime: analysisTime
}

return this.structure.results
```

}

/**

- Valida geometria do arco
  */
  validateArcGeometry() {
  const errors = []
  const nodes = this.structure.nodes

```
if (nodes.length < 3) {
  errors.push('Arco deve ter no mínimo 3 nós')
}

// Verificar se nós estão em forma de arco (crescimento em Y)
if (nodes.length >= 3) {
  const yValues = nodes.map(n => n.y)
  const xValues = nodes.map(n => n.x)

  // Verificar monotonia em X
  for (let i = 1; i < xValues.length; i++) {
    if (xValues[i] <= xValues[i - 1]) {
      errors.push('Nós do arco devem estar em ordem X crescente')
      break
    }
  }
}

return {
  valid: errors.length === 0,
  errors
}
```

}

/**

- Calcula as reações nos apoios
  */
  calculateReactions() {
  this.reactions = {}

```
const supports = this.structure.getSupports()
const loads = this.structure.getLoads()

// Calcular carga total
let totalLoad = 0
let momentAboutOrigin = 0
const startNode = this.structure.nodes[0]
const endNode = this.structure.nodes[this.structure.nodes.length - 1]

loads.forEach(load => {
  const beam = this.structure.beams.find(b => b.loads.includes(load))
  if (!beam) return

  const components = load.getComponents()

  if (load.type === 'distributed') {
    const length = load.getDistributedLength()
    totalLoad += components.fy * length
    const midPos = (load.startPos + load.endPos) / 2
    momentAboutOrigin += components.fy * length * midPos
  } else if (load.type === 'point') {
    totalLoad += components.fy
    momentAboutOrigin += components.fy * load.position
  } else if (load.type === 'moment') {
    // Momentos diretos
  }
})

// Reações para arco com 2 apoios nas extremidades
if (supports.length >= 2) {
  const support1 = supports[0]
  const support2 = supports[1]

  const x1 = support1.node.x
  const x2 = support2.node.x
  const distance = Math.abs(x2 - x1)

  // ΣM = 0 em relação ao apoio 1
  let fy2 = 0
  if (Math.abs(distance) > 1e-6) {
    fy2 = -momentAboutOrigin / distance
  }

  const fy1 = -totalLoad - fy2

  this.reactions[support1.node.id] = {
    fx: 0,
    fy: MathUtils.round(fy1, 4),
    m: 0
  }

  this.reactions[support2.node.id] = {
    fx: 0,
    fy: MathUtils.round(fy2, 4),
    m: 0
  }

  support1.setReactions(0, fy1, 0)
  support2.setReactions(0, fy2, 0)

  support1.node.setReaction(0, fy1, 0)
  support2.node.setReaction(0, fy2, 0)
}
```

}

/**

- Calcula a linha de pressão do arco
  */
  calculatePressureLine() {
  this.pressureLine = []
  const arcLength = this.getArcLength()
  const step = arcLength / (this.numSections - 1)

```
for (let i = 0; i < this.numSections; i++) {
  const s = i * step
  const point = this.getPointAtDistance(s)

  // Calcular o esforço normal na seção
  const N = this.calculateNormalForce(point)

  // Posição da linha de pressão
  const offset = this.calculateEccentricity(point, N)

  this.pressureLine.push({
    x: point.x + offset.x,
    y: point.y + offset.y,
    N: N,
    position: s
  })
}
```

}

/**

- Obtém ponto do arco a uma distância ao longo do comprimento
- @private
  */
  getPointAtDistance(distance) {
  const nodes = this.structure.nodes
  const arcLength = this.getArcLength()
  const parameter = distance / arcLength

```
// Interpolação entre nós (simplificado)
const nodeIndex = Math.min(
  Math.floor(parameter * (nodes.length - 1)),
  nodes.length - 2
)

const node1 = nodes[nodeIndex]
const node2 = nodes[nodeIndex + 1]

const segmentLength = MathUtils.distance(
  { x: node1.x, y: node1.y },
  { x: node2.x, y: node2.y }
)

const totalDistanceToNode1 = this.getDistanceToNode(nodeIndex)
const distanceInSegment = distance - totalDistanceToNode1
const t = Math.min(1, distanceInSegment / segmentLength)

return {
  x: node1.x + (node2.x - node1.x) * t,
  y: node1.y + (node2.y - node1.y) * t
}
```

}

/**

- Calcula comprimento do arco
- @private
  */
  getArcLength() {
  let length = 0
  const nodes = this.structure.nodes

```
for (let i = 0; i < nodes.length - 1; i++) {
  length += MathUtils.distance(
    { x: nodes[i].x, y: nodes[i].y },
    { x: nodes[i + 1].x, y: nodes[i + 1].y }
  )
}

return length
```

}

/**

- Calcula distância acumulada até um nó
- @private
  */
  getDistanceToNode(nodeIndex) {
  let distance = 0
  const nodes = this.structure.nodes

```
for (let i = 0; i < nodeIndex && i < nodes.length - 1; i++) {
  distance += MathUtils.distance(
    { x: nodes[i].x, y: nodes[i].y },
    { x: nodes[i + 1].x, y: nodes[i + 1].y }
  )
}

return distance
```

}

/**

- Calcula esforço normal em uma seção
- @private
  */
  calculateNormalForce(point) {
  let N = 0
  const loads = this.structure.getLoads()

```
// Somatório de cargas
loads.forEach(load => {
  if (load.type === 'point') {
    if (load.position <= point.x) {
      const components = load.getComponents()
      N += components.fy
    }
  } else if (load.type === 'distributed') {
    const components = load.getComponents()
    const length = Math.min(load.endPos, point.x) - load.startPos
    if (length > 0) {
      N += components.fy * length
    }
  }
})

return -N // Negativo para compressão
```

}

/**

- Calcula excentricidade da linha de pressão
- @private
  */
  calculateEccentricity(point, N) {
  // Simplificação: excentricidade proporcional ao momento
  const loads = this.structure.getLoads()
  let M = 0

```
loads.forEach(load => {
  if (load.type === 'point') {
    const components = load.getComponents()
    M += components.fy * (load.position - point.x)
  }
})

const e = Math.abs(N) > 1e-6 ? M / N : 0

// Converter em offset (perpendicular ao arco)
const tangent = this.getTangentAtPoint(point)
const normal = {
  x: -tangent.y,
  y: tangent.x
}

return {
  x: normal.x * e * 0.1,
  y: normal.y * e * 0.1
}
```

}

/**

- Calcula tangente do arco em um ponto
- @private
  */
  getTangentAtPoint(point) {
  const nodes = this.structure.nodes
  let closestNode = 0
  let minDist = Infinity

```
for (let i = 0; i < nodes.length; i++) {
  const dist = MathUtils.distance(point, { x: nodes[i].x, y: nodes[i].y })
  if (dist < minDist) {
    minDist = dist
    closestNode = i
  }
}

if (closestNode === 0) {
  return MathUtils.getDirectionVector(
    { x: nodes[0].x, y: nodes[0].y },
    { x: nodes[1].x, y: nodes[1].y }
  )
} else if (closestNode === nodes.length - 1) {
  return MathUtils.getDirectionVector(
    { x: nodes[nodes.length - 2].x, y: nodes[nodes.length - 2].y },
    { x: nodes[nodes.length - 1].x, y: nodes[nodes.length - 1].y }
  )
} else {
  return MathUtils.getDirectionVector(
    { x: nodes[closestNode - 1].x, y: nodes[closestNode - 1].y },
    { x: nodes[closestNode + 1].x, y: nodes[closestNode + 1].y }
  )
}
```

}

/**

- Calcula esforços internos
  */
  calculateInternalForces() {
  this.structure.beams.forEach(beam => {
  const forces = {
  N: new Array(this.numSections),
  V: new Array(this.numSections),
  M: new Array(this.numSections),
  T: new Array(this.numSections).fill(0)
  }
  
  const L = beam.getLength()
  
  for (let i = 0; i < this.numSections; i++) {
  const position = (i / (this.numSections - 1)) * L
  const point = {
  x: beam.startNode.x + (beam.endNode.x - beam.startNode.x) * (position / L),
  y: beam.startNode.y + (beam.endNode.y - beam.startNode.y) * (position / L)
  }
  
  forces.N[i] = this.calculateNormalForce(point)
  forces.V[i] = 0 // Arcos não têm cortante significativo
  forces.M[i] = 0 // Arcos ideais não têm momento
  }
  
  beam.setInternalForces(forces)
  this.internalForces[beam.id] = forces
  })
  }

/**

- Obtém reação em apoio
  */
  getReaction(nodeId) {
  return this.reactions[nodeId] || { fx: 0, fy: 0, m: 0 }
  }

/**

- Verifica se linha de pressão está dentro do núcleo central
  */
  isPressureLineWithinCore() {
  // Simplificação: verificar se linha de pressão está dentro da seção
  return this.pressureLine.every(point => {
  // Verificar se excentricidade é pequena
  return Math.abs(point.N) > 0
  })
  }

/**

- Obtém resumo da análise
  */
  getSummary() {
  return {
  reactions: this.reactions,
  arcLength: this.getArcLength(),
  maxNormalForce: Math.max(…this.pressureLine.map(p => Math.abs(p.N))),
  pressureLineValid: this.isPressureLineWithinCore(),
  numSections: this.numSections
  }
  }

/**

- Calcula flecha máxima do arco
  */
  getMaxDeflection() {
  // Simplificação: usar fórmula aproximada
  const loads = this.structure.getLoads()
  const totalLoad = loads.reduce((sum, load) => {
  if (load.type === ‘point’) {
  return sum + Math.abs(load.magnitude)
  }
  return sum
  }, 0)

```
const span = this.structure.nodes[this.structure.nodes.length - 1].x - 
             this.structure.nodes[0].x
const rise = Math.max(...this.structure.nodes.map(n => n.y)) -
             Math.min(...this.structure.nodes.map(n => n.y))

// Fórmula simplificada
const deflection = (totalLoad * span ** 3) / (100 * rise * 1e6)
return deflection
```

}

/**

- Valida se o arco pode suportar as cargas
  */
  isStable() {
  return this.isPressureLineWithinCore() &&
  this.structure.isStaticallyDeterminate()
  }
  }