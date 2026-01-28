/**
 * @class UIManager
 * @description Gerenciador central da interface do usuário
 */
class UIManager {
  /**
   * Cria um novo gerenciador de UI
   * @param {IsostatikaApp} app - Aplicação principal
   */
  constructor(app) {
    this.app = app
    this.currentTool = 'select'
    this.currentSupport = null
    this.toolPanel = new ToolPanel(this)
    this.resultsPanel = new ResultsPanel(this)
    this.isDarkMode = false
  }

  /**
   * Inicializa todos os elementos de UI
   */
  init() {
    this.setupToolPanel()
    this.setupResultsPanel()
    this.setupEventListeners()
    this.updateStatusBar()
  }

  /**
   * Setup do painel de ferramentas
   */
  setupToolPanel() {
    this.toolPanel.init()
  }

  /**
   * Setup do painel de resultados
   */
  setupResultsPanel() {
    this.resultsPanel.init()
  }

  /**
   * Anexa listeners aos elementos
   */
  setupEventListeners() {
    // Menu de estrutura
    document.querySelectorAll('.btn-structure').forEach(btn => {
      btn.addEventListener('click', (e) => this.onStructureChanged(e))
    })

    // Seletor de ferramenta
    document.querySelectorAll('.btn-tool').forEach(btn => {
      btn.addEventListener('click', (e) => this.onToolSelected(e))
    })

    // Seletor de apoio
    document.querySelectorAll('.btn-support').forEach(btn => {
      btn.addEventListener('click', (e) => this.onSupportSelected(e))
    })

    // Botões de ação
    document.getElementById('btn-calculate')?.addEventListener('click', () => {
      this.app.analyze()
      this.showSuccessMessage('Análise realizada com sucesso!')
    })

    document.getElementById('btn-clear')?.addEventListener('click', () => {
      if (confirm('Deseja limpar a estrutura?')) {
        this.app.clear()
        this.showInfoMessage('Estrutura limpa!')
      }
    })

    document.getElementById('btn-export')?.addEventListener('click', () => {
      this.app.exportResults()
      this.showSuccessMessage('Resultados exportados!')
    })

    // Diagrama toggles
    document.querySelectorAll('.btn-diagram').forEach(btn => {
      btn.addEventListener('click', (e) => this.onDiagramToggle(e))
    })

    // Adicionar carga
    document.getElementById('btn-add-load')?.addEventListener('click', () => {
      this.app.addLoadFromUI()
    })

    // Exemplos
    document.getElementById('examples-select')?.addEventListener('change', (e) => {
      if (e.target.value) {
        this.app.loadExample(e.target.value)
        this.showInfoMessage('Exemplo carregado!')
      }
    })

    // Configurações
    document.getElementById('grid-toggle')?.addEventListener('change', () => {
      if (this.app.renderer) this.app.renderer.render()
    })

    document.getElementById('scale-input')?.addEventListener('change', (e) => {
      if (this.app.renderer) {
        this.app.renderer.setScale(parseInt(e.target.value))
      }
    })

    // Help
    document.getElementById('btn-help')?.addEventListener('click', () => {
      this.showTutorial()
    })
  }

  /**
   * Mudança de tipo de estrutura
   */
  onStructureChanged(e) {
    const type = e.target.dataset.type
    this.app.structure.type = type

    // Atualizar botões
    document.querySelectorAll('.btn-structure').forEach(btn => {
      btn.classList.remove('active')
    })
    e.target.classList.add('active')

    this.showInfoMessage(`Tipo de estrutura alterado para: ${type}`)
    this.app.renderer.render()
  }

  /**
   * Seleção de ferramenta
   */
  onToolSelected(e) {
    const tool = e.target.dataset.tool
    this.app.currentTool = tool
    this.currentTool = tool

    // Atualizar botões
    document.querySelectorAll('.btn-tool').forEach(btn => {
      btn.classList.remove('active')
    })
    e.target.classList.add('active')

    this.showInfoMessage(`Ferramenta: ${tool}`)
  }

  /**
   * Seleção de apoio
   */
  onSupportSelected(e) {
    const type = e.target.dataset.type
    this.currentSupport = type

    if (!this.app.selectedNode) {
      this.showWarningMessage('Selecione um nó primeiro!')
      return
    }

    try {
      this.app.structure.addSupport(this.app.selectedNode.id, type)
      this.showSuccessMessage(`Apoio "${type}" adicionado!`)
      this.updateStatusBar()
      this.app.renderer.render()
    } catch (error) {
      this.showErrorMessage(`Erro: ${error.message}`)
    }
  }

  /**
   * Toggle de diagrama
   */
  onDiagramToggle(e) {
    const diagramType = e.target.dataset.diagram
    const isActive = e.target.classList.toggle('active')

    if (this.app.renderer) {
      this.app.renderer.diagramsToShow[diagramType] = isActive
      this.app.renderer.render()
    }
  }

  /**
   * Atualiza barra de status
   */
  updateStatusBar() {
    const info = this.app.structure.getSummary()
    const statusEl = document.getElementById('structure-info')
    if (statusEl) {
      statusEl.textContent = 
        `Nós: ${info.nodeCount} | Barras: ${info.beamCount} | Apoios: ${info.supportCount}`
    }
  }

  /**
   * Mostra mensagem de sucesso
   */
  showSuccessMessage(text) {
    this._showNotification(text, 'success', 3000)
  }

  /**
   * Mostra mensagem de erro
   */
  showErrorMessage(text) {
    this._showNotification(text, 'error', 5000)
  }

  /**
   * Mostra mensagem de aviso
   */
  showWarningMessage(text) {
    this._showNotification(text, 'warning', 3000)
  }

  /**
   * Mostra mensagem de informação
   */
  showInfoMessage(text) {
    this._showNotification(text, 'info', 2000)
  }

  /**
   * Notificação genérica
   * @private
   */
  _showNotification(text, type, duration) {
    // Criar elemento de notificação
    const notif = document.createElement('div')
    notif.className = `notification notification-${type}`
    notif.textContent = text
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${this._getNotificationColor(type)};
      color: white;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 14px;
      font-weight: 600;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `

    document.body.appendChild(notif)

    setTimeout(() => {
      notif.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => notif.remove(), 300)
    }, duration)
  }

  /**
   * Cor de notificação
   * @private
   */
  _getNotificationColor(type) {
    const colors = {
      success: Constants.COLORS.success,
      error: Constants.COLORS.danger,
      warning: Constants.COLORS.warning,
      info: Constants.COLORS.info
    }
    return colors[type] || Constants.COLORS.info
  }

  /**
   * Mostra tutorial
   */
  showTutorial() {
    const modal = document.getElementById('tutorial-modal')
    if (modal) {
      modal.classList.remove('hidden')
    }
  }

  /**
   * Mostra resultados detalhados
   */
  showResults() {
    if (!this.app.structure.isAnalyzed) {
      this.showWarningMessage('Realize a análise primeiro!')
      return
    }

    const modal = document.getElementById('results-modal')
    if (modal) {
      modal.classList.remove('hidden')
      this.resultsPanel.updateResults(this.app.structure.results)
    }
  }

  /**
   * Toggle de modo escuro
   */
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode
    document.body.classList.toggle('dark-mode', this.isDarkMode)
  }

  /**
   * Desabilita/habilita controles
   */
  setControlsEnabled(enabled) {
    document.querySelectorAll('button, input, select').forEach(el => {
      el.disabled = !enabled
    })
  }
}