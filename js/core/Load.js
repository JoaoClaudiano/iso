/**

- @class Load
- @description Representa uma carga aplicada a uma estrutura
  */
  class Load {
  /**
  - Cria uma nova carga
  - @param {string} type - Tipo: ‘point’, ‘distributed’, ‘moment’
  - @param {number} magnitude - Magnitude (kN ou kN/m ou kN·m)
  - @param {number} position - Posição (metros)
  - @param {number} direction - Direção (graus): 0°=direita, 90°=cima, -90°=baixo
    */
    constructor(type, magnitude, position = 0, direction = -90) {
    const validTypes = [‘point’, ‘distributed’, ‘moment’]
    if (!validTypes.includes(type)) {
    throw new Error(`Tipo de carga inválido: ${type}`)
    }
  
  this.type = type
  this.magnitude = magnitude
  this.position = position
  this.direction = direction // em graus
  
  // Para cargas distribuídas
  this.startPos = position
  this.endPos = position
  if (type === ‘distributed’) {
  this.startPos = position
  this.endPos = position + 1 // 1 metro de comprimento por padrão
  }
  }

/**

- Obtém as componentes da carga (Fx, Fy)
- @returns {Object} {fx, fy} em kN
  */
  getComponents() {
  const rad = (this.direction * Math.PI) / 180
  return {
  fx: this.magnitude * Math.cos(rad),
  fy: this.magnitude * Math.sin(rad)
  }
  }

/**

- Define a posição da carga
- @param {number} position - Posição em metros
  */
  setPosition(position) {
  this.position = position
  if (this.type === ‘distributed’) {
  this.startPos = position
  }
  }

/**

- Define o intervalo para carga distribuída
- @param {number} startPos - Posição inicial
- @param {number} endPos - Posição final
  */
  setDistributedInterval(startPos, endPos) {
  if (this.type !== ‘distributed’) {
  throw new Error(‘Apenas cargas distribuídas têm intervalo’)
  }
  this.startPos = startPos
  this.endPos = endPos
  this.position = startPos
  }

/**

- Obtém o comprimento de uma carga distribuída
- @returns {number}
  */
  getDistributedLength() {
  if (this.type !== ‘distributed’) {
  return 0
  }
  return this.endPos - this.startPos
  }

/**

- Define a magnitude da carga
- @param {number} magnitude
  */
  setMagnitude(magnitude) {
  this.magnitude = magnitude
  }

/**

- Define a direção da carga
- @param {number} direction - Direção em graus
  */
  setDirection(direction) {
  this.direction = direction % 360
  }

/**

- Obtém a direção em radianos
- @returns {number}
  */
  getDirectionRadians() {
  return (this.direction * Math.PI) / 180
  }

/**

- Verifica se a carga está em uma posição específica
- @param {number} position
- @param {number} tolerance - Tolerância em metros
- @returns {boolean}
  */
  isAtPosition(position, tolerance = 0.01) {
  if (this.type === ‘distributed’) {
  return position >= this.startPos && position <= this.endPos
  }
  return Math.abs(this.position - position) <= tolerance
  }

/**

- Obtém a carga resultante em um intervalo (para distribuídas)
- @param {number} startPos
- @param {number} endPos
- @returns {number}
  */
  getResultantInInterval(startPos, endPos) {
  if (this.type !== ‘distributed’) {
  if (this.isAtPosition(startPos)) {
  return this.magnitude
  }
  return 0
  }

```
// Calcular interseção com intervalo
const overlapStart = Math.max(this.startPos, startPos)
const overlapEnd = Math.min(this.endPos, endPos)

if (overlapStart >= overlapEnd) {
  return 0 // Sem sobreposição
}

const overlapLength = overlapEnd - overlapStart
return this.magnitude * overlapLength
```

}

/**

- Obtém a posição do resultado de uma carga distribuída
- @returns {number}
  */
  getResultantPosition() {
  if (this.type === ‘distributed’) {
  return (this.startPos + this.endPos) / 2
  }
  return this.position
  }

/**

- Converte a carga para um diagrama de carregamento
- @param {number} numPoints - Número de pontos
- @returns {Array<number>} Array de magnitudes
  */
  toDiagram(numPoints) {
  const diagram = new Array(numPoints).fill(0)

```
if (this.type === 'point') {
  const index = Math.round(
    (this.position / 10) * (numPoints - 1) // Assumindo comprimento 10m
  )
  if (index >= 0 && index < numPoints) {
    diagram[index] = this.magnitude
  }
} else if (this.type === 'distributed') {
  const startIdx = Math.round((this.startPos / 10) * (numPoints - 1))
  const endIdx = Math.round((this.endPos / 10) * (numPoints - 1))
  for (let i = startIdx; i <= endIdx; i++) {
    if (i >= 0 && i < numPoints) {
      diagram[i] = this.magnitude
    }
  }
}

return diagram
```

}

/**

- Exporta a carga como objeto JSON
- @returns {Object}
  */
  toJSON() {
  return {
  type: this.type,
  magnitude: this.magnitude,
  position: this.position,
  direction: this.direction,
  startPos: this.startPos,
  endPos: this.endPos
  }
  }

/**

- Cria uma carga a partir de um objeto JSON
- @static
- @param {Object} data
- @returns {Load}
  */
  static fromJSON(data) {
  const load = new Load(data.type, data.magnitude, data.position, data.direction)
  if (data.startPos !== undefined) load.startPos = data.startPos
  if (data.endPos !== undefined) load.endPos = data.endPos
  return load
  }

/**

- Clona a carga
- @returns {Load}
  */
  clone() {
  const cloned = new Load(this.type, this.magnitude, this.position, this.direction)
  cloned.startPos = this.startPos
  cloned.endPos = this.endPos
  return cloned
  }

/**

- Retorna informações da carga como string
- @returns {string}
  */
  toString() {
  let desc = `${this.type.charAt(0).toUpperCase() + this.type.slice(1)} Load: ${ this.magnitude     }`

```
if (this.type === 'point') {
  desc += ` kN @ ${this.position.toFixed(2)}m`
} else if (this.type === 'distributed') {
  desc += ` kN/m (${this.startPos.toFixed(2)} - ${this.endPos.toFixed(2)}m)`
} else if (this.type === 'moment') {
  desc += ` kN·m @ ${this.position.toFixed(2)}m`
}

desc += ` @ ${this.direction}°`
return desc
```

}

/**

- Valida a carga
- @returns {Array<string>} Array de erros (vazio se válido)
  */
  validate() {
  const errors = []

```
if (!['point', 'distributed', 'moment'].includes(this.type)) {
  errors.push('Tipo de carga inválido')
}

if (typeof this.magnitude !== 'number' || this.magnitude === 0) {
  errors.push('Magnitude deve ser um número não-zero')
}

if (typeof this.position !== 'number' || this.position < 0) {
  errors.push('Posição deve ser um número não-negativo')
}

if (this.type === 'distributed') {
  if (this.startPos >= this.endPos) {
    errors.push('Para distribuída: startPos deve ser < endPos')
  }
}

if (typeof this.direction !== 'number') {
  errors.push('Direção deve ser um número')
}

return errors
```

}

/**

- Cria uma carga na direção vertical (padrão em estruturas)
- @static
- @param {string} type - Tipo de carga
- @param {number} magnitude - Magnitude
- @param {number} position - Posição
- @returns {Load}
  */
  static createVertical(type, magnitude, position) {
  return new Load(type, magnitude, position, -90)
  }

/**

- Cria uma carga na direção horizontal
- @static
- @param {string} type - Tipo de carga
- @param {number} magnitude - Magnitude
- @param {number} position - Posição
- @returns {Load}
  */
  static createHorizontal(type, magnitude, position) {
  return new Load(type, magnitude, position, 0)
  }
  }