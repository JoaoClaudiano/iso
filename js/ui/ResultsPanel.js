
/**
 * @class ResultsPanel
 * @description Painel de resultados
 */
class ResultsPanel {
  constructor(uiManager) {
    this.ui = uiManager
    this.currentTab = 'reactions'
  }

  init() {
    this.setupTabs()
  }

  setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e))
    })
  }

  switchTab(e) {
    const tabName = e.target.dataset.tab

    // Desativar abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active')
    })
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active')
    })

    // Ativar aba selecionada
    e.target.classList.add('active')
    const tabContent = document.getElementById(`tab-${tabName}`)
    if (tabContent) {
      tabContent.classList.add('active')
    }

    this.currentTab = tabName
  }

  updateResults(results) {
    if (!results) return

    this.updateReactionsTab(results.reactions)
    this.updateForcesTab(results.internalForces)
    this.updateExtremesTab(results)
    this.updateEquationsTab(results)
  }

  updateReactionsTab(reactions) {
    const tbody = document.getElementById('reactions-tbody')
    if (!tbody) return

    tbody.innerHTML = ''

    Object.entries(reactions).forEach(([nodeId, reaction]) => {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td>Nó ${nodeId}</td>
        <td>${reaction.fx.toFixed(2)}</td>
        <td>${reaction.fy.toFixed(2)}</td>
        <td>${reaction.m.toFixed(2)}</td>
      `
      tbody.appendChild(row)
    })
  }

  updateForcesTab(internalForces) {
    const tbody = document.getElementById('forces-tbody')
    if (!tbody) return

    tbody.innerHTML = ''

    Object.entries(internalForces).forEach(([beamId, forces]) => {
      const types = [
        { key: 'N', name: 'Normal' },
        { key: 'V', name: 'Cortante' },
        { key: 'M', name: 'Momento' }
      ]

      types.forEach(type => {
        const values = forces[type.key] || []
        if (values.length === 0) return

        const max = Math.max(...values.map(v => Math.abs(v)))
        const min = Math.min(...values.map(v => Math.abs(v)))
        const maxIdx = values.findIndex(v => Math.abs(v) === max)
        const position = (maxIdx / (values.length - 1)) * 10 // Assumindo 10m

        const row = document.createElement('tr')
        row.innerHTML = `
          <td>Barra ${beamId}</td>
          <td>${type.name}</td>
          <td>${max.toFixed(2)}</td>
          <td>${min.toFixed(2)}</td>
          <td>${position.toFixed(2)}</td>
        `
        tbody.appendChild(row)
      })
    })
  }

  updateExtremesTab(results) {
    const content = document.getElementById('extremes-content')
    if (!content) return

    let html = '<div>'
    html += '<h4>Valores Extremos</h4>'
    html += '<table class="results-table">'
    html += '<tr><th>Barra</th><th>Tipo</th><th>Máximo (kN)</th></tr>'

    Object.entries(results.internalForces || {}).forEach(([beamId, forces]) => {
      const maxM = Math.max(...(forces.M || []))
      const maxV = Math.max(...(forces.V || []))

      html += `<tr><td>Barra ${beamId}</td><td>Momento</td><td>${maxM.toFixed(2)}</td></tr>`
      html += `<tr><td>Barra ${beamId}</td><td>Cortante</td><td>${maxV.toFixed(2)}</td></tr>`
    })

    html += '</table></div>'
    content.innerHTML = html
  }

  updateEquationsTab(results) {
    const content = document.getElementById('equations-content')
    if (!content) return

    let html = '<div>'
    html += '<h4>Equações de Equilíbrio</h4>'
    html += '<p>ΣFx = 0</p>'
    html += '<p>ΣFy = 0</p>'
    html += '<p>ΣM = 0</p>'
    html += '</div>'

    content.innerHTML = html
  }
}