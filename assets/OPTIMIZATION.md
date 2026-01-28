# 📊 Guia de Otimização e Boas Práticas de Assets

## 🎯 Objetivos de Performance

- **Tamanho total**: < 500KB
- **Tempo de carregamento**: < 2s (3G lento)
- **Carregamento crítico**: < 100ms

## ✅ Checklist de Otimização

### SVGs

- [ ] Remover comentários e whitespace
- [ ] Usar stroke-width apropriado (1.5-2.5px)
- [ ] Converter cores para hex (#RRGGBB)
- [ ] Usar `<defs>` para ícones reutilizáveis
- [ ] Manter viewBox para escalabilidade
- [ ] Testar em múltiplos tamanhos (16x16, 32x32, 48x48, 64x64)
- [ ] Verificar com SVGO: `svgo file.svg --pretty`

### Imagens Rasterizadas

- [ ] Usar WebP como primeira opção
- [ ] Prover fallback em PNG/JPG
- [ ] Redimensionar para tamanhos reais
- [ ] Comprimir com ImageMin
- [ ] Usar responsive images com srcset

### Fontes

- [ ] Usar WOFF2 (melhor compressão)
- [ ] Reduzir subsets de caracteres
- [ ] Usar font-display: swap
- [ ] Pré-carregar fontes críticas

## 🔧 Ferramentas Recomendadas

### Compressão SVG

```bash
# Instalar SVGO
npm install -g svgo

# Comprimir um arquivo
svgo assets/icons/beam.svg

# Comprimir todos
svgo assets/icons --multipass
```

### Compressão de Imagens

```bash
# Instalar ImageMin
npm install -g imagemin-cli imagemin-mozjpeg imagemin-pngquant

# Comprimir JPG
imagemin assets/images/*.jpg --out-dir=assets/images --plugin=mozjpeg

# Comprimir PNG
imagemin assets/images/*.png --out-dir=assets/images --plugin=pngquant

# Converter para WebP
imagemin assets/images/*.{jpg,png} --out-dir=assets/images --plugin=webp
```

## 📏 Tamanho de Referência

### SVGs (por ícone)

| Ícone | Tamanho | Comprimido |
|-------|---------|-----------|
| beam.svg | 0.5 KB | 0.3 KB |
| frame.svg | 0.6 KB | 0.4 KB |
| node.svg | 0.4 KB | 0.3 KB |
| support-*.svg | 0.7 KB | 0.4 KB |
| **Total** | **8.3 KB** | **5.2 KB** |

### Imagens Rasterizadas

| Imagem | Original | WebP | PNG | Redução |
|--------|----------|------|-----|---------|
| screenshot-1.png | 500 KB | 120 KB | 180 KB | 76% |
| screenshot-2.png | 450 KB | 100 KB | 160 KB | 78% |
| demo.gif | 2 MB | 400 KB | 600 KB | 80% |
| **Total** | **2.95 MB** | **620 KB** | **940 KB** | **79%** |

## 🚀 Estratégias de Carregamento

### 1. Crítico (Pré-carregar)

```javascript
// Carregamentos bloqueantes - necessários imediatamente
const criticalAssets = [
  'icons/beam.svg',
  'icons/frame.svg',
  'icons/node.svg',
  'icons/support-fixed.svg',
];
```

### 2. Importante (Defer)

```javascript
// Carregamentos não-bloqueantes - logo após crítico
const deferredAssets = [
  'icons/load.svg',
  'icons/moment.svg',
  'icons/support-pinned.svg',
  'icons/support-roller.svg',
];
```

### 3. Lazy (On-demand)

```javascript
// Carregamentos quando necessário
const lazyAssets = [
  'images/screenshot-1.png',
  'images/screenshot-2.png',
  'images/demo.gif',
];
```

## 📱 Responsive Images

### HTML

```html
<!-- WebP com fallback -->
<picture>
  <source srcset="assets/images/demo.webp" type="image/webp">
  <source srcset="assets/images/demo.png" type="image/png">
  <img src="assets/images/demo.png" alt="Demo">
</picture>

<!-- Srcset para diferentes resoluções -->
<img 
  src="assets/images/screenshot-1.png"
  srcset="
    assets/images/screenshot-1-small.png 480w,
    assets/images/screenshot-1-medium.png 960w,
    assets/images/screenshot-1-large.png 1920w
  "
  sizes="(max-width: 640px) 480px,
         (max-width: 1024px) 960px,
         1920px"
  alt="Screenshot 1"
>
```

## 💾 Cache Busting

### Estratégia de Hash

```javascript
// Com hash (desenvolvimento/produção)
{
  "icons/beam.svg": "icons/beam.a1b2c3d4.svg",
  "icons/frame.svg": "icons/frame.e5f6g7h8.svg",
}
```

### Versioning

```html
<!-- Versionamento simples -->
<link rel="stylesheet" href="css/main.css?v=1.0.0">

<!-- Com hash -->
<link rel="stylesheet" href="css/main.1a2b3c.css">
```

## 🔐 Integridade de Subresource

```html
<!-- Verificação de integridade para assets de CDN -->
<link
  rel="stylesheet"
  href="https://cdn.example.com/css/main.css"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/rxrw7IcHqWZgNqr6ZRd/"
  crossorigin="anonymous"
>
```

## 📊 Monitoramento

### Network Timing

```javascript
// Medir tempo de carregamento
const measureAssetLoading = async (assetPath) => {
  const start = performance.now();
  const asset = await loadSVGAsset(assetPath);
  const duration = performance.now() - start;
  
  console.log(`${assetPath}: ${duration.toFixed(2)}ms`);
};
```

### Resource Hints

```html
<!-- Prefetch para navegação futura -->
<link rel="prefetch" href="assets/icons/arc.svg">

<!-- Preconnect para CDN -->
<link rel="preconnect" href="https://cdn.example.com">

<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="//cdn.example.com">
```

## 🎨 Otimização de CSS para Assets

```css
/* Carregar ícone sob demanda */
.icon {
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
  width: 1em;
  height: 1em;
}

.icon-beam {
  background-image: url('/assets/icons/beam.svg');
}

.icon-frame {
  background-image: url('/assets/icons/frame.svg');
}

/* Sprite sheet para múltiplos ícones */
.icon-sprite {
  background-image: url('/assets/icons/sprite.svg');
  background-repeat: no-repeat;
}

.icon-beam { background-position: 0 0; }
.icon-frame { background-position: 50px 0; }
```

## 🛠️ Scripts de Otimização

### Script NPM

```json
{
  "scripts": {
    "optimize:svg": "svgo assets/icons --multipass",
    "optimize:images": "imagemin assets/images --out-dir=assets/images",
    "optimize:all": "npm run optimize:svg && npm run optimize:images",
    "analyze": "node scripts/analyze-assets.js",
    "report": "node scripts/generate-report.js"
  }
}
```

### Script de Análise

```javascript
// scripts/analyze-assets.js
import fs from 'fs';
import path from 'path';

const analyzeAssets = (dir) => {
  const files = fs.readdirSync(dir, { recursive: true });
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isFile()) {
      const size = fs.statSync(filePath).size;
      console.log(`${file}: ${(size / 1024).toFixed(2)} KB`);
    }
  });
};

analyzeAssets('assets');
```

## 🎯 Checklist de Deploy

- [ ] Assets comprimidos (SVGO, ImageMin)
- [ ] WebP gerado para imagens
- [ ] Cache busting implementado (hashes)
- [ ] Headers corretos configurados
- [ ] CORS habilitado se necessário
- [ ] Integridade de subrecurso verificada
- [ ] Performance testada (< 2s em 3G)
- [ ] Lighthouse score > 90
- [ ] Acessibilidade testada (alt text, etc)
- [ ] Cross-browser testado

## 📚 Referências

- [WebP Codehaus](https://developers.google.com/speed/webp)
- [ImageOptim](https://imageoptim.com/)
- [SVGO GitHub](https://github.com/svg/svgo)
- [Web.dev Performance Guide](https://web.dev/performance)
- [MDN: Optimizing Images](https://developer.mozilla.org/en-US/docs/Web/Performance/Optimizing_images)

---

**Última atualização**: Janeiro 2025
