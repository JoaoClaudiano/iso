/**

- @fileoverview Funções matemáticas utilitárias
  */

const MathUtils = {
// ============================================
// GEOMETRIA 2D
// ============================================

/**

- Calcula a distância entre dois pontos
- @param {Object} p1 - Ponto 1 {x, y}
- @param {Object} p2 - Ponto 2 {x, y}
- @returns {number}
  */
  distance(p1, p2) {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
  },

/**

- Calcula o ângulo entre dois pontos
- @param {Object} p1 - Ponto 1
- @param {Object} p2 - Ponto 2
- @returns {number} Ângulo em radianos
  */
  angle(p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x)
  },

/**

- Calcula o ângulo em graus
- @param {Object} p1
- @param {Object} p2
- @returns {number}
  */
  angleDegrees(p1, p2) {
  return this.angle(p1, p2) * (180 / Math.PI)
  },

/**

- Rotaciona um ponto em torno de um origem
- @param {Object} point - Ponto a rotacionar
- @param {number} angle - Ângulo em radianos
- @param {Object} origin - Ponto de origem
- @returns {Object} Ponto rotacionado {x, y}
  */
  rotatePoint(point, angle, origin = { x: 0, y: 0 }) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const dx = point.x - origin.x
  const dy = point.y - origin.y

```
return {
  x: origin.x + dx * cos - dy * sin,
  y: origin.y + dx * sin + dy * cos
}
```

},

/**

- Encontra a interseção entre duas linhas
- @param {Object} p1 - Ponto 1 da linha 1
- @param {Object} p2 - Ponto 2 da linha 1
- @param {Object} p3 - Ponto 1 da linha 2
- @param {Object} p4 - Ponto 2 da linha 2
- @returns {Object|null} Ponto de interseção ou null
  */
  lineIntersection(p1, p2, p3, p4) {
  const x1 = p1.x
  const y1 = p1.y
  const x2 = p2.x
  const y2 = p2.y
  const x3 = p3.x
  const y3 = p3.y
  const x4 = p4.x
  const y4 = p4.y

```
const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

if (Math.abs(denom) < 1e-10) {
  return null // Linhas paralelas
}

const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom

return {
  x: x1 + t * (x2 - x1),
  y: y1 + t * (y2 - y1)
}
```

},

/**

- Verifica se um ponto está dentro de um círculo
- @param {Object} point
- @param {Object} center
- @param {number} radius
- @returns {boolean}
  */
  isPointInCircle(point, center, radius) {
  return this.distance(point, center) <= radius
  },

/**

- Verifica se um ponto está dentro de um retângulo
- @param {Object} point
- @param {Object} rectMin - Canto inferior esquerdo {x, y}
- @param {Object} rectMax - Canto superior direito {x, y}
- @returns {boolean}
  */
  isPointInRect(point, rectMin, rectMax) {
  return (
  point.x >= rectMin.x &&
  point.x <= rectMax.x &&
  point.y >= rectMin.y &&
  point.y <= rectMax.y
  )
  },

/**

- Calcula o ponto mais próximo em uma linha
- @param {Object} point
- @param {Object} lineStart
- @param {Object} lineEnd
- @returns {Object}
  */
  closestPointOnLine(point, lineStart, lineEnd) {
  const dx = lineEnd.x - lineStart.x
  const dy = lineEnd.y - lineStart.y
  const t = Math.max(0, Math.min(1, ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (dx * dx + dy * dy)))

```
return {
  x: lineStart.x + t * dx,
  y: lineStart.y + t * dy
}
```

},

/**

- Calcula a distância de um ponto a uma linha
- @param {Object} point
- @param {Object} lineStart
- @param {Object} lineEnd
- @returns {number}
  */
  distanceToLine(point, lineStart, lineEnd) {
  const closest = this.closestPointOnLine(point, lineStart, lineEnd)
  return this.distance(point, closest)
  },

// ============================================
// ÁLGEBRA LINEAR
// ============================================

/**

- Multiplica uma matriz por um vetor
- @param {Array<Array<number>>} matrix
- @param {Array<number>} vector
- @returns {Array<number>}
  */
  matrixVectorMultiply(matrix, vector) {
  const result = new Array(matrix.length).fill(0)
  for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < vector.length; j++) {
  result[i] += matrix[i][j] * vector[j]
  }
  }
  return result
  },

/**

- Multiplica duas matrizes
- @param {Array<Array<number>>} a
- @param {Array<Array<number>>} b
- @returns {Array<Array<number>>}
  */
  matrixMultiply(a, b) {
  const result = new Array(a.length).fill(0).map(() => new Array(b[0].length).fill(0))
  for (let i = 0; i < a.length; i++) {
  for (let j = 0; j < b[0].length; j++) {
  for (let k = 0; k < b.length; k++) {
  result[i][j] += a[i][k] * b[k][j]
  }
  }
  }
  return result
  },

/**

- Calcula o determinante de uma matriz 2x2
- @param {Array<Array<number>>} matrix
- @returns {number}
  */
  determinant2x2(matrix) {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
  },

/**

- Calcula o determinante de uma matriz 3x3
- @param {Array<Array<number>>} matrix
- @returns {number}
  */
  determinant3x3(matrix) {
  const m = matrix
  return (
  m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
  m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
  m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  )
  },

/**

- Inverte uma matriz 2x2
- @param {Array<Array<number>>} matrix
- @returns {Array<Array<number>>|null}
  */
  inverse2x2(matrix) {
  const det = this.determinant2x2(matrix)
  if (Math.abs(det) < 1e-10) return null

```
return [
  [matrix[1][1] / det, -matrix[0][1] / det],
  [-matrix[1][0] / det, matrix[0][0] / det]
]
```

},

/**

- Inverte uma matriz 3x3
- @param {Array<Array<number>>} matrix
- @returns {Array<Array<number>>|null}
  */
  inverse3x3(matrix) {
  const det = this.determinant3x3(matrix)
  if (Math.abs(det) < 1e-10) return null

```
const m = matrix
const adj = [
  [m[1][1] * m[2][2] - m[1][2] * m[2][1], m[0][2] * m[2][1] - m[0][1] * m[2][2], m[0][1] * m[1][2] - m[0][2] * m[1][1]],
  [m[1][2] * m[2][0] - m[1][0] * m[2][2], m[0][0] * m[2][2] - m[0][2] * m[2][0], m[0][2] * m[1][0] - m[0][0] * m[1][2]],
  [m[1][0] * m[2][1] - m[1][1] * m[2][0], m[0][1] * m[2][0] - m[0][0] * m[2][1], m[0][0] * m[1][1] - m[0][1] * m[1][0]]
]

return adj.map((row) => row.map((val) => val / det))
```

},

/**

- Transpõe uma matriz
- @param {Array<Array<number>>} matrix
- @returns {Array<Array<number>>}
  */
  transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]))
  },

// ============================================
// CÁLCULO NUMÉRICO
// ============================================

/**

- Integração numérica usando método dos trapézios
- @param {Array<number>} values - Valores da função
- @param {number} dx - Passo
- @returns {number}
  */
  trapezoidalIntegration(values, dx) {
  if (values.length < 2) return 0

```
let sum = 0
for (let i = 0; i < values.length - 1; i++) {
  sum += (values[i] + values[i + 1]) / 2
}
return sum * dx
```

},

/**

- Derivada numérica usando diferenças centrais
- @param {Array<number>} values
- @param {number} dx
- @returns {Array<number>}
  */
  numericalDerivative(values, dx) {
  const derivative = []

```
// Primeira diferença
derivative.push((values[1] - values[0]) / dx)

// Diferenças centrais
for (let i = 1; i < values.length - 1; i++) {
  derivative.push((values[i + 1] - values[i - 1]) / (2 * dx))
}

// Última diferença
derivative.push((values[values.length - 1] - values[values.length - 2]) / dx)

return derivative
```

},

/**

- Suaviza uma série de valores usando média móvel
- @param {Array<number>} values
- @param {number} windowSize
- @returns {Array<number>}
  */
  movingAverage(values, windowSize) {
  const smoothed = []
  for (let i = 0; i < values.length; i++) {
  const start = Math.max(0, i - Math.floor(windowSize / 2))
  const end = Math.min(values.length, i + Math.ceil(windowSize / 2))
  const sum = values.slice(start, end).reduce((a, b) => a + b, 0)
  smoothed.push(sum / (end - start))
  }
  return smoothed
  },

// ============================================
// INTERPOLAÇÃO
// ============================================

/**

- Interpolação linear
- @param {number} a
- @param {number} b
- @param {number} t - Parâmetro (0 a 1)
- @returns {number}
  */
  lerp(a, b, t) {
  return a + (b - a) * t
  },

/**

- Interpolação de Catmull-Rom (suave)
- @param {number} p0, p1, p2, p3 - Pontos de controle
- @param {number} t - Parâmetro (0 a 1)
- @returns {number}
  */
  catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t
  const t3 = t2 * t

```
return (
  0.5 *
  (2 * p1 +
    -p0 * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (3 * p1 - p0 - 3 * p2 + p3) * t3)
)
```

},

// ============================================
// ESTATÍSTICAS
// ============================================

/**

- Calcula a média
- @param {Array<number>} values
- @returns {number}
  */
  mean(values) {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
  },

/**

- Calcula a mediana
- @param {Array<number>} values
- @returns {number}
  */
  median(values) {
  const sorted = […values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  },

/**

- Calcula o desvio padrão
- @param {Array<number>} values
- @returns {number}
  */
  standardDeviation(values) {
  const m = this.mean(values)
  const variance = values.reduce((sum, val) => sum + (val - m) ** 2, 0) / values.length
  return Math.sqrt(variance)
  },

/**

- Encontra o máximo
- @param {Array<number>} values
- @returns {number}
  */
  max(values) {
  return Math.max(…values)
  },

/**

- Encontra o mínimo
- @param {Array<number>} values
- @returns {number}
  */
  min(values) {
  return Math.min(…values)
  },

// ============================================
// UTILITÁRIOS
// ============================================

/**

- Formata um número com casas decimais
- @param {number} value
- @param {number} decimals
- @returns {number}
  */
  round(value, decimals = 2) {
  return Number(value.toFixed(decimals))
  },

/**

- Converte graus para radianos
- @param {number} degrees
- @returns {number}
  */
  toRadians(degrees) {
  return (degrees * Math.PI) / 180
  },

/**

- Converte radianos para graus
- @param {number} radians
- @returns {number}
  */
  toDegrees(radians) {
  return (radians * 180) / Math.PI
  },

/**

- Clamp um valor entre min e max
- @param {number} value
- @param {number} min
- @param {number} max
- @returns {number}
  */
  clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
  },

/**

- Resolve equação quadrática ax² + bx + c = 0
- @param {number} a
- @param {number} b
- @param {number} c
- @returns {Array<number>|null}
  */
  solveQuadratic(a, b, c) {
  if (Math.abs(a) < 1e-10) {
  if (Math.abs(b) < 1e-10) return null
  return [-c / b]
  }

```
const discriminant = b * b - 4 * a * c

if (discriminant < 0) {
  return null // Sem soluções reais
}

const sqrtDisc = Math.sqrt(discriminant)
return [(-b + sqrtDisc) / (2 * a), (-b - sqrtDisc) / (2 * a)]
```

}
}

// Exportar para uso global
if (typeof module !== ‘undefined’ && module.exports) {
module.exports = MathUtils
}