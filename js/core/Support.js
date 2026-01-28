/**

- @class Support
- @description Representa um apoio ou vínculo estrutural
  */
  class Support {
  /**
  - Cria um novo apoio
  - @param {Node} node - Nó onde o apoio está localizado
  - @param {string} type - Tipo de apoio: ‘free’, ‘roller’, ‘pinned’, ‘fixed’
    */
    constructor(node, type) {
    const validTypes = [‘free’, ‘roller’, ‘pinned’, ‘fixed’]
    if (!validTypes.includes(type)) {
    throw new Error(`Tipo de apoio inválido: ${type}`)
    }
  
  this.node = node
  this.type = type
  this.reactions = {
  fx: 0, // Reação horizontal
  fy: 0, // Reação vertical
  m: 0 // Momento reativo
  }
  }

/**

- Obtém o tipo de apoio
- @returns {string}
  */
  getType() {
  return this.type
  }

/**

- Define o tipo de apoio
- @param {string} type
  */
  setType(type) {
  const validTypes = [‘free’, ‘roller’, ‘pinned’, ‘fixed’]
  if (!validTypes.includes(type)) {
  throw new Error(`Tipo de apoio inválido: ${type}`)
  }
  this.type = type
  this.node.setSupport(type)
  }

/**

- Obtém as restrições do apoio
- @returns {Array<boolean>} [restrictX, restrictY, restrictR]
  */
  getRestrictions() {
  switch (this.type) {
  case ‘fixed’: // Engastado - restringe tudo
  return [true, true, true]
  case ‘pinned’: // Articulado - restringe X e Y
  return [true, true, false]
  case ‘roller’: // Móvel - restringe apenas um eixo
  return [true, false, false]
  case ‘free’: // Livre - sem restrições
  default:
  return [false, false, false]
  }
  }

/**

- Obtém o número de restrições
- @returns {number} 0, 1, 2 ou 3
  */
  getNumberOfRestrictions() {
  return this.getRestrictions().filter((r) => r).length
  }

/**

- Verifica se restringe deslocamento horizontal
- @returns {boolean}
  */
  restrictX() {
  return this.getRestrictions()[0]
  }

/**

- Verifica se restringe deslocamento vertical
- @returns {boolean}
  */
  restrictY() {
  return this.getRestrictions()[1]
  }

/**

- Verifica se restringe rotação
- @returns {boolean}
  */
  restrictR() {
  return this.getRestrictions()[2]
  }

/**

- Define as reações do apoio
- @param {number} fx - Reação horizontal (kN)
- @param {number} fy - Reação vertical (kN)
- @param {number} m - Momento reativo (kN·m)
  */
  setReactions(fx = 0, fy = 0, m = 0) {
  // Zera reações que não são possíveis no apoio
  const restrictions = this.getRestrictions()

```
this.reactions = {
  fx: restrictions[0] ? Number(fx.toFixed(4)) : 0,
  fy: restrictions[1] ? Number(fy.toFixed(4)) : 0,
  m: restrictions[2] ? Number(m.toFixed(4)) : 0
}

// Atualiza o nó
this.node.setReaction(this.reactions.fx, this.reactions.fy, this.reactions.m)
```

}

/**

- Obtém as reações do apoio
- @returns {Object} {fx, fy, m}
  */
  getReactions() {
  return { …this.reactions }
  }

/**

- Obtém a resultante de reação
- @returns {number}
  */
  getResultantReaction() {
  return Math.sqrt(
  this.reactions.fx * this.reactions.fx + this.reactions.fy * this.reactions.fy
  )
  }

/**

- Obtém o módulo da reação (em kN)
- @returns {number}
  */
  getReactionMagnitude() {
  return Math.abs(this.reactions.fy) > 0 ? this.reactions.fy : this.reactions.fx
  }

/**

- Verifica se o apoio tem reações
- @returns {boolean}
  */
  hasReactions() {
  return (
  Math.abs(this.reactions.fx) > 1e-6 ||
  Math.abs(this.reactions.fy) > 1e-6 ||
  Math.abs(this.reactions.m) > 1e-6
  )
  }

/**

- Obtém a descrição legível do apoio
- @returns {string}
  */
  getDescription() {
  const descriptions = {
  free: ‘Livre - sem restrições’,
  roller: ‘Apoio móvel - um eixo restrito’,
  pinned: ‘Apoio articulado - dois eixos restritos’,
  fixed: ‘Engastado - totalmente restrito’
  }
  return descriptions[this.type] || ‘Desconhecido’
  }

/**

- Limpa as reações
  */
  clearReactions() {
  this.reactions = {
  fx: 0,
  fy: 0,
  m: 0
  }
  }

/**

- Exporta o apoio como objeto JSON
- @returns {Object}
  */
  toJSON() {
  return {
  nodeId: this.node.id,
  type: this.type,
  reactions: this.reactions
  }
  }

/**

- Clona o apoio
- @returns {Support}
  */
  clone() {
  const cloned = new Support(this.node, this.type)
  cloned.reactions = { …this.reactions }
  return cloned
  }

/**

- Retorna informações do apoio como string
- @returns {string}
  */
  toString() {
  let str = `Support on Node #${this.node.id}: ${this.type.toUpperCase()}`
  if (this.hasReactions()) {
  str += ` [Fx=${this.reactions.fx.toFixed(2)}, Fy=${this.reactions.fy.toFixed( 2 )}, M=${this.reactions.m.toFixed(2)}]`
  }
  return str
  }

/**

- Retorna um símbolo visual para o apoio
- @static
- @param {string} type
- @returns {string}
  */
  static getSymbol(type) {
  const symbols = {
  free: ‘○’,
  roller: ‘⊕’,
  pinned: ‘⊙’,
  fixed: ‘■’
  }
  return symbols[type] || ‘?’
  }

/**

- Retorna informações detalhadas do apoio
- @returns {Object}
  */
  getInfo() {
  return {
  type: this.type,
  nodeId: this.node.id,
  description: this.getDescription(),
  restrictions: this.getRestrictions(),
  reactions: this.reactions,
  resultant: this.getResultantReaction()
  }
  }

/**

- Valida o apoio
- @returns {Array<string>} Array de erros
  */
  validate() {
  const errors = []

```
if (!this.node) {
  errors.push('Apoio deve ter um nó associado')
}

const validTypes = ['free', 'roller', 'pinned', 'fixed']
if (!validTypes.includes(this.type)) {
  errors.push('Tipo de apoio inválido')
}

return errors
```

}

/**

- Cria um apoio fixo (engastado)
- @static
- @param {Node} node
- @returns {Support}
  */
  static createFixed(node) {
  return new Support(node, ‘fixed’)
  }

/**

- Cria um apoio articulado (pinned)
- @static
- @param {Node} node
- @returns {Support}
  */
  static createPinned(node) {
  return new Support(node, ‘pinned’)
  }

/**

- Cria um apoio móvel (roller)
- @static
- @param {Node} node
- @returns {Support}
  */
  static createRoller(node) {
  return new Support(node, ‘roller’)
  }
  }