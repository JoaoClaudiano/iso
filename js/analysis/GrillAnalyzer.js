/**

- @class GrillAnalyzer
- @description Analisador para grelhas isostáticas (estruturas espaciais)
  */
  class GrillAnalyzer {
  /**
  - Cria um novo analisador de grelhas
  - @param {Structure} structure - Estrutura a analisar
    */
    constructor(structure) {
    if (structure.type !== ‘grill’) {
    throw new Error(‘GrillAnalyzer só funciona com estruturas do tipo grill’)
    }
  
  this.structure = structure
  this.solver = new Solver()
  this.reactions = {}
  this.internalForces = {}
  this.numSections = 100
  }

/**

- Realiza a análise completa da grelha
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

// Calcular reações (simplificado para grelhas isostáticas)
this.calculateReactions()

// Calcular esforços internos
this.calculateInternalForces()

const endTime = performance.now()
const analysisTime = (endTime - startTime) / 1000

this.structure.analysisTime = analysisTime
this.structure.isAnalyzed = true
this.structure.results = {
  reactions: this.reactions,
  internalForces: this.internalForces,
  analysisTime: analysisTime
}

return this.structure.results
```

}

/**

- Calcula reações nos apoios para grelha
- @private
  */
  calculateReactions() {
  this.reactions = {}

```
const supports = this.structure.getSupports()
const loads = this.structure.getLoads()

// Inicializar reações
supports.forEach(support => {
  this.reactions[support.node.id] = { fx: 0, fy: 0, m: 0 }
})

// Calcular carga total e momentos
let totalVert = 0
let momentX = 0
let momentY = 0

loads.forEach(load => {
  const beam = this.structure.beams.find(b => b.loads.includes(load))
  if (!beam) return

  const components = load.getComponents()

  if (load.type === 'distributed') {
    const length = load.getDistributedLength()
    totalVert += components.fy * length
    
    // Momento em relação ao centro
    const midPos = (load.startPos + load.endPos) / 2
    momentX += components.fy * length * midPos
  } else if (load.type === 'point') {
    totalVert += components.fy
    momentX += components.fy * load.position
  } else if (load.type === 'moment') {
    momentY += load.magnitude
  }
})

// Distribuir reações entre apoios (simplificado)
const numSupports = supports.length
if (numSupports === 0) return

// Para grelha: distribuir reações verticais proporcionalmente
supports.forEach((support, idx) => {
  const fy = -totalVert / numSupports
  const m = -momentY / numSupports

  this.reactions[support.node.id] = {
    fx: 0,
    fy: MathUtils.round(fy, 4),
    m: MathUtils.round(m, 4)
  }

  support.setReactions(0, fy, m)
  support.node.setReaction(0, fy, m)
})
```

}

/**

- Calcula esforços internos nas barras (flexão e torção)
- @private
  */
  calculateInternalForces() {
  this.structure.beams.forEach(beam => {
  this.calculateBeamForces(beam)
  })
  }

/**

- Calcula esforços em uma barra específica
- @private
  */
  calculateBeamForces(beam) {
  const length = beam.getLength()
  const numSections = this.numSections

```
const forces = {
  N: new Array(numSections).fill(0),
  V: new Array(numSections),
  M: new Array(numSections),
  T: new Array(numSections)
}

// Calcular esforços cortante e momento fletor
for (let i = 0; i < numSections; i++) {
  const position = (i / (numSections - 1)) * length

  // Cortante (integração de cargas)
  forces.V[i] = this.calculateShearForce(beam, position)

  // Momento fletor
  forces.M[i] = this.calculateBendingMoment(beam, position)

  // Torção (para grelhas)
  forces.T[i] = this.calculateTorsion(beam, position)
}

beam.setInternalForces(forces)
this.internalForces[beam.id] = forces
```

}

/**

- Calcula força cortante em uma seção
- @private
  */
  calculateShearForce(beam, position) {
  let V = 0

```
// Reação inicial
const startReaction = this.reactions[beam.startNode.id]
if (startReaction) {
  V += startReaction.fy
}

// Cargas até a seção
beam.loads.forEach(load => {
  if (load.type === 'point') {
    if (load.position <= position) {
      const components = load.getComponents()
      V += components.fy
    }
  } else if (load.type === 'distributed') {
    const overlapStart = load.startPos
    const overlapEnd = Math.min(load.endPos, position)

    if (overlapStart < overlapEnd) {
      const components = load.getComponents()
      const length = overlapEnd - overlapStart
      V += components.fy * length
    }
  }
})

return V
```

}

/**

- Calcula momento fletor em uma seção
- @private
  */
  calculateBendingMoment(beam, position) {
  let M = 0

```
// Integração de força cortante
const length = beam.getLength()
const step = length / (this.numSections - 1)

let cumulativeMoment = 0
let previousV = 0

const startReaction = this.reactions[beam.startNode.id]
const reactionMoment = startReaction ? startReaction.m : 0

for (let i = 0; i * step <= position; i++) {
  const pos = i * step
  const V = this.calculateShearForce(beam, pos)

  if (i > 0) {
    cumulativeMoment += (previousV + V) / 2 * step
  }

  previousV = V
}

M = reactionMoment + cumulativeMoment

// Adicionar momentos aplicados
beam.loads.forEach(load => {
  if (load.type === 'moment' && load.position <= position) {
    M += load.magnitude
  }
})

return M
```

}

/**

- Calcula torção em uma seção (simplificado)
- @private
  */
  calculateTorsion(beam, position) {
  let T = 0

```
// Momentos torsores aplicados
beam.loads.forEach(load => {
  if (load.type === 'moment' && load.position <= position) {
    // Para grelha, momentos horizontais causam torção
    // Simplificação: usar magnitude como torção
    T += load.magnitude * 0.5
  }
})

return T
```

}

/**

- Obtém reação em um apoio
- @param {number} nodeId
- @returns {Object}
  */
  getReaction(nodeId) {
  return this.reactions[nodeId] || { fx: 0, fy: 0, m: 0 }
  }

/**

- Obtém esforços em uma barra
- @param {number} beamId
- @returns {Object}
  */
  getBeamForces(beamId) {
  const beam = this.structure.getBeam(beamId)
  if (!beam) return null
  return beam.getInternalForces()
  }

/**

- Obtém valor máximo de um esforço em uma barra
- @param {number} beamId
- @param {string} type - ‘N’, ‘V’, ‘M’, ‘T’
- @returns {Object}
  */
  getMaxForce(beamId, type = ‘M’) {
  const beam = this.structure.getBeam(beamId)
  if (!beam) return null

```
const forces = beam.internalForces[type] || []
if (forces.length === 0) return { value: 0, position: 0, index: 0 }

let maxValue = Math.abs(forces[0])
let maxIndex = 0

for (let i = 1; i < forces.length; i++) {
  if (Math.abs(forces[i]) > maxValue) {
    maxValue = Math.abs(forces[i])
    maxIndex = i
  }
}

const position = (maxIndex / (forces.length - 1)) * beam.getLength()
return {
  value: forces[maxIndex],
  position: position,
  index: maxIndex
}
```

}

/**

- Validação de grelha
- @returns {Object}
  */
  validateGrill() {
  const errors = []

```
// Verificar se todos os nós têm suporte vertical
const supportedNodes = this.structure.getSupportedNodes()
if (supportedNodes.length === 0) {
  errors.push('Grelha sem apoios verticais')
}

// Verificar coplanaridade (todos os nós no plano XY)
const zCoords = this.structure.nodes.map(n => n.z || 0)
const allSame = zCoords.every(z => Math.abs(z - zCoords[0]) < 1e-6)
if (!allSame) {
  errors.push('Nós não estão coplanares')
}

// Verificar if todas as cargas são verticais
const nonVerticalLoads = this.structure.loads.filter(load => {
  return load.type === 'point' && Math.abs(load.direction) > 1 && 
         Math.abs(load.direction - 180) > 1
})
if (nonVerticalLoads.length > 0) {
  errors.push('Grelha tem cargas não-verticais')
}

return {
  valid: errors.length === 0,
  errors
}
```

}

/**

- Calcula momento de inércia equivalente para torção
- @private
  */
  getEquivalentInertia(beam) {
  const I = beam.properties.I / 1e8
  const A = beam.properties.A / 10000

```
// Simplificação: usar área para torção
return A * 0.5
```

}

/**

- Obtém resumo da análise
  */
  getSummary() {
  const summary = {
  reactions: {},
  extremes: {}
  }

```
// Reações
Object.entries(this.reactions).forEach(([nodeId, reaction]) => {
  summary.reactions[nodeId] = {
    resultant: Math.sqrt(reaction.fx ** 2 + reaction.fy ** 2),
    ...reaction
  }
})

// Extremos
this.structure.beams.forEach(beam => {
  const maxM = beam.getMaxForce('M')
  const maxT = beam.getMaxForce('T')

  summary.extremes[beam.id] = {
    moment: { max: maxM.value, min: beam.getMinForce('M').value },
    torsion: { max: maxT.value }
  }
})

return summary
```

}

/**

- Verifica se deformação é dentro de limites
- @param {number} limit - Limite em mm
- @returns {boolean}
  */
  isDeformationWithinLimits(limit = 50) {
  // Simplificação: calcular flecha máxima estimada
  const loads = this.structure.getLoads()
  const totalLoad = loads.reduce((sum, load) => {
  if (load.type === ‘point’) {
  return sum + Math.abs(load.magnitude)
  }
  return sum
  }, 0)

```
const maxBeam = Math.max(...this.structure.beams.map(b => b.getLength()))
const estimatedDeflection = (totalLoad * maxBeam ** 4) / (100 * 1e6)

return estimatedDeflection < limit
```

}
}