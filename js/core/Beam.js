/**

- @class Beam
- @description Representa uma barra/elemento estrutural
  */
  class Beam {
  /**
  - Cria uma nova barra
  - @param {number} id - ID único da barra
  - @param {Node} startNode - Nó inicial
  - @param {Node} endNode - Nó final
    */
    constructor(id, startNode, endNode) {
    this.id = id
    this.startNode = startNode
    this.endNode = endNode
    this.loads = [] // Array de cargas
  
  // Propriedades do material
  this.properties = {
  E: 210000, // Módulo de elasticidade (GPa) - aço
  G: 81000, // Módulo de cisalhamento (GPa)
  I: 1000, // Momento de inércia (cm⁴)
  A: 100, // Área da seção (cm²)
  density: 7850 // Densidade (kg/m³)
  }
  
  // Esforços internos calculados
  this.internalForces = {
  N: [], // Esforço normal
  V: [], // Esforço cortante
  M: [], // Momento fletor
  T: [] // Torção
  }
  
  this.isSelected = false
  this.numSections = 100 // Número de seções para análise
  }

/**

- Obtém o comprimento da barra
- @returns {number} Comprimento em metros
  */
  getLength() {
  const dx = this.endNode.x - this.startNode.x
  const dy = this.endNode.y - this.startNode.y
  return Math.sqrt(dx * dx + dy * dy)
  }

/**

- Obtém o ângulo da barra em relação ao eixo X
- @returns {number} Ângulo em radianos
  */
  getAngle() {
  const dx = this.endNode.x - this.startNode.x
  const dy = this.endNode.y - this.startNode.y
  return Math.atan2(dy, dx)
  }

/**

- Obtém o ângulo em graus
- @returns {number} Ângulo em graus
  */
  getAngleDegrees() {
  return this.getAngle() * (180 / Math.PI)
  }

/**

- Obtém o vetor direção da barra
- @returns {Object} Vetor unitário {x, y}
  */
  getDirectionVector() {
  const length = this.getLength()
  return {
  x: (this.endNode.x - this.startNode.x) / length,
  y: (this.endNode.y - this.startNode.y) / length
  }
  }

/**

- Obtém o vetor normal perpendicular à barra
- @returns {Object} Vetor unitário normal {x, y}
  */
  getNormalVector() {
  const dir = this.getDirectionVector()
  return {
  x: -dir.y,
  y: dir.x
  }
  }

/**

- Obtém o ponto médio da barra
- @returns {Object} Ponto com coordenadas {x, y}
  */
  getMidpoint() {
  return {
  x: (this.startNode.x + this.endNode.x) / 2,
  y: (this.startNode.y + this.endNode.y) / 2
  }
  }

/**

- Adiciona uma carga à barra
- @param {Load} load - Objeto carga
  */
  addLoad(load) {
  if (!load || !load.type) {
  throw new Error(‘Carga inválida’)
  }
  this.loads.push(load)
  }

/**

- Remove uma carga da barra
- @param {number} loadIndex - Índice da carga a remover
  */
  removeLoad(loadIndex) {
  if (loadIndex >= 0 && loadIndex < this.loads.length) {
  this.loads.splice(loadIndex, 1)
  }
  }

/**

- Obtém todas as cargas
- @returns {Array<Load>}
  */
  getLoads() {
  return […this.loads]
  }

/**

- Obtém cargas em uma posição específica
- @param {number} position - Posição na barra (0 a L)
- @param {number} tolerance - Tolerância (padrão: 0.01)
- @returns {Array<Load>}
  */
  getLoadsAt(position, tolerance = 0.01) {
  return this.loads.filter((load) => {
  return Math.abs(load.position - position) <= tolerance
  })
  }

/**

- Obtém a carga distribuída total em um intervalo
- @param {number} start - Posição inicial
- @param {number} end - Posição final
- @returns {number} Carga distribuída em kN/m
  */
  getDistributedLoad(start, end) {
  return this.loads
  .filter((load) => load.type === ‘distributed’)
  .filter((load) => load.startPos <= end && load.endPos >= start)
  .reduce((sum, load) => sum + load.magnitude, 0)
  }

/**

- Define propriedades do material
- @param {Object} props - Objeto com propriedades {E, G, I, A}
  */
  setProperties(props) {
  if (props.E !== undefined) this.properties.E = props.E
  if (props.G !== undefined) this.properties.G = props.G
  if (props.I !== undefined) this.properties.I = props.I
  if (props.A !== undefined) this.properties.A = props.A
  if (props.density !== undefined) this.properties.density = props.density
  }

/**

- Obtém as propriedades da barra
- @returns {Object}
  */
  getProperties() {
  return { …this.properties }
  }

/**

- Calcula o peso próprio da barra
- @returns {number} Peso em kN (9.81 m/s²)
  */
  getSelfWeight() {
  const length = this.getLength() // em metros
  const volume = (this.properties.A / 10000) * length // cm² para m²
  const weight = (this.properties.density * volume * 9.81) / 1000 // kg para kN
  return weight
  }

/**

- Define os esforços internos calculados
- @param {Object} forces - Objeto com arrays N, V, M, T
  */
  setInternalForces(forces) {
  if (forces.N) this.internalForces.N = […forces.N]
  if (forces.V) this.internalForces.V = […forces.V]
  if (forces.M) this.internalForces.M = […forces.M]
  if (forces.T) this.internalForces.T = […forces.T]
  }

/**

- Obtém os esforços internos
- @returns {Object} Objeto com esforços
  */
  getInternalForces() {
  return {
  N: […this.internalForces.N],
  V: […this.internalForces.V],
  M: […this.internalForces.M],
  T: […this.internalForces.T]
  }
  }

/**

- Obtém o esforço em uma seção específica
- @param {number} position - Posição na barra (0 a L)
- @param {string} type - Tipo de esforço: ‘N’, ‘V’, ‘M’, ‘T’
- @returns {number}
  */
  getForceAt(position, type = ‘M’) {
  const length = this.getLength()
  const index = Math.round((position / length) * (this.numSections - 1))
  const forces = this.internalForces[type] || []
  return forces[Math.min(index, forces.length - 1)] || 0
  }

/**

- Obtém o valor máximo de um esforço
- @param {string} type - Tipo de esforço: ‘N’, ‘V’, ‘M’, ‘T’
- @returns {Object} {value, position, index}
  */
  getMaxForce(type = ‘M’) {
  const forces = this.internalForces[type] || []
  if (forces.length === 0) return { value: 0, position: 0, index: 0 }

```
let maxValue = Math.abs(forces[0])
let maxIndex = 0

for (let i = 1; i < forces.length; i++) {
  if (Math.abs(forces[i]) > maxValue) {
    maxValue = Math.abs(forces[i])
    maxIndex = i
  }
}

const position = (maxIndex / (forces.length - 1)) * this.getLength()
return {
  value: forces[maxIndex],
  position: position,
  index: maxIndex
}
```

}

/**

- Obtém o valor mínimo de um esforço
- @param {string} type - Tipo de esforço
- @returns {Object} {value, position, index}
  */
  getMinForce(type = ‘M’) {
  const forces = this.internalForces[type] || []
  if (forces.length === 0) return { value: 0, position: 0, index: 0 }

```
let minValue = forces[0]
let minIndex = 0

for (let i = 1; i < forces.length; i++) {
  if (forces[i] < minValue) {
    minValue = forces[i]
    minIndex = i
  }
}

const position = (minIndex / (forces.length - 1)) * this.getLength()
return {
  value: minValue,
  position: position,
  index: minIndex
}
```

}

/**

- Limpa os esforços calculados
  */
  clearInternalForces() {
  this.internalForces = {
  N: [],
  V: [],
  M: [],
  T: []
  }
  }

/**

- Limpa as cargas
  */
  clearLoads() {
  this.loads = []
  }

/**

- Exporta a barra como objeto JSON
- @returns {Object}
  */
  toJSON() {
  return {
  id: this.id,
  startNode: this.startNode.id,
  endNode: this.endNode.id,
  loads: this.loads.map((load) => load.toJSON()),
  properties: this.properties,
  internalForces: this.internalForces
  }
  }

/**

- Clona a barra
- @returns {Beam}
  */
  clone() {
  const cloned = new Beam(this.id, this.startNode, this.endNode)
  cloned.properties = { …this.properties }
  cloned.loads = this.loads.map((load) => load.clone())
  cloned.internalForces = {
  N: […this.internalForces.N],
  V: […this.internalForces.V],
  M: […this.internalForces.M],
  T: […this.internalForces.T]
  }
  return cloned
  }

/**

- Retorna informações da barra como string
- @returns {string}
  */
  toString() {
  const length = this.getLength().toFixed(2)
  const angle = this.getAngleDegrees().toFixed(1)
  return (
  `Beam #${this.id} (${length}m, ${angle}°) ` +
  `[${this.startNode.id} → ${this.endNode.id}]`
  )
  }
  }