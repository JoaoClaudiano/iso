/**

- @fileoverview Aplicação principal - Isostática Lab
  */

class IsostatikaApp {
constructor() {
this.structure = new Structure(‘beam’)
this.analyzer = null
this.renderer = null

```
this.currentTool = 'select'
this.selectedNode = null
this.selectedBeam = null
this.selectedSupport = null
this.isDragging = false
this.draggedNode = null

this.init()
```

}

/**

- Inicializa a aplicação
  */
  init() {
  console.log(‘Inicializando Isostática Lab…’)

```
this.setupUI()
this.setupCanvas()
this.attachEventListeners()
this.loadExamples()

console.log('✓ Aplicação inicializada com sucesso')
```

}

/**

- Configura a interface de usuário
  */
  setupUI() {
  // Botões de tipo de estrutura
  document.querySelectorAll(’.btn-structure’).forEach((btn) => {
  btn.addEventListener(‘click’, (e) => this.onStructureTypeChange(e))
  })

```
// Botões de ferramentas
document.querySelectorAll('.btn-tool').forEach((btn) => {
  btn.addEventListener('click', (e) => this.onToolChange(e))
})

// Botões de apoio
document.querySelectorAll('.btn-support').forEach((btn) => {
  btn.addEventListener('click', (e) => this.onSupportSelect(e))
})

// Botões de ações
document.getElementById('btn-calculate').addEventListener('click', () => this.analyze())
document.getElementById('btn-clear').addEventListener('click', () => this.clear())
document.getElementById('btn-export').addEventListener('click', () => this.exportResults())

// Botões de diagramas
document.querySelectorAll('.btn-diagram').forEach((btn) => {
  btn.addEventListener('click', (e) => this.onDiagramToggle(e))
})

// Botão de adicionar carga
document.getElementById('btn-add-load').addEventListener('click', () => this.addLoadFromUI())

// Exemplos
document.getElementById('examples-select').addEventListener('change', (e) => {
  if (e.target.value) {
    this.loadExample(e.target.value)
  }
})

// Configurações
document.getElementById('grid-toggle').addEventListener('change', () => {
  if (this.renderer) this.renderer.render()
})

document.getElementById('scale-input').addEventListener('change', (e) => {
  if (this.renderer) this.renderer.setScale(parseInt(e.target.value))
})

// Fechar modais
document.querySelectorAll('.modal-close').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.modal').classList.add('hidden')
  })
})

// Abas de resultados
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => this.switchResultTab(e))
})

// Botão de ajuda
document.getElementById('btn-help').addEventListener('click', () => {
  document.getElementById('tutorial-modal').classList.remove('hidden')
})

// Atualizar informações da estrutura
this.updateStructureInfo()
```

}

/**

- Configura o canvas
  */
  setupCanvas() {
  const canvas = document.getElementById(‘canvas’)
  if (!canvas) {
  console.error(‘Canvas não encontrado’)
  return
  }

```
this.renderer = new CanvasRenderer(canvas, this.structure)
this.renderer.render()
```

}

/**

- Anexa event listeners ao canvas
  */
  attachEventListeners() {
  const canvas = document.getElementById(‘canvas’)
  if (!canvas) return

```
const rect = canvas.getBoundingClientRect()

canvas.addEventListener('mousedown', (e) => this.onCanvasMouseDown(e))
canvas.addEventListener('mousemove', (e) => this.onCanvasMouseMove(e))
canvas.addEventListener('mouseup', (e) => this.onCanvasMouseUp(e))
canvas.addEventListener('contextmenu', (e) => e.preventDefault())

// Atualizar posição do cursor
canvas.addEventListener('mousemove', (e) => {
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const world = this.renderer.screenToWorld(x, y)
  document.getElementById('cursor-pos').textContent = `X: ${world.x.toFixed(2)} m | Y: ${world.y.toFixed(2)} m`
})
```

}

/**

- Mouse down no canvas
  */
  onCanvasMouseDown(e) {
  const rect = this.renderer.canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const worldPos = this.renderer.screenToWorld(x, y)

```
const clickedNode = this.getNodeAt(worldPos.x, worldPos.y, 0.3)
const clickedBeam = this.getBeamAt(worldPos.x, worldPos.y, 0.3)

if (this.currentTool === 'select') {
  if (clickedNode) {
    this.selectedNode = clickedNode
  } else if (clickedBeam) {
    this.selectedBeam = clickedBeam
  } else {
    this.deselectAll()
  }
} else if (this.currentTool === 'node') {
  // Verificar se já existe nó ali
  if (!clickedNode) {
    const newNode = this.structure.addNode(worldPos.x, worldPos.y)
    this.selectedNode = newNode
  }
} else if (this.currentTool === 'beam') {
  if (clickedNode) {
    if (!this.selectedNode) {
      this.selectedNode = clickedNode
    } else if (this.selectedNode !== clickedNode) {
      try {
        this.structure.addBeam(this.selectedNode.id, clickedNode.id)
        this.selectedNode = null
      } catch (error) {
        alert('Erro ao adicionar barra: ' + error.message)
      }
    }
  }
} else if (this.currentTool === 'delete') {
  if (clickedNode) {
    this.structure.removeNode(clickedNode.id)
    this.selectedNode = null
  } else if (clickedBeam) {
    this.structure.removeBeam(clickedBeam.id)
    this.selectedBeam = null
  }
}

// Preparar para arrastar
if (this.currentTool === 'select' && clickedNode) {
  this.isDragging = true
  this.draggedNode = clickedNode
}

this.updateStructureInfo()
this.renderer.render()
```

}

/**

- Mouse move no canvas
  */
  onCanvasMouseMove(e) {
  if (!this.isDragging || !this.draggedNode) return

```
const rect = this.renderer.canvas.getBoundingClientRect()
const x = e.clientX - rect.left
const y = e.clientY - rect.top
const worldPos = this.renderer.screenToWorld(x, y)

this.draggedNode.setPosition(worldPos.x, worldPos.y)
this.renderer.render()
```

}

/**

- Mouse up no canvas
  */
  onCanvasMouseUp() {
  this.isDragging = false
  this.draggedNode = null
  }

/**

- Mudança de tipo de estrutura
  */
  onStructureTypeChange(e) {
  const type = e.target.dataset.type
  if (this.structure.getNodeCount() > 0) {
  if (!confirm(‘Isso limpará a estrutura atual. Deseja continuar?’)) {
  return
  }
  }

```
this.structure.clear()
this.structure.type = type
this.deselectAll()
this.renderer.render()
this.updateStructureInfo()
```

}

/**

- Mudança de ferramenta
  */
  onToolChange(e) {
  const tool = e.target.dataset.tool
  this.currentTool = tool

```
// Atualizar botões
document.querySelectorAll('.btn-tool').forEach((btn) => {
  btn.classList.remove('active')
})
e.target.classList.add('active')

// Desselecionar na mudança de ferramenta
if (tool !== 'select') {
  this.deselectAll()
  this.renderer.render()
}
```

}

/**

- Seleção de apoio
  */
  onSupportSelect(e) {
  const type = e.target.dataset.type

```
if (!this.selectedNode) {
  alert('Selecione um nó primeiro')
  return
}

try {
  this.structure.addSupport(this.selectedNode.id, type)
  this.selectedNode = null
  this.updateStructureInfo()
  this.renderer.render()
} catch (error) {
  alert('Erro ao adicionar apoio: ' + error.message)
}
```

}

/**

- Alterna visibilidade de diagrama
  */
  onDiagramToggle(e) {
  e.target.classList.toggle(‘active’)
  this.renderer.render()
  }

/**

- Adiciona carga da UI
  */
  addLoadFromUI() {
  if (!this.selectedBeam) {
  alert(‘Selecione uma barra primeiro’)
  return
  }

```
const type = document.getElementById('load-type').value
const magnitude = parseFloat(document.getElementById('load-magnitude').value)
const position = parseFloat(document.getElementById('load-position').value)
const direction = parseFloat(document.getElementById('load-direction').value)

if (!magnitude || isNaN(magnitude)) {
  alert('Magnitude inválida')
  return
}

try {
  const load = new Load(type, magnitude, position, direction)
  this.structure.addLoad(this.selectedBeam.id, load)
  this.updateStructureInfo()
  this.renderer.render()
} catch (error) {
  alert('Erro ao adicionar carga: ' + error.message)
}
```

}

/**

- Realiza a análise da estrutura
  */
  analyze() {
  try {
  // Validar estrutura
  const validation = this.structure.validate()
  if (!validation.valid) {
  alert(‘Estrutura inválida:\n’ + validation.errors.join(’\n’))
  return
  }
  
  // Criar e executar analisador
  if (this.structure.type === ‘beam’) {
  this.analyzer = new BeamAnalyzer(this.structure)
  } else {
  alert(‘Tipo de análise ainda não implementado’)
  return
  }
  
  const results = this.analyzer.analyze()
  
  // Atualizar interface
  this.displayResults(results)
  this.renderer.render()
  
  alert(‘Análise realizada com sucesso!’)
  } catch (error) {
  alert(’Erro na análise: ’ + error.message)
  console.error(error)
  }
  }

/**

- Exibe os resultados da análise
  */
  displayResults(results) {
  const resultsPanel = document.getElementById(‘results-content’)
  let html = ‘’

```
// Reações
html += '<div class="result-section">'
html += '<h4>Reações de Apoio</h4>'

Object.entries(results.reactions).forEach(([nodeId, reaction]) => {
  const node = this.structure.getNode(parseInt(nodeId))
  if (node && node.isSupported()) {
    html += `<div class="result-item">`
    html += `<span class="result-label">Nó ${nodeId}:</span>`
    html += `<span class="result-value">`
    html += `Fy=${reaction.fy.toFixed(2)} kN`
    html += `</span>`
    html += `</div>`
  }
})

html += '</div>'

// Esforços extremos
html += '<div class="result-section">'
html += '<h4>Esforços Extremos</h4>'

this.structure.beams.forEach((beam) => {
  const maxM = beam.getMaxForce('M')
  const minM = beam.getMinForce('M')

  html += `<div class="result-item">`
  html += `<span class="result-label">Barra ${beam.id}:</span>`
  html += `<span class="result-value">`
  html += `M(max)=${maxM.value.toFixed(2)} | M(min)=${minM.value.toFixed(2)}`
  html += `</span>`
  html += `</div>`
})

html += '</div>'

resultsPanel.innerHTML = html
```

}

/**

- Alterna abas de resultado
  */
  switchResultTab(e) {
  document.querySelectorAll(’.tab-btn’).forEach((btn) => {
  btn.classList.remove(‘active’)
  })
  document.querySelectorAll(’.tab-content’).forEach((tab) => {
  tab.classList.remove(‘active’)
  })

```
e.target.classList.add('active')
const tabName = e.target.dataset.tab
document.getElementById(`tab-${tabName}`).classList.add('active')
```

}

/**

- Exporta os resultados
  */
  exportResults() {
  if (!this.structure.isAnalyzed) {
  alert(‘Realize a análise primeiro’)
  return
  }

```
const data = {
  structure: this.structure.toJSON(),
  results: this.structure.results
}

const json = JSON.stringify(data, null, 2)
const blob = new Blob([json], { type: 'application/json' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `estrutura_${new Date().getTime()}.json`
a.click()
```

}

/**

- Carrega exemplos pré-configurados
  */
  loadExamples() {
  // Exemplo 1: Viga com carga pontual
  window.examples = {
  ‘beam-point’: {
  type: ‘beam’,
  nodes: [[0, 0], [5, 0], [10, 0]],
  beams: [[0, 1], [1, 2]],
  supports: [[0, ‘pinned’], [2, ‘roller’]],
  loads: [[0, { type: ‘point’, magnitude: 10, position: 2.5, direction: -90 }]]
  },
  ‘beam-distributed’: {
  type: ‘beam’,
  nodes: [[0, 0], [5, 0]],
  beams: [[0, 1]],
  supports: [[0, ‘fixed’]],
  loads: [[0, { type: ‘distributed’, magnitude: 5, position: 0, direction: -90 }]]
  }
  }
  }

/**

- Carrega um exemplo
  */
  loadExample(exampleName) {
  const example = window.examples[exampleName]
  if (!example) {
  alert(‘Exemplo não encontrado’)
  return
  }

```
this.structure.clear()
this.structure.type = example.type

// Adicionar nós
const nodeMap = {}
example.nodes.forEach((pos, idx) => {
  const node = this.structure.addNode(pos[0], pos[1])
  nodeMap[idx] = node.id
})

// Adicionar barras
example.beams.forEach((beamDef) => {
  this.structure.addBeam(nodeMap[beamDef[0]], nodeMap[beamDef[1]])
})

// Adicionar apoios
example.supports.forEach((supDef) => {
  this.structure.addSupport(nodeMap[supDef[0]], supDef[1])
})

// Adicionar cargas
example.loads.forEach((loadDef) => {
  const beamIdx = loadDef[0]
  const beam = this.structure.beams[beamIdx]
  if (beam) {
    const loadData = loadDef[1]
    const load = new Load(
      loadData.type,
      loadData.magnitude,
      loadData.position,
      loadData.direction
    )
    beam.addLoad(load)
    this.structure.loads.push(load)
  }
})

this.deselectAll()
this.updateStructureInfo()
this.renderer.render()
```

}

/**

- Limpa a estrutura
  */
  clear() {
  if (confirm(‘Deseja limpar a estrutura?’)) {
  this.structure.clear()
  this.deselectAll()
  this.updateStructureInfo()
  this.renderer.render()
  }
  }

/**

- Atualiza informações da estrutura na UI
  */
  updateStructureInfo() {
  const info = this.structure.getSummary()
  document.getElementById(‘structure-info’).textContent =
  `Nós: ${info.nodeCount} | Barras: ${info.beamCount} | Apoios: ${info.supportCount}`
  }

/**

- Obtém nó em uma posição
  */
  getNodeAt(x, y, threshold = 0.5) {
  return this.structure.nodes.find((node) => {
  const dx = node.x - x
  const dy = node.y - y
  return Math.sqrt(dx * dx + dy * dy) < threshold
  })
  }

/**

- Obtém barra em uma posição
  */
  getBeamAt(x, y, threshold = 0.3) {
  return this.structure.beams.find((beam) => {
  return MathUtils.distanceToLine(
  { x, y },
  { x: beam.startNode.x, y: beam.startNode.y },
  { x: beam.endNode.x, y: beam.endNode.y }
  ) < threshold
  })
  }

/**

- Deseleciona tudo
  */
  deselectAll() {
  this.selectedNode = null
  this.selectedBeam = null
  this.selectedSupport = null
  }
  }

// Inicializar aplicação quando o DOM estiver pronto
document.addEventListener(‘DOMContentLoaded’, () => {
window.app = new IsostatikaApp()
})