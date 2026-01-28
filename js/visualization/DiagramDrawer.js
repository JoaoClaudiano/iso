/**

- @class DiagramDrawer
- @description Desenha diagramas de esforços no canvas
  */
  class DiagramDrawer {
  /**
  - Cria um novo desenhador de diagramas
  - @param {CanvasRenderer} renderer - Renderizador canvas
    */
    constructor(renderer) {
    this.renderer = renderer
    this.ctx = renderer.ctx
    this.scale = 1
    this.diagramScale = 0.3
    this.showValues = true
    this.lineWidth = 2
    this.fillAlpha = 0.2
    }

/**

- Desenha todos os diagramas ativos
- @param {Array<Beam>} beams - Barras a desenhar
- @param {Object} diagramsToShow - Diagramas ativos {N, V, M, T, deformed}
  */
  drawAllDiagrams(beams, diagramsToShow) {
  if (!beams || beams.length === 0) return

```
beams.forEach(beam => {
  if (diagramsToShow.N) this.drawNormalDiagram(beam)
  if (diagramsToShow.V) this.drawShearDiagram(beam)
  if (diagramsToShow.M) this.drawMomentDiagram(beam)
  if (diagramsToShow.T) this.drawTorsionDiagram(beam)
})

if (diagramsToShow.deformed) {
  this.drawDeformedShape(beams)
}
```

}

/**

- Desenha diagrama de esforço normal
- @param {Beam} beam - Barra
  */
  drawNormalDiagram(beam) {
  const forces = beam.internalForces.N
  if (!forces || forces.length === 0) return

```
const p1 = this.renderer.worldToScreen(beam.startNode.x, beam.startNode.y)
const p2 = this.renderer.worldToScreen(beam.endNode.x, beam.endNode.y)

this._drawDiagramBase(p1, p2, forces, Constants.COLORS.diagramN, 'N')
```

}

/**

- Desenha diagrama de esforço cortante
- @param {Beam} beam - Barra
  */
  drawShearDiagram(beam) {
  const forces = beam.internalForces.V
  if (!forces || forces.length === 0) return

```
const p1 = this.renderer.worldToScreen(beam.startNode.x, beam.startNode.y)
const p2 = this.renderer.worldToScreen(beam.endNode.x, beam.endNode.y)

this._drawDiagramBase(p1, p2, forces, Constants.COLORS.diagramV, 'V')
```

}

/**

- Desenha diagrama de momento fletor
- @param {Beam} beam - Barra
  */
  drawMomentDiagram(beam) {
  const forces = beam.internalForces.M
  if (!forces || forces.length === 0) return

```
const p1 = this.renderer.worldToScreen(beam.startNode.x, beam.startNode.y)
const p2 = this.renderer.worldToScreen(beam.endNode.x, beam.endNode.y)

this._drawDiagramBase(p1, p2, forces, Constants.COLORS.diagramM, 'M')
```

}

/**

- Desenha diagrama de torção
- @param {Beam} beam - Barra
  */
  drawTorsionDiagram(beam) {
  const forces = beam.internalForces.T
  if (!forces || forces.length === 0) return

```
const p1 = this.renderer.worldToScreen(beam.startNode.x, beam.startNode.y)
const p2 = this.renderer.worldToScreen(beam.endNode.x, beam.endNode.y)

this._drawDiagramBase(p1, p2, forces, Constants.COLORS.diagramT, 'T')
```

}

/**

- Base para desenhar diagrama (método privado)
- @private
  */
  _drawDiagramBase(p1, p2, forces, color, type) {
  const maxForce = Math.max(…forces.map(f => Math.abs(f))) || 1
  const scale = 60 / maxForce

```
// Preencher diagrama
this.ctx.fillStyle = `${color}33` // 20% de opacidade
this.ctx.beginPath()
this.ctx.moveTo(p1.x, p1.y)

forces.forEach((force, idx) => {
  const t = idx / (forces.length - 1)
  const x = p1.x + (p2.x - p1.x) * t
  const y = p1.y + (p2.y - p1.y) * t
  const offset = force * scale * this.diagramScale

  this.ctx.lineTo(x, y - offset)
})

this.ctx.lineTo(p2.x, p2.y)
this.ctx.closePath()
this.ctx.fill()

// Linha do diagrama
this.ctx.strokeStyle = color
this.ctx.lineWidth = this.lineWidth
this.ctx.beginPath()

forces.forEach((force, idx) => {
  const t = idx / (forces.length - 1)
  const x = p1.x + (p2.x - p1.x) * t
  const y = p1.y + (p2.y - p1.y) * t
  const offset = force * scale * this.diagramScale

  if (idx === 0) {
    this.ctx.moveTo(x, y - offset)
  } else {
    this.ctx.lineTo(x, y - offset)
  }
})

this.ctx.stroke()

// Linha de base
this.ctx.strokeStyle = `${color}99`
this.ctx.lineWidth = 1
this.ctx.setLineDash([5, 5])
this.ctx.beginPath()
this.ctx.moveTo(p1.x, p1.y)
this.ctx.lineTo(p2.x, p2.y)
this.ctx.stroke()
this.ctx.setLineDash([])

// Valores extremos
if (this.showValues) {
  const maxF = beam.getMaxForce(type)
  const minF = beam.getMinForce(type)

  if (maxF && maxF.index >= 0) {
    const t = maxF.index / (forces.length - 1)
    const x = p1.x + (p2.x - p1.x) * t
    const y = p1.y + (p2.y - p1.y) * t
    const offset = maxF.value * scale * this.diagramScale

    this._drawValue(x, y - offset - 15, maxF.value.toFixed(2), color)
  }

  if (minF && minF.index >= 0) {
    const t = minF.index / (forces.length - 1)
    const x = p1.x + (p2.x - p1.x) * t
    const y = p1.y + (p2.y - p1.y) * t
    const offset = minF.value * scale * this.diagramScale

    this._drawValue(x, y - offset + 15, minF.value.toFixed(2), color)
  }
}
```

}

/**

- Desenha valor de esforço
- @private
  */
  _drawValue(x, y, value, color) {
  this.ctx.fillStyle = color
  this.ctx.font = ‘bold 11px Arial’
  this.ctx.textAlign = ‘center’
  this.ctx.fillText(value, x, y)
  this.ctx.textAlign = ‘start’
  }

/**

- Desenha forma deformada da estrutura
- @param {Array<Beam>} beams - Barras
  */
  drawDeformedShape(beams) {
  if (!beams || beams.length === 0) return

```
this.ctx.strokeStyle = Constants.COLORS.secondary
this.ctx.lineWidth = 2
this.ctx.setLineDash([3, 3])

beams.forEach(beam => {
  const p1 = this.renderer.worldToScreen(beam.startNode.x, beam.startNode.y)
  const p2 = this.renderer.worldToScreen(beam.endNode.x, beam.endNode.y)

  // Aplicar deslocamento (amplificado para visualização)
  const deform1 = beam.startNode.displacements
  const deform2 = beam.endNode.displacements

  const deformScale = 100 // Amplificação para visualizar
  const p1Def = {
    x: p1.x + deform1.dx * deformScale,
    y: p1.y - deform1.dy * deformScale
  }
  const p2Def = {
    x: p2.x + deform2.dx * deformScale,
    y: p2.y - deform2.dy * deformScale
  }

  this.ctx.beginPath()
  this.ctx.moveTo(p1Def.x, p1Def.y)
  this.ctx.lineTo(p2Def.x, p2Def.y)
  this.ctx.stroke()

  // Círculo nos nós deformados
  this.ctx.fillStyle = Constants.COLORS.secondary
  this.ctx.beginPath()
  this.ctx.arc(p1Def.x, p1Def.y, 4, 0, 2 * Math.PI)
  this.ctx.fill()
  this.ctx.beginPath()
  this.ctx.arc(p2Def.x, p2Def.y, 4, 0, 2 * Math.PI)
  this.ctx.fill()
})

this.ctx.setLineDash([])
```

}

/**

- Desenha escala do diagrama
- @param {number} maxForce - Força máxima
- @param {string} unit - Unidade (kN ou kN·m)
  */
  drawDiagramScale(maxForce, unit) {
  const x = 20
  const y = this.renderer.canvas.height - 40

```
// Fundo
this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
this.ctx.fillRect(x - 5, y - 50, 150, 60)
this.ctx.strokeStyle = Constants.COLORS.border
this.ctx.lineWidth = 1
this.ctx.strokeRect(x - 5, y - 50, 150, 60)

// Texto
this.ctx.fillStyle = Constants.COLORS.text
this.ctx.font = 'bold 12px Arial'
this.ctx.fillText('Escala Diagrama', x, y - 30)

this.ctx.font = '11px Arial'
this.ctx.fillText(`Max: ${maxForce.toFixed(2)} ${unit}`, x, y - 10)
this.ctx.fillText(`Pixels: 60`, x, y + 10)
```

}

/**

- Define escala de visualização
- @param {number} scale - Escala (0.1 a 2.0)
  */
  setDiagramScale(scale) {
  this.diagramScale = Math.max(0.1, Math.min(2.0, scale))
  }

/**

- Alterna visualização de valores
- @param {boolean} show - Mostrar ou não
  */
  setShowValues(show) {
  this.showValues = show
  }

/**

- Define largura de linha
- @param {number} width - Largura em pixels
  */
  setLineWidth(width) {
  this.lineWidth = Math.max(1, Math.min(5, width))
  }

/**

- Desenha legenda do diagrama
- @param {string} type - Tipo (N, V, M, T)
  */
  drawLegend(type) {
  const x = this.renderer.canvas.width - 180
  const y = 20

```
const legendData = {
  N: { name: 'Esforço Normal', unit: 'kN', color: Constants.COLORS.diagramN },
  V: { name: 'Cortante', unit: 'kN', color: Constants.COLORS.diagramV },
  M: { name: 'Momento Fletor', unit: 'kN·m', color: Constants.COLORS.diagramM },
  T: { name: 'Torção', unit: 'kN·m', color: Constants.COLORS.diagramT }
}

const data = legendData[type]
if (!data) return

// Fundo
this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
this.ctx.fillRect(x - 5, y - 5, 170, 50)
this.ctx.strokeStyle = Constants.COLORS.border
this.ctx.lineWidth = 1
this.ctx.strokeRect(x - 5, y - 5, 170, 50)

// Cor
this.ctx.fillStyle = data.color
this.ctx.fillRect(x, y, 20, 20)

// Texto
this.ctx.fillStyle = Constants.COLORS.text
this.ctx.font = 'bold 12px Arial'
this.ctx.fillText(data.name, x + 30, y + 15)

this.ctx.font = '10px Arial'
this.ctx.fillText(`(${data.unit})`, x + 30, y + 30)
```

}

/**

- Obtem máximo absoluto de um tipo de esforço
- @param {Array<Beam>} beams
- @param {string} type
- @returns {number}
  */
  getMaxForceValue(beams, type) {
  let max = 0

```
beams.forEach(beam => {
  const forces = beam.internalForces[type] || []
  forces.forEach(force => {
    max = Math.max(max, Math.abs(force))
  })
})

return max
```

}

/**

- Desenha linhas de influência (simplificado)
- @param {Beam} beam
  */
  drawInfluenceLine(beam) {
  const p1 = this.renderer.worldToScreen(beam.startNode.x, beam.startNode.y)
  const p2 = this.renderer.worldToScreen(beam.endNode.x, beam.endNode.y)

```
this.ctx.strokeStyle = Constants.COLORS.warning
this.ctx.lineWidth = 1.5
this.ctx.setLineDash([2, 2])

// Parabola simplificada
this.ctx.beginPath()
for (let i = 0; i <= 100; i++) {
  const t = i / 100
  const x = p1.x + (p2.x - p1.x) * t
  const y = p1.y + (p2.y - p1.y) * t
  const offset = -40 * t * (1 - t) // Parábola

  if (i === 0) {
    this.ctx.moveTo(x, y + offset)
  } else {
    this.ctx.lineTo(x, y + offset)
  }
}

this.ctx.stroke()
this.ctx.setLineDash([])
```

}

/**

- Limpa todos os diagramas
  */
  clear() {
  // Não precisa fazer nada, o canvas já é limpo
  }

/**

- Exporta diagrama como imagem
- @returns {string} Data URL da imagem
  */
  exportDiagramAsImage() {
  return this.renderer.canvas.toDataURL(‘image/png’)
  }
  }