/**

- @class CanvasRenderer
- @description Renderizador gráfico usando Canvas API
  */
  class CanvasRenderer {
  /**
  - Cria um novo renderizador
  - @param {HTMLCanvasElement} canvas
  - @param {Structure} structure
    */
    constructor(canvas, structure) {
    this.canvas = canvas
    this.ctx = canvas.getContext(‘2d’)
    this.structure = structure
  
  this.scale = 50 // pixels por metro
  this.offsetX = 50
  this.offsetY = canvas.height / 2
  this.showGrid = true
  this.showCoordinates = true
  
  this.selectedNode = null
  this.selectedBeam = null
  
  this.diagramsToShow = {
  N: false,
  V: true,
  M: true,
  T: false,
  deformed: false
  }
  }

/**

- Renderiza a estrutura completa
  */
  render() {
  this.clear()
  this.drawGrid()
  this.drawBeams()
  this.drawSupports()
  this.drawNodes()
  this.drawLoads()
  this.drawDiagrams()
  }

/**

- Limpa o canvas
  */
  clear() {
  this.ctx.fillStyle = Constants.COLORS.surface
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

/**

- Desenha o grid
  */
  drawGrid() {
  if (!this.showGrid) return

```
this.ctx.strokeStyle = Constants.COLORS.border
this.ctx.lineWidth = 1

const gridSize = Constants.CANVAS.gridSize
const rows = Math.ceil(this.canvas.height / gridSize)
const cols = Math.ceil(this.canvas.width / gridSize)

for (let i = 0; i < cols; i++) {
  this.ctx.beginPath()
  this.ctx.moveTo(i * gridSize, 0)
  this.ctx.lineTo(i * gridSize, this.canvas.height)
  this.ctx.stroke()
}

for (let i = 0; i < rows; i++) {
  this.ctx.beginPath()
  this.ctx.moveTo(0, i * gridSize)
  this.ctx.lineTo(this.canvas.width, i * gridSize)
  this.ctx.stroke()
}
```

}

/**

- Desenha as barras
  */
  drawBeams() {
  this.structure.beams.forEach((beam) => {
  const p1 = this.worldToScreen(beam.startNode.x, beam.startNode.y)
  const p2 = this.worldToScreen(beam.endNode.x, beam.endNode.y)
  
  this.ctx.strokeStyle = Constants.COLORS.beam
  this.ctx.lineWidth = Constants.CANVAS.beamWidth
  
  this.ctx.beginPath()
  this.ctx.moveTo(p1.x, p1.y)
  this.ctx.lineTo(p2.x, p2.y)
  this.ctx.stroke()
  
  // Linha espessa se selecionada
  if (beam === window.app?.selectedBeam) {
  this.ctx.strokeStyle = Constants.COLORS.secondary
  this.ctx.lineWidth = Constants.CANVAS.beamWidth + 2
  this.ctx.beginPath()
  this.ctx.moveTo(p1.x, p1.y)
  this.ctx.lineTo(p2.x, p2.y)
  this.ctx.stroke()
  }
  
  // ID da barra
  const midpoint = beam.getMidpoint()
  const screenMid = this.worldToScreen(midpoint.x, midpoint.y)
  this.ctx.fillStyle = Constants.COLORS.textSecondary
  this.ctx.font = ‘11px Arial’
  this.ctx.fillText(`B${beam.id}`, screenMid.x + 10, screenMid.y - 10)
  })
  }

/**

- Desenha os nós
  */
  drawNodes() {
  const radius = Constants.CANVAS.nodeRadius

```
this.structure.nodes.forEach((node) => {
  const p = this.worldToScreen(node.x, node.y)

  // Nó
  this.ctx.fillStyle = Constants.COLORS.node
  this.ctx.strokeStyle = Constants.COLORS.primaryDark
  this.ctx.lineWidth = 2

  this.ctx.beginPath()
  this.ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI)
  this.ctx.fill()
  this.ctx.stroke()

  // Destaque se selecionado
  if (node === window.app?.selectedNode) {
    this.ctx.strokeStyle = Constants.COLORS.secondary
    this.ctx.lineWidth = 3
    this.ctx.beginPath()
    this.ctx.arc(p.x, p.y, radius + 4, 0, 2 * Math.PI)
    this.ctx.stroke()
  }

  // Label do nó
  if (this.showCoordinates) {
    this.ctx.fillStyle = Constants.COLORS.text
    this.ctx.font = 'bold 12px Arial'
    this.ctx.fillText(`N${node.id}`, p.x + 12, p.y - 8)
  }
})
```

}

/**

- Desenha os apoios
  */
  drawSupports() {
  this.structure.supports.forEach((support) => {
  const p = this.worldToScreen(support.node.x, support.node.y)
  this.drawSupportSymbol(p.x, p.y, support.type)
  })
  }

/**

- Desenha símbolo de apoio
  */
  drawSupportSymbol(x, y, type) {
  const size = Constants.CANVAS.supportSize
  this.ctx.fillStyle = Constants.COLORS.danger
  this.ctx.strokeStyle = Constants.COLORS.danger
  this.ctx.lineWidth = 2

```
switch (type) {
  case 'pinned': // Círculo com triângulo
    this.ctx.beginPath()
    this.ctx.arc(x, y, size / 2, 0, 2 * Math.PI)
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.moveTo(x - size, y + size)
    this.ctx.lineTo(x + size, y + size)
    this.ctx.lineTo(x, y - size)
    this.ctx.closePath()
    this.ctx.fill()
    break

  case 'fixed': // Quadrado hachureado
    this.ctx.fillRect(x - size / 2, y - size / 2, size, size)

    this.ctx.strokeStyle = Constants.COLORS.surface
    this.ctx.lineWidth = 1
    for (let i = -size; i < size; i += 4) {
      this.ctx.beginPath()
      this.ctx.moveTo(x - size / 2 + i, y - size / 2)
      this.ctx.lineTo(x - size / 2 + i + size, y + size / 2)
      this.ctx.stroke()
    }
    break

  case 'roller': // Círculo com duas linhas
    this.ctx.beginPath()
    this.ctx.arc(x, y, size / 2, 0, 2 * Math.PI)
    this.ctx.fill()

    this.ctx.strokeStyle = Constants.COLORS.danger
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.moveTo(x - size, y + size)
    this.ctx.lineTo(x + size, y + size)
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.moveTo(x - size - 4, y + size + 6)
    this.ctx.lineTo(x + size + 4, y + size + 6)
    this.ctx.stroke()
    break
}
```

}

/**

- Desenha as cargas
  */
  drawLoads() {
  this.structure.loads.forEach((load) => {
  const beam = this.structure.beams.find((b) => b.loads.includes(load))
  if (!beam) return
  
  const length = beam.getLength()
  const t = load.position / length
  
  const p1 = this.worldToScreen(beam.startNode.x, beam.startNode.y)
  const p2 = this.worldToScreen(beam.endNode.x, beam.endNode.y)
  
  const x = p1.x + (p2.x - p1.x) * t
  const y = p1.y + (p2.y - p1.y) * t
  
  this.drawLoadArrow(x, y, load)
  })
  }

/**

- Desenha uma seta de carga
  */
  drawLoadArrow(x, y, load) {
  const rad = load.direction * (Math.PI / 180)
  const length = 40 * (Math.min(Math.abs(load.magnitude), 20) / 10)

```
const endX = x + Math.cos(rad) * length
const endY = y + Math.sin(rad) * length

this.ctx.strokeStyle = Constants.COLORS.load
this.ctx.lineWidth = 2.5
this.ctx.beginPath()
this.ctx.moveTo(x, y)
this.ctx.lineTo(endX, endY)
this.ctx.stroke()

// Ponta de seta
const headlen = Constants.CANVAS.arrowHeadLength
const angle = Math.atan2(endY - y, endX - x)

this.ctx.fillStyle = Constants.COLORS.load
this.ctx.beginPath()
this.ctx.moveTo(endX, endY)
this.ctx.lineTo(
  endX - headlen * Math.cos(angle - Constants.CANVAS.arrowHeadAngle),
  endY - headlen * Math.sin(angle - Constants.CANVAS.arrowHeadAngle)
)
this.ctx.lineTo(
  endX - headlen * Math.cos(angle + Constants.CANVAS.arrowHeadAngle),
  endY - headlen * Math.sin(angle + Constants.CANVAS.arrowHeadAngle)
)
this.ctx.closePath()
this.ctx.fill()

// Label
this.ctx.fillStyle = Constants.COLORS.load
this.ctx.font = 'bold 11px Arial'
this.ctx.fillText(`${load.magnitude.toFixed(1)}`, x + 15, y - 15)
```

}

/**

- Desenha os diagramas de esforços
  */
  drawDiagrams() {
  if (!this.structure.isAnalyzed) return

```
this.structure.beams.forEach((beam) => {
  if (this.diagramsToShow.M) this.drawDiagram(beam, 'M')
  if (this.diagramsToShow.V) this.drawDiagram(beam, 'V')
  if (this.diagramsToShow.N) this.drawDiagram(beam, 'N')
})
```

}

/**

- Desenha um diagrama de esforço
  */
  drawDiagram(beam, type) {
  const forces = beam.internalForces[type]
  if (!forces || forces.length === 0) return

```
const p1 = this.worldToScreen(beam.startNode.x, beam.startNode.y)
const p2 = this.worldToScreen(beam.endNode.x, beam.endNode.y)

const maxForce = Math.max(...forces.map((f) => Math.abs(f))) || 1
const scale = 60 / maxForce

const colors = {
  N: Constants.COLORS.diagramN,
  V: Constants.COLORS.diagramV,
  M: Constants.COLORS.diagramM,
  T: Constants.COLORS.diagramT
}

this.ctx.strokeStyle = colors[type]
this.ctx.lineWidth = 2
this.ctx.beginPath()

forces.forEach((force, idx) => {
  const t = idx / (forces.length - 1)
  const x = p1.x + (p2.x - p1.x) * t
  const y = p1.y + (p2.y - p1.y) * t
  const offset = force * scale * 0.3

  if (idx === 0) {
    this.ctx.moveTo(x, y - offset)
  } else {
    this.ctx.lineTo(x, y - offset)
  }
})

this.ctx.stroke()

// Preencher diagrama de momento
if (type === 'M') {
  this.ctx.fillStyle = `${colors[type]}20`
  this.ctx.beginPath()

  forces.forEach((force, idx) => {
    const t = idx / (forces.length - 1)
    const x = p1.x + (p2.x - p1.x) * t
    const y = p1.y + (p2.y - p1.y) * t
    const offset = force * scale * 0.3

    if (idx === 0) {
      this.ctx.moveTo(x, y)
    }
    this.ctx.lineTo(x, y - offset)
  })

  this.ctx.lineTo(p2.x, p2.y)
  this.ctx.closePath()
  this.ctx.fill()
}
```

}

/**

- Converte coordenada mundo para tela
  */
  worldToScreen(x, y) {
  return {
  x: x * this.scale + this.offsetX,
  y: this.offsetY - y * this.scale
  }
  }

/**

- Converte coordenada tela para mundo
  */
  screenToWorld(x, y) {
  return {
  x: (x - this.offsetX) / this.scale,
  y: (this.offsetY - y) / this.scale
  }
  }

/**

- Define a escala
  */
  setScale(scale) {
  this.scale = scale
  this.render()
  }

/**

- Define diagrama a mostrar
  */
  setDiagramVisibility(type, visible) {
  if (this.diagramsToShow.hasOwnProperty(type)) {
  this.diagramsToShow[type] = visible
  this.render()
  }
  }
  }