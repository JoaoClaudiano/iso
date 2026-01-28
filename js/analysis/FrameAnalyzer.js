/**

- @class FrameAnalyzer
- @description Analisador para pórticos planos (estruturas reticuladas 2D)
  */
  class FrameAnalyzer {
  /**
  - Cria um novo analisador de pórticos
  - @param {Structure} structure - Estrutura a analisar
    */
    constructor(structure) {
    if (structure.type !== ‘frame’) {
    throw new Error(‘FrameAnalyzer só funciona com estruturas do tipo frame’)
    }
  
  this.structure = structure
  this.solver = new Solver()
  this.reactions = {}
  this.internalForces = {}
  this.displacements = {}
  this.numSections = 100
  }

/**

- Realiza a análise completa do pórtico
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

// Montar sistema de equações
const { K, F, restrained } = this.buildSystemMatrix()

// Resolver deslocamentos
this.solveDisplacements(K, F, restrained)

// Calcular reações
this.calculateReactions(K, F)

// Calcular esforços internos
this.calculateInternalForces()

const endTime = performance.now()
const analysisTime = (endTime - startTime) / 1000

this.structure.analysisTime = analysisTime
this.structure.isAnalyzed = true
this.structure.results = {
  reactions: this.reactions,
  internalForces: this.internalForces,
  displacements: this.displacements,
  analysisTime: analysisTime
}

return this.structure.results
```

}

/**

- Constrói a matriz de rigidez global
- @private
  */
  buildSystemMatrix() {
  const nNodes = this.structure.nodes.length
  const nDOF = nNodes * 3 // 3 graus de liberdade por nó (ux, uy, r)
  const nElem = this.structure.beams.length

```
// Matriz de rigidez global
const K = Array(nDOF).fill(0).map(() => Array(nDOF).fill(0))

// Vetor de forças
const F = new Array(nDOF).fill(0)

// Montar contribuições de cada elemento
this.structure.beams.forEach(beam => {
  const Ke = this.getElementStiffnessMatrix(beam)
  const Fe = this.getElementLoadVector(beam)
  const indices = this.getGlobalDOFIndices(beam)

  // Adicionar à matriz global
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      K[indices[i]][indices[j]] += Ke[i][j]
    }
    F[indices[i]] += Fe[i]
  }
})

// Aplicar cargas concentradas
this.applyConcentratedLoads(F)

// Identificar DOFs restritos
const restrained = this.getRestrainedDOFs()

return { K, F, restrained }
```

}

/**

- Matriz de rigidez do elemento de barra
- @private
  */
  getElementStiffnessMatrix(beam) {
  const L = beam.getLength()
  const E = beam.properties.E * 1e6 // Converter GPa para kPa
  const A = beam.properties.A / 10000 // Converter cm² para m²
  const I = beam.properties.I / 1e8 // Converter cm⁴ para m⁴

```
const EA = E * A / L
const EI = E * I

// Matriz local
const k = [
  [EA, 0, 0, -EA, 0, 0],
  [0, 12 * EI / (L * L * L), 6 * EI / (L * L), 0, -12 * EI / (L * L * L), 6 * EI / (L * L)],
  [0, 6 * EI / (L * L), 4 * EI / L, 0, -6 * EI / (L * L), 2 * EI / L],
  [-EA, 0, 0, EA, 0, 0],
  [0, -12 * EI / (L * L * L), -6 * EI / (L * L), 0, 12 * EI / (L * L * L), -6 * EI / (L * L)],
  [0, 6 * EI / (L * L), 2 * EI / L, 0, -6 * EI / (L * L), 4 * EI / L]
]

// Transformação para coordenadas globais
const angle = beam.getAngle()
const T = this.getTransformationMatrix(angle)
const TT = this.transposeMatrix(T)

// Ke = T^T * k * T
const temp = this.multiplyMatrices(k, T)
const Ke = this.multiplyMatrices(TT, temp)

return Ke
```

}

/**

- Vetor de carga do elemento
- @private
  */
  getElementLoadVector(beam) {
  const L = beam.getLength()
  const fe = new Array(6).fill(0)

```
// Processar cargas distribuídas
beam.loads.forEach(load => {
  if (load.type === 'distributed') {
    const w = load.magnitude
    // Carga no fim (simplificado)
    fe[1] += w * L / 2
    fe[4] += w * L / 2
    fe[2] += w * L * L / 12
    fe[5] -= w * L * L / 12
  } else if (load.type === 'point') {
    const pos = load.position / L
    const components = load.getComponents()
    
    // Interpolação linear da carga
    fe[0] += components.fx * (1 - pos)
    fe[1] += components.fy * (1 - pos)
    fe[2] += components.fy * L * pos * (1 - pos) / 2
    
    fe[3] += components.fx * pos
    fe[4] += components.fy * pos
    fe[5] += components.fy * L * pos * (1 - pos) / 2
  } else if (load.type === 'moment') {
    fe[2] += load.magnitude / 2
    fe[5] += load.magnitude / 2
  }
})

// Transformar para coordenadas globais
const angle = beam.getAngle()
const T = this.getTransformationMatrix(angle)
const Fe = this.multiplyMatrixVector(this.transposeMatrix(T), fe)

return Fe
```

}

/**

- Matriz de transformação de coordenadas
- @private
  */
  getTransformationMatrix(angle) {
  const c = Math.cos(angle)
  const s = Math.sin(angle)

```
return [
  [c, s, 0, 0, 0, 0],
  [-s, c, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0],
  [0, 0, 0, c, s, 0],
  [0, 0, 0, -s, c, 0],
  [0, 0, 0, 0, 0, 1]
]
```

}

/**

- Indices globais dos graus de liberdade do elemento
- @private
  */
  getGlobalDOFIndices(beam) {
  const nodeI = beam.startNode.id
  const nodeJ = beam.endNode.id

```
return [
  nodeI * 3,     // ux do nó i
  nodeI * 3 + 1, // uy do nó i
  nodeI * 3 + 2, // r do nó i
  nodeJ * 3,     // ux do nó j
  nodeJ * 3 + 1, // uy do nó j
  nodeJ * 3 + 2  // r do nó j
]
```

}

/**

- DOFs restritos pelos apoios
- @private
  */
  getRestrainedDOFs() {
  const restrained = new Set()

```
this.structure.supports.forEach(support => {
  const nodeId = support.node.id
  const restrictions = support.getRestrictions()

  if (restrictions[0]) restrained.add(nodeId * 3)     // ux
  if (restrictions[1]) restrained.add(nodeId * 3 + 1) // uy
  if (restrictions[2]) restrained.add(nodeId * 3 + 2) // r
})

return restrained
```

}

/**

- Aplica cargas concentradas
- @private
  */
  applyConcentratedLoads(F) {
  this.structure.loads.forEach(load => {
  if (load.type === ‘moment’) {
  const beam = this.structure.beams.find(b => b.loads.includes(load))
  if (!beam) return
  
  const nodeIdx = Math.abs(beam.startNode.id - load.position) <
  Math.abs(beam.endNode.id - load.position)
  ? beam.startNode.id
  : beam.endNode.id
  
  F[nodeIdx * 3 + 2] += load.magnitude
  }
  })
  }

/**

- Resolve os deslocamentos nodais
- @private
  */
  solveDisplacements(K, F, restrained) {
  const nDOF = K.length
  const restrainedArray = Array.from(restrained).sort((a, b) => b - a)

```
// Reduzir sistema (remover linhas/colunas restritas)
const nFree = nDOF - restrainedArray.length
const Kr = Array(nFree).fill(0).map(() => Array(nFree).fill(0))
const Fr = new Array(nFree)

let freeDOF = []
for (let i = 0; i < nDOF; i++) {
  if (!restrained.has(i)) {
    freeDOF.push(i)
  }
}

for (let i = 0; i < nFree; i++) {
  Fr[i] = F[freeDOF[i]]
  for (let j = 0; j < nFree; j++) {
    Kr[i][j] = K[freeDOF[i]][freeDOF[j]]
  }
}

// Resolver: Kr * ur = Fr
const matrix = Kr.map((row, i) => [...row, Fr[i]])
const ur = this.solver.solveGaussJordan(matrix)

if (!ur) {
  throw new Error('Sistema singular - não converge')
}

// Montar vetor completo de deslocamentos
const u = new Array(nDOF).fill(0)
for (let i = 0; i < nFree; i++) {
  u[freeDOF[i]] = ur[i]
}

// Armazenar deslocamentos nos nós
this.structure.nodes.forEach(node => {
  const i = node.id * 3
  node.setDisplacement(u[i], u[i + 1], u[i + 2])
  this.displacements[node.id] = {
    dx: u[i],
    dy: u[i + 1],
    r: u[i + 2]
  }
})
```

}

/**

- Calcula as reações nos apoios
- @private
  */
  calculateReactions(K, F) {
  const nNodes = this.structure.nodes.length

```
// Calcular R = K*u - F para DOFs restritos
this.structure.supports.forEach(support => {
  const nodeId = support.node.id
  const node = support.node
  const restrictions = support.getRestrictions()

  let fx = 0, fy = 0, m = 0

  if (restrictions[0]) { // ux restrito
    const idx = nodeId * 3
    let sum = 0
    for (let j = 0; j < nNodes * 3; j++) {
      sum += K[idx][j] * (this.displacements[Math.floor(j / 3)][
        j % 3 === 0 ? 'dx' : j % 3 === 1 ? 'dy' : 'r'
      ] || 0)
    }
    fx = sum - F[idx]
  }

  if (restrictions[1]) { // uy restrito
    const idx = nodeId * 3 + 1
    let sum = 0
    for (let j = 0; j < nNodes * 3; j++) {
      sum += K[idx][j] * (this.displacements[Math.floor(j / 3)][
        j % 3 === 0 ? 'dx' : j % 3 === 1 ? 'dy' : 'r'
      ] || 0)
    }
    fy = sum - F[idx]
  }

  if (restrictions[2]) { // r restrito
    const idx = nodeId * 3 + 2
    let sum = 0
    for (let j = 0; j < nNodes * 3; j++) {
      sum += K[idx][j] * (this.displacements[Math.floor(j / 3)][
        j % 3 === 0 ? 'dx' : j % 3 === 1 ? 'dy' : 'r'
      ] || 0)
    }
    m = sum - F[idx]
  }

  this.reactions[nodeId] = {
    fx: MathUtils.round(fx, 4),
    fy: MathUtils.round(fy, 4),
    m: MathUtils.round(m, 4)
  }

  support.setReactions(fx, fy, m)
})
```

}

/**

- Calcula esforços internos nas barras
- @private
  */
  calculateInternalForces() {
  this.structure.beams.forEach(beam => {
  const forces = {
  N: new Array(this.numSections),
  V: new Array(this.numSections),
  M: new Array(this.numSections),
  T: new Array(this.numSections)
  }
  
  const L = beam.getLength()
  const angle = beam.getAngle()
  
  for (let i = 0; i < this.numSections; i++) {
  const s = (i / (this.numSections - 1)) * L
  
  // Deslocamentos nas extremidades
  const u1 = this.displacements[beam.startNode.id]
  const u2 = this.displacements[beam.endNode.id]
  
  // Esforços locais
  const Ke = this.getElementStiffnessMatrix(beam)
  const ue_global = [
  u1.dx, u1.dy, u1.r,
  u2.dx, u2.dy, u2.r
  ]
  
  const angle = beam.getAngle()
  const T = this.getTransformationMatrix(angle)
  const ue_local = this.multiplyMatrixVector(T, ue_global)
  
  // Calcular esforços
  const E = beam.properties.E * 1e6
  const A = beam.properties.A / 10000
  const I = beam.properties.I / 1e8
  
  forces.N[i] = (E * A / L) * (ue_local[3] - ue_local[0])
  forces.V[i] = (12 * E * I / (L * L * L)) * (ue_local[4] - ue_local[1])
  forces.M[i] = (6 * E * I / (L * L)) * (ue_local[2] + ue_local[5])
  forces.T[i] = 0 // Sem torção em pórtico plano
  }
  
  beam.setInternalForces(forces)
  this.internalForces[beam.id] = forces
  })
  }

/**

- Funções auxiliares de álgebra linear
- @private
  */
  multiplyMatrices(A, B) {
  const result = Array(A.length).fill(0).map(() => Array(B[0].length).fill(0))
  for (let i = 0; i < A.length; i++) {
  for (let j = 0; j < B[0].length; j++) {
  for (let k = 0; k < B.length; k++) {
  result[i][j] += A[i][k] * B[k][j]
  }
  }
  }
  return result
  }

multiplyMatrixVector(A, v) {
return A.map(row => row.reduce((sum, val, i) => sum + val * v[i], 0))
}

transposeMatrix(A) {
return A[0].map((_, i) => A.map(row => row[i]))
}

/**

- Obtém um resumo da análise
  */
  getSummary() {
  return {
  reactions: this.reactions,
  displacements: this.displacements,
  maxDisplacement: Math.max(…Object.values(this.displacements).map(d =>
  Math.sqrt(d.dx ** 2 + d.dy ** 2)
  )),
  maxStress: Math.max(…Object.values(this.internalForces).map(f =>
  Math.max(…f.M.map(m => Math.abs(m)))
  ))
  }
  }
  }