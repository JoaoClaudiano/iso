/**

- @class BeamAnalyzer
- @description Analisador para estruturas de viga isostática
  */
  class BeamAnalyzer {
  /**
  - Cria um novo analisador de vigas
  - @param {Structure} structure - Estrutura a analisar
    */
    constructor(structure) {
    if (structure.type !== ‘beam’) {
    throw new Error(‘BeamAnalyzer só funciona com estruturas do tipo beam’)
    }
  
  this.structure = structure
  this.reactions = {}
  this.internalForces = {}
  this.numSections = 100
  }

/**

- Realiza a análise completa da viga
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

// Calcular reações
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

- Calcula as reações nos apoios
  */
  calculateReactions() {
  this.reactions = {}

```
// Encontrar todos os apoios
const supports = this.structure.getSupports()

// Calcular carga total
const totalLoad = this.calculateTotalLoad()
const momentAboutOrigin = this.calculateMomentAboutOrigin()

// Para cada apoio
supports.forEach((support) => {
  this.reactions[support.node.id] = {
    fx: 0,
    fy: 0,
    m: 0
  }
  support.setReactions(0, 0, 0)
})

// Resolver sistema de equações de equilíbrio
this.solveEquilibrium(supports, totalLoad, momentAboutOrigin)

// Atualizar nós com reações
supports.forEach((support) => {
  const reaction = this.reactions[support.node.id]
  support.setReactions(reaction.fx, reaction.fy, reaction.m)
  support.node.setReaction(reaction.fx, reaction.fy, reaction.m)
})
```

}

/**

- Calcula a carga total aplicada
- @returns {Object} {fx, fy}
  */
  calculateTotalLoad() {
  let fx = 0
  let fy = 0

```
this.structure.loads.forEach((load) => {
  const components = load.getComponents()
  if (load.type === 'distributed') {
    const length = load.getDistributedLength()
    fx += components.fx * length
    fy += components.fy * length
  } else if (load.type === 'point') {
    fx += components.fx
    fy += components.fy
  }
})

return { fx, fy }
```

}

/**

- Calcula o momento total em relação à origem
- @returns {number}
  */
  calculateMomentAboutOrigin() {
  let totalMoment = 0
  const origin = { x: 0, y: 0 }

```
this.structure.loads.forEach((load) => {
  if (load.type === 'moment') {
    totalMoment += load.magnitude
  } else if (load.type === 'point') {
    // M = F × d (perpendicular)
    const beam = this.structure.beams.find((b) => b.loads.includes(load))
    if (beam) {
      const components = load.getComponents()
      const pos = load.position
      const moment = -components.fy * pos // Para vigas horizontais
      totalMoment += moment
    }
  } else if (load.type === 'distributed') {
    const beam = this.structure.beams.find((b) => b.loads.includes(load))
    if (beam) {
      const components = load.getComponents()
      const length = load.getDistributedLength()
      const midPos = (load.startPos + load.endPos) / 2
      const resultantForce = components.fy * length
      const moment = -resultantForce * midPos
      totalMoment += moment
    }
  }
})

return totalMoment
```

}

/**

- Resolve o sistema de equações de equilíbrio
- @private
  */
  solveEquilibrium(supports, totalLoad, totalMoment) {
  const numSupports = supports.length

```
if (numSupports === 0) {
  throw new Error('Nenhum apoio encontrado')
}

if (numSupports === 1) {
  // Um único apoio (engastado)
  this.reactions[supports[0].node.id] = {
    fx: -totalLoad.fx,
    fy: -totalLoad.fy,
    m: -totalMoment
  }
} else if (numSupports === 2) {
  // Dois apoios (mais comum)
  const support1 = supports[0]
  const support2 = supports[1]

  const x1 = support1.node.x
  const x2 = support2.node.x

  const distance = Math.abs(x2 - x1)

  if (Math.abs(distance) < 1e-6) {
    throw new Error('Apoios com coordenadas X iguais')
  }

  // ΣM₁ = 0: -Fy₂ × d + totalMoment + totalLoad.fy × x_load = 0
  let fy2 = 0
  if (Math.abs(distance) > 1e-6) {
    this.structure.loads.forEach((load) => {
      if (load.type === 'point') {
        const components = load.getComponents()
        const moment = -components.fy * (load.position - x1)
        fy2 -= moment / distance
      } else if (load.type === 'distributed') {
        const components = load.getComponents()
        const length = load.getDistributedLength()
        const midPos = (load.startPos + load.endPos) / 2
        const force = components.fy * length
        const moment = -force * (midPos - x1)
        fy2 -= moment / distance
      }
    })

    fy2 -= totalMoment / distance
  }

  // ΣFy = 0: Fy₁ + Fy₂ + totalLoad.fy = 0
  const fy1 = -totalLoad.fy - fy2

  this.reactions[support1.node.id] = {
    fx: -totalLoad.fx / 2, // Distribuir carga horizontal
    fy: fy1,
    m: 0
  }

  this.reactions[support2.node.id] = {
    fx: -totalLoad.fx / 2,
    fy: fy2,
    m: 0
  }
} else {
  // Mais de dois apoios (hiperstática) - usar distribuição simples
  const fy = totalLoad.fy / numSupports

  supports.forEach((support) => {
    this.reactions[support.node.id] = {
      fx: -totalLoad.fx / numSupports,
      fy: -fy,
      m: 0
    }
  })
}
```

}

/**

- Calcula os esforços internos nas barras
  */
  calculateInternalForces() {
  this.internalForces = {}

```
this.structure.beams.forEach((beam) => {
  this.calculateBeamForces(beam)
})
```

}

/**

- Calcula os esforços internos em uma barra específica
- @private
  */
  calculateBeamForces(beam) {
  const length = beam.getLength()
  const numSections = this.numSections

```
const forces = {
  N: new Array(numSections),
  V: new Array(numSections),
  M: new Array(numSections),
  T: new Array(numSections)
}

for (let i = 0; i < numSections; i++) {
  const position = (i / (numSections - 1)) * length

  forces.N[i] = this.calculateNormalForce(beam, position)
  forces.V[i] = this.calculateShearForce(beam, position)
  forces.M[i] = this.calculateBendingMoment(beam, position)
  forces.T[i] = 0 // Vigas não têm torção
}

beam.setInternalForces(forces)
this.internalForces[beam.id] = forces
```

}

/**

- Calcula o esforço normal em uma seção
- @private
  */
  calculateNormalForce(beam, position) {
  let N = 0

```
// Somatório de forças horizontais até a seção
this.structure.loads.forEach((load) => {
  const loadBeam = this.structure.beams.find((b) => b.loads.includes(load))
  if (loadBeam === beam) {
    if (load.position <= position) {
      const components = load.getComponents()
      N += components.fx
    }
  }
})

// Adicionar reação do apoio inicial
const startReaction = this.reactions[beam.startNode.id]
if (startReaction) {
  N += startReaction.fx
}

return N
```

}

/**

- Calcula o esforço cortante em uma seção
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
beam.loads.forEach((load) => {
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

- Calcula o momento fletor em uma seção
- @private
  */
  calculateBendingMoment(beam, position) {
  let M = 0

```
// Integrar força cortante (somar os momentos)
const length = beam.getLength()
const step = length / (this.numSections - 1)

let cumulativeMoment = 0
let previousV = 0

// Reação inicial
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
beam.loads.forEach((load) => {
  if (load.type === 'moment' && load.position <= position) {
    M += load.magnitude
  }
})

return M
```

}

/**

- Obtém a reação em um apoio específico
- @param {number} nodeId
- @returns {Object} {fx, fy, m}
  */
  getReaction(nodeId) {
  return this.reactions[nodeId] || { fx: 0, fy: 0, m: 0 }
  }

/**

- Obtém os esforços em uma barra
- @param {number} beamId
- @returns {Object} {N, V, M, T}
  */
  getBeamForces(beamId) {
  return this.internalForces[beamId] || { N: [], V: [], M: [], T: [] }
  }

/**

- Obtém o esforço máximo em uma barra
- @param {number} beamId
- @param {string} type - ‘N’, ‘V’, ‘M’, ‘T’
- @returns {Object}
  */
  getMaxForce(beamId, type = ‘M’) {
  const beam = this.structure.getBeam(beamId)
  if (!beam) return null

```
return beam.getMaxForce(type)
```

}

/**

- Obtém o esforço mínimo em uma barra
- @param {number} beamId
- @param {string} type
- @returns {Object}
  */
  getMinForce(beamId, type = ‘M’) {
  const beam = this.structure.getBeam(beamId)
  if (!beam) return null

```
return beam.getMinForce(type)
```

}

/**

- Obtém um resumo da análise
- @returns {Object}
  */
  getSummary() {
  const summary = {
  reactions: {},
  extremes: {}
  }

```
// Resumir reações
Object.entries(this.reactions).forEach(([nodeId, reaction]) => {
  summary.reactions[nodeId] = {
    resultant: Math.sqrt(reaction.fx ** 2 + reaction.fy ** 2),
    ...reaction
  }
})

// Extremos de esforços
this.structure.beams.forEach((beam) => {
  const maxM = beam.getMaxForce('M')
  const minM = beam.getMinForce('M')
  const maxV = beam.getMaxForce('V')

  summary.extremes[beam.id] = {
    moment: { max: maxM.value, min: minM.value },
    shear: { max: maxV.value }
  }
})

return summary
```

}
}