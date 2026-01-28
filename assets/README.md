<!-- assets/README.md -->

# 🎨 Assets - Recursos Estáticos

Este diretório contém todos os recursos estáticos da aplicação Isostática Lab, incluindo ícones SVG, imagens e fontes.

## 📁 Estrutura

```
assets/
├── icons/           # Ícones SVG vetoriais
├── images/          # Imagens rasterizadas (PNG, JPEG)
└── fonts/           # Fontes personalizadas
```

## 🎯 Ícones SVG

### Tipos de Estrutura

| Ícone | Arquivo | Descrição | Uso |
|-------|---------|-----------|-----|
| 🔲 | `beam.svg` | Viga horizontal | Seleção de estrutura |
| 📦 | `frame.svg` | Pórtico | Seleção de estrutura |
| ⊞ | `grill.svg` | Grelha | Seleção de estrutura |
| ⌒ | `arc.svg` | Arco | Seleção de estrutura |

### Elementos Estruturais

| Ícone | Arquivo | Descrição | Uso |
|-------|---------|-----------|-----|
| ● | `node.svg` | Nó | Criar nós na estrutura |
| ━ | `load.svg` | Carga | Aplicar cargas |
| ◯ | `support-fixed.svg` | Apoio engastado | Vínculos estruturais |
| ⊕ | `support-pinned.svg` | Apoio articulado | Vínculos estruturais |
| ⊙ | `support-roller.svg` | Apoio móvel | Vínculos estruturais |
| ⟲ | `moment.svg` | Momento (torque) | Aplicar momentos |

## 📸 Imagens

A pasta `images/` contém:
- `screenshot-1.png` - Captura de tela da interface
- `screenshot-2.png` - Captura de tela de resultados
- `demo.gif` - GIF animado de demonstração

## 🔤 Fontes

A pasta `fonts/` contém fontes personalizadas. Atualmente, a aplicação usa as fontes do sistema:
- `Inter` para UI
- `Monaco` para código

## 💻 Como Usar

### Em HTML

```html
<!-- Usando ícones SVG -->
<img src="assets/icons/beam.svg" alt="Viga" width="32" height="32">
```

### Em CSS

```css
/* Usando SVG como background */
.btn-beam {
  background-image: url('../assets/icons/beam.svg');
  background-size: 20px 20px;
  background-repeat: no-repeat;
}
```

### Em JavaScript

```javascript
// Carregando dinamicamente
const iconPath = 'assets/icons/beam.svg';
const img = document.createElement('img');
img.src = iconPath;
img.alt = 'Viga';
document.body.appendChild(img);
```

## 🎨 Especificações

### SVG

- **Viewbox**: 100x100 ou 200x150 (conforme necessário)
- **Dimensão**: 48x48 pixels na renderização
- **Cores**:
  - Primária: `#2563eb` (azul)
  - Secundária: `#ef4444` (vermelho)
  - Sucesso: `#10b981` (verde)
  - Atenção: `#f59e0b` (âmbar)
  - Neutro: `#6366f1` (índigo)

### Nomes de Cores

As cores seguem o padrão Tailwind CSS para consistência com o design:

```javascript
// constants.js
export const COLORS = {
  primary: '#2563eb',      // blue-600
  secondary: '#ef4444',    // red-500
  success: '#10b981',      // emerald-600
  warning: '#f59e0b',      // amber-500
  info: '#6366f1',         // indigo-600
  neutral: '#6b7280',      // gray-500
};
```

## ✏️ Editando Ícones

### Recomendações

1. **Manter aspecto quadrado** para consistência
2. **Usar stroke-width apropriado** (1.5-2.5px)
3. **Alinhar ao grid** (múltiplos de 5 recomendado)
4. **Testar em diferentes tamanhos** (16x16, 24x24, 48x48, 64x64)

### Ferramentas Recomendadas

- **Inkscape** (gratuito, opensource)
- **Figma** (web, colaborativo)
- **Adobe Illustrator** (profissional)
- **Affinity Designer** (desktop)

## 📦 Otimização

### Compressão SVG

Use ferramentas como:
- [SVGO](https://github.com/svg/svgo) - CLI tool
- [SVGCompress](https://www.svgcompress.com/) - Online

```bash
# Instalar SVGO
npm install -g svgo

# Comprimir um arquivo
svgo assets/icons/beam.svg -o assets/icons/beam.min.svg
```

## 🚀 Boas Práticas

1. **Nomeação**: usar kebab-case (ex: `support-fixed.svg`)
2. **Organização**: agrupar por tipo (icons, images, fonts)
3. **Versionamento**: incluir hash no nome para cache-busting
4. **Acessibilidade**: adicionar `alt` em imagens e `title` em SVGs
5. **Performance**: otimizar tamanho de arquivo

## 📝 Exemplo Completo

```html
<!-- Ícone com título para acessibilidade -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" 
     width="48" height="48" aria-label="Viga">
  <title>Ícone de Viga</title>
  <!-- conteúdo -->
</svg>
```

## 🔗 Referências

- [SVG MDN Docs](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)
- [Material Design Icons](https://fonts.google.com/icons)
- [SVGO Documentation](https://github.com/svg/svgo)

---

**Última atualização**: Janeiro 2025
