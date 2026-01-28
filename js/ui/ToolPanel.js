/**
 * @class ToolPanel
 * @description Painel de ferramentas
 */
class ToolPanel {
  constructor(uiManager) {
    this.ui = uiManager
    this.activeToolButton = null
  }

  init() {
    this.setupButtons()
  }

  setupButtons() {
    const tools = [
      { id: 'tool-select', tool: 'select', icon: '✓' },
      { id: 'tool-node', tool: 'node', icon: '+' },
      { id: 'tool-beam', tool: 'beam', icon: '—' },
      { id: 'tool-delete', tool: 'delete', icon: '✕' }
    ]

    tools.forEach(item => {
      const btn = document.getElementById(item.id)
      if (btn) {
        btn.addEventListener('click', () => this.selectTool(item.tool, btn))
      }
    })

    // Selecionar ferramenta padrão
    const defaultBtn = document.getElementById('tool-select')
    if (defaultBtn) {
      this.selectTool('select', defaultBtn)
    }
  }

  selectTool(tool, button) {
    // Desativar botão anterior
    if (this.activeToolButton) {
      this.activeToolButton.classList.remove('active')
    }

    // Ativar novo botão
    button.classList.add('active')
    this.activeToolButton = button

    // Notificar aplicação
    this.ui.app.currentTool = tool
  }

  disableTool(toolName) {
    const btn = document.querySelector(`[data-tool="${toolName}"]`)
    if (btn) btn.disabled = true
  }

  enableTool(toolName) {
    const btn = document.querySelector(`[data-tool="${toolName}"]`)
    if (btn) btn.disabled = false
  }
}
