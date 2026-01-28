/**

- @class Node
- @description Representa um nó estrutural (ponto de conexão)
  */
  class Node {
  /**
  - Cria um novo nó
  - @param {number} id - ID único do nó
  - @param {number} x - Coordenada X em metros
  - @param {number} y - Coordenada Y em metros
    */
    constructor(id, x, y) {
    this.id = id
    this.x = x
    this.y = y
    this.support = null // ‘free’, ‘roller’, ‘pinned’, ‘fixed’
    this.reactions = {
    fx: 0, // Reação horizontal (kN)
    fy: 0, // Reação vertical (kN)
    m: 0 // Reação de momento (kN·m)
    }
    this.displacements = {
    dx: 0, // Deslocamento horizontal (mm)
    dy: 0, // Deslocamento vertical (mm)
    r: 0 // Rotação (radianos)
    }
    this.isSelected = false
    }

/**

- Define o tipo de apoio no nó
- @param {string} type - Tipo de apoio: ‘free’, ‘roller’, ‘pinned’, ‘fixed’
- @throws {Error} Se tipo inválido
  */
  setSupport(type) {
  const validTypes = [‘free’, ‘roller’, ‘pinned’, ‘fixed’]
  if (!validTypes.includes(type)) {
  throw new Error(`Tipo de apoio inválido: ${type}`)
  }
  this.support = type
  }

/**

- Obtém a posição do nó
- @returns {Object} Objeto com coordenadas {x, y}
  */
  getPosition() {
  return {
  x: this.x,
  y: this.y
  }
  }

/**

- Define a posição do nó
- @param {number} x - Coordenada X
- @param {number} y - Coordenada Y
  */
  setPosition(x, y) {
  this.x = x
  this.y = y
  }

/**

- Verifica se o nó tem apoio
- @returns {boolean}
  */
  isSupported() {
  return this.support !== null && this.support !== ‘free’
  }

/**

- Retorna o número de graus de liberdade restritos
- @returns {number} 0-3 (0 = totalmente restrito, 3 = livre)
  */
  getDegreesOfFreedom() {
  if (this.support === ‘fixed’) return 0 // Restringe x, y, r
  if (this.support === ‘pinned’) return 1 // Restringe x, y
  if (this.support === ‘roller’) return 2 // Restringe apenas um eixo
  return 3 // Livre
  }

/**

- Obtém as restrições do nó
- @returns {Array<boolean>} [restrictX, restrictY, restrictR]
  */
  getRestrictions() {
  switch (this.support) {
  case ‘fixed’:
  return [true, true, true] // Restringe tudo
  case ‘pinned’:
  return [true, true, false] // Restringe x, y
  case ‘roller’:
  return [true, false, false] // Restringe x
  case ‘free’:
  default:
  return [false, false, false] // Sem restrições
  }
  }

/**

- Define a reação no nó
- @param {number} fx - Reação horizontal (kN)
- @param {number} fy - Reação vertical (kN)
- @param {number} m - Reação de momento (kN·m)
  */
  setReaction(fx, fy, m) {
  this.reactions = {
  fx: Number(fx.toFixed(4)),
  fy: Number(fy.toFixed(4)),
  m: Number(m.toFixed(4))
  }
  }

/**

- Obtém as reações do nó
- @returns {Object} Objeto com reações {fx, fy, m}
  */
  getReactions() {
  return { …this.reactions }
  }

/**

- Define o deslocamento no nó
- @param {number} dx - Deslocamento horizontal (mm)
- @param {number} dy - Deslocamento vertical (mm)
- @param {number} r - Rotação (radianos)
  */
  setDisplacement(dx, dy, r) {
  this.displacements = {
  dx: Number(dx.toFixed(6)),
  dy: Number(dy.toFixed(6)),
  r: Number(r.toFixed(6))
  }
  }

/**

- Obtém os deslocamentos do nó
- @returns {Object} Objeto com deslocamentos {dx, dy, r}
  */
  getDisplacements() {
  return { …this.displacements }
  }

/**

- Verifica se o nó tem reações não-nulas
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

- Limpa as reações e deslocamentos
  */
  clearAnalysisResults() {
  this.reactions = { fx: 0, fy: 0, m: 0 }
  this.displacements = { dx: 0, dy: 0, r: 0 }
  }

/**

- Exporta o nó como objeto JSON
- @returns {Object}
  */
  toJSON() {
  return {
  id: this.id,
  x: this.x,
  y: this.y,
  support: this.support,
  reactions: this.reactions,
  displacements: this.displacements
  }
  }

/**

- Cria um nó a partir de um objeto JSON
- @static
- @param {Object} data
- @returns {Node}
  */
  static fromJSON(data) {
  const node = new Node(data.id, data.x, data.y)
  if (data.support) node.setSupport(data.support)
  if (data.reactions) node.reactions = { …data.reactions }
  if (data.displacements) node.displacements = { …data.displacements }
  return node
  }

/**

- Clona o nó
- @returns {Node}
  */
  clone() {
  const cloned = new Node(this.id, this.x, this.y)
  cloned.support = this.support
  cloned.reactions = { …this.reactions }
  cloned.displacements = { …this.displacements }
  return cloned
  }

/**

- Retorna informações do nó como string
- @returns {string}
  */
  toString() {
  let info = `Node #${this.id} (${this.x.toFixed(2)}, ${this.y.toFixed(2)})`
  if (this.support) {
  info += ` [${this.support}]`
  }
  return info
  }
  }