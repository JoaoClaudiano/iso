/**

- @class Legend
- @description Sistema de legendas, escalas e anotações no canvas
  */
  class Legend {
  /**
  - Cria um novo gerenciador de legendas
  - @param {CanvasRenderer} renderer - Renderizador canvas
    */
    constructor(renderer) {
    this.renderer = renderer
    this.ctx = renderer.ctx
    this.scale = 1
    this.visible = true
    this.position = ‘top-right’ // top-right, top-left, bottom-right, bottom-left
    this.padding = 15
    this.fontSize = 11
    }

/**

- Desenha legenda completa
- @param {string} diagramType - Tipo de diagrama (N, V, M, T, none)
- @param {number} maxValue - Valor máximo para escala
  */
  drawLegend(diagramType, maxValue = 0) {
  if (!this.visible) return

```
const items = this.getLegendItems(diagramType)
this._drawLegendBox(items, maxValue)
```

}

/**

- Obtem itens da legenda
- @private
  */
  getLegendItems(diagramType) {
  const items = []

```
// Tipo de diagrama
if (diagramType === 'N') {
  items.push({
    color: Constants.COLORS.diagramN,
    name: 'Normal (N)',
    unit: 'kN'
  })
} else if (diagramType === 'V') {
  items.push({
    color: Constants.COLORS.diagramV,
    name: 'Cortante (V)',
    unit: 'kN'
  })
} else if (diagramType === 'M') {
  items.push({
    color: Constants.COLORS.diagramM,
    name: 'Momento (M)',
    unit: 'kN·m'
  })
} else if (diagramType === 'T') {
  items.push({
    color: Constants.COLORS.diagramT,
    name: 'Torção (T)',
    unit: 'kN·m'
  })
} else {
  // Nenhum diagrama específico
  items.push({
    color: Constants.COLORS.beam,
    name: 'Barra',
    unit: ''
  })
  items.push({
    color: Constants.COLORS.node,
    name: 'Nó',
    unit: ''
  })
  items.push({
    color: Constants.COLORS.support,
    name: 'Apoio',
    unit: ''
  })
  items.push({
    color: Constants.COLORS.load,
    name: 'Carga',
    unit: ''
  })
}

return items
```

}

/**

- Desenha caixa de legenda
- @private
  */
  _drawLegendBox(items, maxValue) {
  const { x, y, width, height } = this._getLegendBox(items, maxValue)

```
// Fundo com sombra
this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
this.ctx.fillRect(x + 2, y + 2, width, height)

// Fundo branco
this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
this.ctx.fillRect(x, y, width, height)

// Borda
this.ctx.strokeStyle = Constants.COLORS.border
this.ctx.lineWidth = 1
this.ctx.strokeRect(x, y, width, height)

// Itens
let currentY = y + this.padding
items.forEach(item => {
  this._drawLegendItem(x, currentY, item)
  currentY += 20
})

// Escala (se houver diagrama)
if (maxValue > 0) {
  currentY += 10
  this._drawScaleInfo(x, currentY, maxValue)
}
```

}

/**

- Desenha item individual da legenda
- @private
  */
  _drawLegendItem(x, y, item) {
  const boxSize = 12
  const spacing = 35

```
// Caixa de cor
this.ctx.fillStyle = item.color
this.ctx.fillRect(x + this.padding, y, boxSize, boxSize)
this.ctx.strokeStyle = Constants.COLORS.border
this.ctx.lineWidth = 0.5
this.ctx.strokeRect(x + this.padding, y, boxSize, boxSize)

// Texto
this.ctx.fillStyle = Constants.COLORS.text
this.ctx.font = `${this.fontSize}px Arial`
this.ctx.fillText(item.name, x + spacing, y + 10)

// Unidade
if (item.unit) {
  this.ctx.fillStyle = Constants.COLORS.textSecondary
  this.ctx.font = `${this.fontSize - 1}px Arial`
  this.ctx.fillText(`(${item.unit})`, x + spacing + 80, y + 10)
}
```

}

/**

- Desenha informação de escala
- @private
  */
  _drawScaleInfo(x, y, maxValue) {
  const padding = this.padding
  const lineWidth = 50
  const pixelsPerUnit = lineWidth / (maxValue || 1)

```
// Linha de escala
this.ctx.strokeStyle = Constants.COLORS.text
this.ctx.lineWidth = 2
this.ctx.beginPath()
this.ctx.moveTo(x + padding, y)
this.ctx.lineTo(x + padding + lineWidth, y)
this.ctx.stroke()

// Marcas
this.ctx.lineWidth = 1
this.ctx.beginPath()
this.ctx.moveTo(x + padding, y - 3)
this.ctx.lineTo(x + padding, y + 3)
this.ctx.stroke()
this.ctx.beginPath()
this.ctx.moveTo(x + padding + lineWidth, y - 3)
this.ctx.lineTo(x + padding + lineWidth, y + 3)
this.ctx.stroke()

// Texto
this.ctx.fillStyle = Constants.COLORS.textSecondary
this.ctx.font = `${this.fontSize - 2}px Arial`
this.ctx.textAlign = 'center'
this.ctx.fillText(`0`, x + padding, y + 15)
this.ctx.fillText(`${maxValue.toFixed(1)}`, x + padding + lineWidth, y + 15)
this.ctx.textAlign = 'left'
```

}

/**

- Calcula dimensões da caixa de legenda
- @private
  */
  _getLegendBox(items, maxValue) {
  const width = 200
  const baseHeight = 20
  const itemHeight = 20
  const scaleHeight = maxValue > 0 ? 25 : 0
  const height = baseHeight + itemHeight * items.length + scaleHeight + this.padding * 2

```
let x, y
const canvas = this.renderer.canvas

switch (this.position) {
  case 'top-left':
    x = this.padding
    y = this.padding
    break
  case 'top-right':
    x = canvas.width - width - this.padding
    y = this.padding
    break
  case 'bottom-left':
    x = this.padding
    y = canvas.height - height - this.padding
    break
  case 'bottom-right':
  default:
    x = canvas.width - width - this.padding
    y = canvas.height - height - this.padding
}

return { x, y, width, height }
```

}

/**

- Define posição da legenda
- @param {string} position - ‘top-left’, ‘top-right’, ‘bottom-left’, ‘bottom-right’
  */
  setPosition(position) {
  const validPositions = [‘top-left’, ‘top-right’, ‘bottom-left’, ‘bottom-right’]
  if (validPositions.includes(position)) {
  this.position = position
  }
  }

/**

- Define visibilidade da legenda
- @param {boolean} visible - Visível ou não
  */
  setVisible(visible) {
  this.visible = visible
  }

/**

- Desenha escala de coordenadas
- @param {number} scaleRatio - Proporção (1:100, 1:50, etc)
  */
  drawCoordinateScale(scaleRatio) {
  const x = 20
  const y = this.renderer.canvas.height - 60

```
// Texto
this.ctx.fillStyle = Constants.COLORS.text
this.ctx.font = 'bold 12px Arial'
this.ctx.fillText('Escala:', x, y)

this.ctx.font = '11px Arial'
this.ctx.fillText(`1:${scaleRatio}`, x, y + 20)

// Linha de escala gráfica
const scaleLength = 50 // pixels
const scaleValue = (scaleLength / this.renderer.scale)

this.ctx.strokeStyle = Constants.COLORS.text
this.ctx.lineWidth = 2
this.ctx.beginPath()
this.ctx.moveTo(x, y + 35)
this.ctx.lineTo(x + scaleLength, y + 35)
this.ctx.stroke()

// Marcas
this.ctx.lineWidth = 1
this.ctx.beginPath()
this.ctx.moveTo(x, y + 32)
this.ctx.lineTo(x, y + 38)
this.ctx.stroke()
this.ctx.beginPath()
this.ctx.moveTo(x + scaleLength, y + 32)
this.ctx.lineTo(x + scaleLength, y + 38)
this.ctx.stroke()

// Valor
this.ctx.font = '10px Arial'
this.ctx.textAlign = 'center'
this.ctx.fillText(`${scaleValue.toFixed(1)}m`, x + scaleLength / 2, y + 50)
this.ctx.textAlign = 'left'
```

}

/**

- Desenha informações da estrutura
- @param {Structure} structure - Estrutura
  */
  drawStructureInfo(structure) {
  const x = 20
  const y = 20

```
// Background
this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
this.ctx.fillRect(x - 5, y - 5, 180, 90)
this.ctx.strokeStyle = Constants.COLORS.border
this.ctx.lineWidth = 1
this.ctx.strokeRect(x - 5, y - 5, 180, 90)

// Texto
this.ctx.fillStyle = Constants.COLORS.text
this.ctx.font = 'bold 12px Arial'
this.ctx.fillText('Informações', x, y + 15)

this.ctx.font = '11px Arial'
this.ctx.fillText(`Nós: ${structure.getNodeCount()}`, x, y + 35)
this.ctx.fillText(`Barras: ${structure.getBeamCount()}`, x, y + 50)
this.ctx.fillText(`Apoios: ${structure.getSupportCount()}`, x, y + 65)

// Estaticidade
const staticity = structure.getStaticDeterminacy()
let status = '✓ Isostática'
if (staticity > 0) {
  status = `⚠ Hiperstática (${staticity}x)`
} else if (staticity < 0) {
  status = `✗ Hipostática`
}

this.ctx.fillStyle = staticity === 0 ? Constants.COLORS.success : Constants.COLORS.warning
this.ctx.fillText(status, x, y + 80)
```

}

/**

- Desenha anotações de valores
- @param {Array<Object>} annotations - Anotações [{x, y, value, unit}]
  */
  drawAnnotations(annotations) {
  if (!annotations || annotations.length === 0) return

```
annotations.forEach(ann => {
  this._drawAnnotation(ann.x, ann.y, ann.value, ann.unit)
})
```

}

/**

- Desenha anotação individual
- @private
  */
  _drawAnnotation(x, y, value, unit = ‘’) {
  // Fundo
  this.ctx.fillStyle = ‘rgba(255, 255, 200, 0.85)’
  this.ctx.fillRect(x - 30, y - 25, 60, 25)
  this.ctx.strokeStyle = Constants.COLORS.warning
  this.ctx.lineWidth = 1
  this.ctx.strokeRect(x - 30, y - 25, 60, 25)

```
// Valor
this.ctx.fillStyle = Constants.COLORS.text
this.ctx.font = 'bold 11px Arial'
this.ctx.textAlign = 'center'
this.ctx.fillText(`${value.toFixed(2)} ${unit}`, x, y - 10)
this.ctx.textAlign = 'left'
```

}

/**

- Desenha seta de referência
- @param {number} x - Posição X
- @param {number} y - Posição Y
- @param {string} label - Rótulo
  */
  drawReferenceArrow(x, y, label) {
  const arrowSize = 15

```
// Linha
this.ctx.strokeStyle = Constants.COLORS.info
this.ctx.lineWidth = 1
this.ctx.beginPath()
this.ctx.moveTo(x, y)
this.ctx.lineTo(x - arrowSize, y - arrowSize)
this.ctx.stroke()

// Ponta
this.ctx.fillStyle = Constants.COLORS.info
this.ctx.beginPath()
this.ctx.moveTo(x - arrowSize, y - arrowSize)
this.ctx.lineTo(x - arrowSize - 5, y - arrowSize + 3)
this.ctx.lineTo(x - arrowSize + 3, y - arrowSize - 5)
this.ctx.closePath()
this.ctx.fill()

// Label
this.ctx.fillStyle = Constants.COLORS.text
this.ctx.font = '10px Arial'
this.ctx.fillText(label, x - arrowSize - 30, y - arrowSize)
```

}

/**

- Define tamanho da fonte
- @param {number} size - Tamanho em pixels
  */
  setFontSize(size) {
  this.fontSize = Math.max(8, Math.min(16, size))
  }

/**

- Define escala geral
- @param {number} scale - Escala (0.5 a 2.0)
  */
  setScale(scale) {
  this.scale = Math.max(0.5, Math.min(2.0, scale))
  }

/**

- Desenha grid de referência (opcional)
- @param {number} spacing - Espaçamento em pixels
  */
  drawReferenceGrid(spacing = 50) {
  this.ctx.strokeStyle = `${Constants.COLORS.border}44`
  this.ctx.lineWidth = 0.5

```
// Linhas verticais
for (let x = 0; x < this.renderer.canvas.width; x += spacing) {
  this.ctx.beginPath()
  this.ctx.moveTo(x, 0)
  this.ctx.lineTo(x, this.renderer.canvas.height)
  this.ctx.stroke()
}

// Linhas horizontais
for (let y = 0; y < this.renderer.canvas.height; y += spacing) {
  this.ctx.beginPath()
  this.ctx.moveTo(0, y)
  this.ctx.lineTo(this.renderer.canvas.width, y)
  this.ctx.stroke()
}
```

}

/**

- Limpa legendas
  */
  clear() {
  // Método para limpeza futura
  }
  }