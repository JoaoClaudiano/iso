# 📐 Isostática Lab - Laboratório Virtual de Análise Estrutural

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](https://github.com/JoaoClaudiano/isoestatica)
[![Stars](https://img.shields.io/github/stars/JoaoClaudiano/isoestatica.svg)](https://github.com/JoaoClaudiano/isoestatica)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤-red.svg)](#)

> Uma ferramenta educacional interativa para análise de estruturas isostáticas. Modelar, analisar e visualizar o comportamento de vigas, pórticos, grelhas e arcos com cálculos em tempo real.

-----

## 🎯 Características Principais

### Tipos de Estruturas Suportadas

- **Vigas Isostáticas** - Análise de esforços cortantes e momentos fletores
- **Pórticos Planos** - Diagramas de esforço normal, cortante e momento fletor
- **Grelhas Isostáticas** - Momentos fletores, torçores e forças cortantes em 3D
- **Arcos Isostáticos** - Linha de pressão e esforços internos em estruturas curvas

### Funcionalidades Avançadas

✨ **Modelagem Gráfica Interativa**

- Criar nós com drag-and-drop
- Conectar barras facilmente
- Aplicar vínculos e cargas intuitivamente

⚡ **Cálculos em Tempo Real**

- Reações de apoio automáticas
- Equações de equilíbrio resolvidas
- Atualização instantânea de resultados

📊 **Visualização Completa**

- Diagramas de esforços internos (N, V, M, T)
- Forma deformada da estrutura
- Legendas com escalas automáticas
- Grid e snap-to-grid para precisão

📚 **Conteúdo Educacional**

- Tutorial passo-a-passo integrado
- Exemplos pré-configurados
- Conceito do dia com explicações
- Validação de estaticidade

-----

## 🚀 Quick Start

### Online (Sem Instalação)

Acesse diretamente: [Isostática Lab](https://joaoclaudiano.github.io/isoestatica/)

### Instalação Local

```bash
# 1. Clone o repositório
git clone https://github.com/JoaoClaudiano/isoestatica.git
cd isoestatica

# 2. Instale as dependências (opcional, para desenvolvimento)
npm install

# 3. Inicie um servidor local
npm start
# ou
python -m http.server 8000

# 4. Abra no navegador
# http://localhost:8000
```

### Requisitos

- Navegador moderno com suporte a Canvas HTML5
- JavaScript ES6+ habilitado
- Sem dependências externas (vanilla JavaScript)

-----

## 📖 Guia de Uso Básico

### 1️⃣ Criar Estrutura

```
1. Clique em "+ Nó" na barra de ferramentas
2. Clique no canvas para adicionar nós
3. Selecione "— Barra" e clique em dois nós para conectar
```

### 2️⃣ Aplicar Vínculos

```
1. Selecione o tipo de apoio:
   - ○ Livre: Sem restrições
   - ⊕ Móvel: Restringe apenas um eixo
   - ⊙ Articulado: Restringe dois eixos
   - ■ Engastado: Restringe todos os eixos
2. Clique no nó para aplicar o vínculo
```

### 3️⃣ Aplicar Cargas

```
1. Configure a carga na direita:
   - Tipo (Pontual, Distribuída, Momento)
   - Magnitude (kN ou kN/m)
   - Direção (graus)
   - Posição (metros)
2. Clique em "+ Adicionar Carga"
```

### 4️⃣ Analisar

```
1. Clique em "▶ Calcular"
2. Visualize os resultados:
   - Reações de apoio
   - Diagramas de esforços
   - Valores extremos
```

### 5️⃣ Explorar Resultados

```
1. Ative/desative diagramas:
   - Normal (N)
   - Cortante (V)
   - Momento (M)
   - Torção (T)
   - Deformada
2. Exporte os resultados em JSON ou PDF
```

-----

## 🏗️ Arquitetura do Projeto

### Estrutura de Diretórios

```
isoestatica/
├── src/
│   ├── core/              # Classes de modelo de dados
│   │   ├── Node.js        # Nó estrutural
│   │   ├── Beam.js        # Barra/elemento
│   │   ├── Load.js        # Carga aplicada
│   │   ├── Support.js     # Apoio/vínculo
│   │   └── Structure.js   # Estrutura principal
│   ├── analysis/          # Motor de análise
│   │   ├── Solver.js      # Resolver de equações
│   │   ├── BeamAnalyzer.js
│   │   ├── FrameAnalyzer.js
│   │   ├── GrillAnalyzer.js
│   │   └── ArcAnalyzer.js
│   ├── visualization/     # Renderização
│   │   ├── CanvasRenderer.js
│   │   ├── DiagramDrawer.js
│   │   └── Legend.js
│   ├── ui/               # Interface do usuário
│   │   ├── UIManager.js
│   │   ├── ToolPanel.js
│   │   └── ResultsPanel.js
│   ├── utils/            # Funções auxiliares
│   │   ├── Constants.js
│   │   ├── Math.js
│   │   ├── Export.js
│   │   └── Validation.js
│   └── app.js            # Aplicação principal
├── css/
│   ├── main.css          # Estilos principais
│   ├── components.css    # Componentes
│   └── responsive.css    # Responsividade
├── tests/                # Testes unitários
├── docs/                 # Documentação
│   ├── API.md
│   ├── USER_GUIDE.md
│   └── CONTRIBUTING.md
├── examples/             # Exemplos JSON
└── index.html            # Página principal
```

### Pilha Tecnológica

|Tecnologia  |Versão|Propósito            |
|------------|------|---------------------|
|HTML5       |-     |Estrutura semântica  |
|CSS3        |-     |Design responsivo    |
|JavaScript  |ES6+  |Lógica da aplicação  |
|Canvas API  |-     |Renderização gráfica |
|LocalStorage|-     |Persistência de dados|
|Jest        |^29.0 |Testes unitários     |
|ESLint      |^8.0  |Linting              |
|Prettier    |^2.8  |Formatação           |

-----

## 💻 Desenvolvimento

### Setup de Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar linter
npm run lint

# Formatar código
npm run format

# Executar testes
npm test

# Observar mudanças
npm run test:watch

# Gerar cobertura
npm run test:coverage

# Gerar documentação
npm run docs
```

### Padrões de Código

O projeto segue:

- **ESLint** para linting (veja `.eslintrc.json`)
- **Prettier** para formatação (veja `.prettierrc`)
- **JSDoc** para documentação
- **Jest** para testes

### Exemplo de Classe Bem Formatada

```javascript
/**
 * Representa um nó estrutural
 * @class Node
 * @param {number} id - ID único do nó
 * @param {number} x - Coordenada X (metros)
 * @param {number} y - Coordenada Y (metros)
 */
class Node {
  constructor(id, x, y) {
    this.id = id
    this.x = x
    this.y = y
    this.support = null
    this.reactions = { fx: 0, fy: 0, m: 0 }
    this.displacements = { dx: 0, dy: 0, r: 0 }
  }

  /**
   * Define o tipo de apoio no nó
   * @param {string} type - Tipo de apoio: 'free', 'roller', 'pinned', 'fixed'
   */
  setSupport(type) {
    this.support = type
  }

  /**
   * Retorna se o nó tem apoio
   * @returns {boolean}
   */
  isSupported() {
    return this.support !== null && this.support !== 'free'
  }
}
```

-----

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:coverage
```

### Estrutura de Testes

```
tests/
├── core/
│   ├── Node.test.js
│   ├── Beam.test.js
│   ├── Load.test.js
│   ├── Support.test.js
│   └── Structure.test.js
├── analysis/
│   ├── Solver.test.js
│   ├── BeamAnalyzer.test.js
│   ├── FrameAnalyzer.test.js
│   ├── GrillAnalyzer.test.js
│   └── ArcAnalyzer.test.js
└── utils/
    ├── Math.test.js
    ├── Export.test.js
    └── Validation.test.js
```

### Exemplo de Teste

```javascript
// tests/core/Beam.test.js
describe('Beam', () => {
  test('deve calcular comprimento corretamente', () => {
    const n1 = new Node(0, 0, 0)
    const n2 = new Node(1, 3, 4)
    const beam = new Beam(0, n1, n2)
    
    expect(beam.getLength()).toBe(5)
  })

  test('deve calcular ângulo correto', () => {
    const n1 = new Node(0, 0, 0)
    const n2 = new Node(1, 1, 1)
    const beam = new Beam(0, n1, n2)
    
    expect(beam.getAngle()).toBeCloseTo(Math.PI / 4)
  })
})
```

-----

## 📊 Exemplos

### Exemplo 1: Viga Biapoiada com Carga Pontual

```javascript
// Criar estrutura
const structure = new Structure('beam')

// Adicionar nós
structure.addNode(0, 0)    // Nó 0: Apoio 1
structure.addNode(5, 0)    // Nó 1: Centro
structure.addNode(10, 0)   // Nó 2: Apoio 2

// Adicionar barras
structure.addBeam(0, 1)
structure.addBeam(1, 2)

// Adicionar apoios
structure.addSupport(0, 'pinned')   // Articulado
structure.addSupport(2, 'roller')   // Móvel

// Adicionar carga
const load = new Load('point', 10, 5, -90)  // 10 kN para baixo
structure.beams[0].addLoad(load)

// Analisar
const analyzer = new StructuralAnalyzer(structure)
const results = analyzer.analyze()

console.log('Reações:', results.reactions)
// Output:
// Nó 0: Fx=0, Fy=5, M=0
// Nó 2: Fx=0, Fy=5, M=0
```

### Exemplo 2: Pórtico Simples

```javascript
const structure = new Structure('frame')

// 3 nós em forma de pórtico
structure.addNode(0, 0)    // Base esquerda
structure.addNode(0, 5)    // Topo esquerdo
structure.addNode(10, 5)   // Topo direito
structure.addNode(10, 0)   // Base direita

// Conectar elementos
structure.addBeam(0, 1)    // Coluna esquerda
structure.addBeam(1, 2)    // Viga superior
structure.addBeam(2, 3)    // Coluna direita
structure.addBeam(3, 0)    // Base

// Apoios
structure.addSupport(0, 'fixed')
structure.addSupport(3, 'fixed')

// Carga horizontal
const load = new Load('point', 5, 0, 0)
structure.beams[1].addLoad(load)

// Analisar
const analyzer = new FrameAnalyzer(structure)
const results = analyzer.analyze()
```

-----

## 🔗 API Reference

### Structure

```javascript
const struct = new Structure(type)
struct.addNode(x, y)                    // Retorna Node
struct.addBeam(startId, endId)          // Retorna Beam
struct.addSupport(nodeId, type)         // Retorna Support
struct.addLoad(beamId, load)            // Retorna Load
struct.getStaticDeterminacy()           // Retorna número
struct.isStaticallyDeterminate()        // Retorna boolean
```

### Analyzer

```javascript
const analyzer = new BeamAnalyzer(structure)
analyzer.analyze()                      // Retorna {reactions, forces}
analyzer.getReactionAt(nodeId)          // Retorna {fx, fy, m}
analyzer.getInternalForcesAt(beamId, pos) // Retorna {N, V, M}
```

### Renderer

```javascript
const renderer = new CanvasRenderer(canvas, structure)
renderer.render()                       // Desenha estrutura
renderer.setScale(scale)                // Define escala
renderer.worldToScreen(x, y)            // Converte coordenadas
renderer.screenToWorld(x, y)            // Converte coordenadas
```

-----

## 📥 Exportação e Importação

### Exportar para JSON

```javascript
const exporter = new Exporter()
const json = exporter.exportJSON(structure, results)
console.log(json)
```

### Importar de JSON

```javascript
const structure = Structure.fromJSON(json)
const results = analyzer.analyze()
```

### Exportar para PDF

```javascript
const exporter = new Exporter()
exporter.exportPDF(structure, results, 'estrutura.pdf')
```

-----

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia <CONTRIBUTING.md> para detalhes.

### Processo de Contribuição

1. Fork o projeto
1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
1. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
1. Push para a branch (`git push origin feature/AmazingFeature`)
1. Abra um Pull Request

### Diretrizes

- Siga os padrões de código (ESLint + Prettier)
- Escreva testes para novas funcionalidades
- Atualize a documentação conforme necessário
- Use mensagens de commit descritivas

-----

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo <LICENSE> para detalhes.

-----

## 👥 Autores

- **João Claudiano** - *Trabalho Inicial* - [@JoaoClaudiano](https://github.com/JoaoClaudiano)

-----

## 🙏 Agradecimentos

- Comunidade de Engenharia Civil
- Educadores e estudantes de Engenharia Estrutural
- Contribuidores open source

-----

## 📧 Contato e Suporte

- **Issues**: [GitHub Issues](https://github.com/JoaoClaudiano/isoestatica/issues)
- **Email**: seu-email@exemplo.com
- **Discussões**: [GitHub Discussions](https://github.com/JoaoClaudiano/isoestatica/discussions)

-----

## 🔗 Links Úteis

- [Documentação Completa](docs/)
- [Guia do Usuário](docs/USER_GUIDE.md)
- [Documentação API](docs/API.md)
- [Roadmap](docs/ROADMAP.md)

-----

## 📈 Roadmap

### v1.0 (Atual)

- ✅ Vigas isostáticas
- ✅ Pórticos planos
- ✅ Análise de esforços
- ✅ Diagramas interativos

### v1.1 (Planejado)

- 🔄 Grelhas isostáticas
- 🔄 Arcos isostáticos
- 🔄 Mais exemplos

### v1.2 (Planejado)

- 🔄 Suporte para cálculo de deformações
- 🔄 Análise 3D
- 🔄 Integração com BIM

-----

<div align="center">

**[⬆ voltar ao topo](#-isostática-lab---laboratório-virtual-de-análise-estrutural)**

Made with ❤ for Civil Engineering Education

</div>
