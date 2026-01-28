/**

- @class Solver
- @description Solver de equações lineares - Álgebra linear
  */
  class Solver {
  constructor() {
  this.tolerance = 1e-10
  }

/**

- Resolve sistema linear usando Eliminação de Gauss-Jordan
- @param {Array<Array<number>>} matrix - Matriz aumentada [A|b]
- @returns {Array<number>|null} Solução ou null se singular
  */
  solveGaussJordan(matrix) {
  const n = matrix.length
  if (n === 0) return null

```
// Cópia para não modificar original
const m = matrix.map(row => [...row])

// Forward elimination com partial pivoting
for (let i = 0; i < n; i++) {
  // Encontrar pivô
  let maxRow = i
  for (let k = i + 1; k < n; k++) {
    if (Math.abs(m[k][i]) > Math.abs(m[maxRow][i])) {
      maxRow = k
    }
  }

  // Trocar linhas
  [m[i], m[maxRow]] = [m[maxRow], m[i]]

  // Verificar se matriz é singular
  if (Math.abs(m[i][i]) < this.tolerance) {
    return null
  }

  // Eliminar coluna
  for (let k = i + 1; k < n; k++) {
    const factor = m[k][i] / m[i][i]
    for (let j = i; j <= n; j++) {
      m[k][j] -= factor * m[i][j]
    }
  }
}

// Back substitution
const solution = new Array(n)
for (let i = n - 1; i >= 0; i--) {
  solution[i] = m[i][n]
  for (let j = i + 1; j < n; j++) {
    solution[i] -= m[i][j] * solution[j]
  }
  solution[i] /= m[i][i]
}

return solution
```

}

/**

- Resolve sistema linear usando Fatoração LU
- @param {Array<Array<number>>} A - Matriz de coeficientes
- @param {Array<number>} b - Vetor independente
- @returns {Array<number>|null} Solução ou null
  */
  solveLU(A, b) {
  const n = A.length
  if (n === 0) return null

```
// Fatoração LU
const { L, U, P } = this.factorLU(A)
if (!L || !U) return null

// Aplicar permutação
const Pb = P.map((i) => b[i])

// Resolver Ly = Pb
const y = this.forwardSubstitution(L, Pb)
if (!y) return null

// Resolver Ux = y
const x = this.backSubstitution(U, y)
return x
```

}

/**

- Fatoração LU com pivoting parcial
- @private
- @returns {Object} {L, U, P}
  */
  factorLU(A) {
  const n = A.length
  const matrix = A.map(row => […row])
  const L = Array(n).fill(0).map(() => Array(n).fill(0))
  const P = Array(n).fill(0).map((_, i) => i)

```
for (let i = 0; i < n; i++) {
  L[i][i] = 1
}

for (let i = 0; i < n; i++) {
  // Encontrar pivô
  let maxRow = i
  for (let k = i + 1; k < n; k++) {
    if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
      maxRow = k
    }
  }

  // Trocar linhas
  if (maxRow !== i) {
    [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
    [L[i], L[maxRow]] = [L[maxRow], L[i]];
    [P[i], P[maxRow]] = [P[maxRow], P[i]]
  }

  if (Math.abs(matrix[i][i]) < this.tolerance) {
    return { L: null, U: null, P: null }
  }

  for (let k = i + 1; k < n; k++) {
    L[k][i] = matrix[k][i] / matrix[i][i]
    for (let j = i; j < n; j++) {
      matrix[k][j] -= L[k][i] * matrix[i][j]
    }
  }
}

return { L, U: matrix, P }
```

}

/**

- Substituição direta (Ly = b)
- @private
  */
  forwardSubstitution(L, b) {
  const n = L.length
  const y = new Array(n)

```
for (let i = 0; i < n; i++) {
  y[i] = b[i]
  for (let j = 0; j < i; j++) {
    y[i] -= L[i][j] * y[j]
  }
  y[i] /= L[i][i]
}

return y
```

}

/**

- Substituição inversa (Ux = y)
- @private
  */
  backSubstitution(U, y) {
  const n = U.length
  const x = new Array(n)

```
for (let i = n - 1; i >= 0; i--) {
  x[i] = y[i]
  for (let j = i + 1; j < n; j++) {
    x[i] -= U[i][j] * x[j]
  }
  if (Math.abs(U[i][i]) < this.tolerance) {
    return null
  }
  x[i] /= U[i][i]
}

return x
```

}

/**

- Método iterativo de Gauss-Seidel
- @param {Array<Array<number>>} A - Matriz de coeficientes
- @param {Array<number>} b - Vetor independente
- @param {number} maxIterations - Máximo de iterações
- @param {number} tolerance - Tolerância de convergência
- @returns {Array<number>|null} Solução ou null
  */
  solveGaussSeidel(A, b, maxIterations = 1000, tolerance = 1e-8) {
  const n = A.length
  let x = new Array(n).fill(0)

```
for (let iter = 0; iter < maxIterations; iter++) {
  const xNew = [...x]
  let maxChange = 0

  for (let i = 0; i < n; i++) {
    let sum = 0
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        sum += A[i][j] * xNew[j]
      }
    }

    if (Math.abs(A[i][i]) < this.tolerance) {
      return null
    }

    xNew[i] = (b[i] - sum) / A[i][i]
    maxChange = Math.max(maxChange, Math.abs(xNew[i] - x[i]))
  }

  x = xNew

  if (maxChange < tolerance) {
    return x
  }
}

return x
```

}

/**

- Inverte matriz usando Gauss-Jordan
- @param {Array<Array<number>>} A - Matriz
- @returns {Array<Array<number>>|null} Matriz inversa ou null
  */
  invertMatrix(A) {
  const n = A.length
  if (n !== A[0].length) return null

```
// Criar matriz aumentada [A|I]
const augmented = A.map((row, i) => [
  ...row,
  ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
])

// Gauss-Jordan
for (let i = 0; i < n; i++) {
  // Encontrar pivô
  let maxRow = i
  for (let k = i + 1; k < n; k++) {
    if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
      maxRow = k
    }
  }

  [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]]

  if (Math.abs(augmented[i][i]) < this.tolerance) {
    return null
  }

  // Normalizar linha
  const pivot = augmented[i][i]
  for (let j = 0; j < 2 * n; j++) {
    augmented[i][j] /= pivot
  }

  // Eliminar coluna
  for (let k = 0; k < n; k++) {
    if (k !== i) {
      const factor = augmented[k][i]
      for (let j = 0; j < 2 * n; j++) {
        augmented[k][j] -= factor * augmented[i][j]
      }
    }
  }
}

// Extrair inversa
return augmented.map(row => row.slice(n))
```

}

/**

- Calcula determinante (Gauss)
- @param {Array<Array<number>>} A - Matriz
- @returns {number}
  */
  getDeterminant(A) {
  const n = A.length
  if (n !== A[0].length) return 0

```
const matrix = A.map(row => [...row])
let det = 1
let swaps = 0

for (let i = 0; i < n; i++) {
  // Encontrar pivô
  let maxRow = i
  for (let k = i + 1; k < n; k++) {
    if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
      maxRow = k
    }
  }

  if (Math.abs(matrix[maxRow][i]) < this.tolerance) {
    return 0
  }

  if (maxRow !== i) {
    [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]]
    swaps++
  }

  det *= matrix[i][i]

  for (let k = i + 1; k < n; k++) {
    const factor = matrix[k][i] / matrix[i][i]
    for (let j = i; j < n; j++) {
      matrix[k][j] -= factor * matrix[i][j]
    }
  }
}

return swaps % 2 === 0 ? det : -det
```

}

/**

- Calcula número de condição de matriz
- @param {Array<Array<number>>} A - Matriz
- @returns {number}
  */
  getConditionNumber(A) {
  const Ainv = this.invertMatrix(A)
  if (!Ainv) return Infinity

```
const normA = this.matrixNorm(A)
const normAinv = this.matrixNorm(Ainv)

return normA * normAinv
```

}

/**

- Norma de Frobenius da matriz
- @private
  */
  matrixNorm(A) {
  let sum = 0
  for (let i = 0; i < A.length; i++) {
  for (let j = 0; j < A[i].length; j++) {
  sum += A[i][j] * A[i][j]
  }
  }
  return Math.sqrt(sum)
  }

/**

- Autovalor dominante (método da potência)
- @param {Array<Array<number>>} A - Matriz
- @param {number} iterations - Iterações
- @returns {Object} {eigenvalue, eigenvector}
  */
  getDominantEigenvalue(A, iterations = 100) {
  const n = A.length
  let v = Array(n).fill(1)
  let eigenvalue = 0

```
for (let iter = 0; iter < iterations; iter++) {
  // Av
  const Av = new Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      Av[i] += A[i][j] * v[j]
    }
  }

  // Norma
  const norm = Math.sqrt(Av.reduce((sum, x) => sum + x * x, 0))
  if (norm < this.tolerance) break

  // Normalizar
  for (let i = 0; i < n; i++) {
    v[i] = Av[i] / norm
  }

  eigenvalue = norm
}

return { eigenvalue, eigenvector: v }
```

}

/**

- Solução de mínimos quadrados (normal equations)
- @param {Array<Array<number>>} A - Matriz (m x n)
- @param {Array<number>} b - Vetor (m)
- @returns {Array<number>|null} Solução (n) ou null
  */
  solveLeastSquares(A, b) {
  // Resolver: A^T A x = A^T b
  const m = A.length
  const n = A[0].length

```
// A^T A
const ATA = Array(n).fill(0).map(() => Array(n).fill(0))
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    for (let k = 0; k < m; k++) {
      ATA[i][j] += A[k][i] * A[k][j]
    }
  }
}

// A^T b
const ATb = Array(n).fill(0)
for (let i = 0; i < n; i++) {
  for (let k = 0; k < m; k++) {
    ATb[i] += A[k][i] * b[k]
  }
}

// Resolver ATA x = ATb
const matrix = ATA.map((row, i) => [...row, ATb[i]])
return this.solveGaussJordan(matrix)
```

}

/**

- QR decomposition (Gram-Schmidt)
- @param {Array<Array<number>>} A - Matriz
- @returns {Object} {Q, R}
  */
  decomposeQR(A) {
  const m = A.length
  const n = A[0].length

```
const Q = Array(m).fill(0).map(() => Array(n).fill(0))
const R = Array(n).fill(0).map(() => Array(n).fill(0))

const a = A.map(row => [...row])

for (let j = 0; j < n; j++) {
  // Norma
  let norm = 0
  for (let i = 0; i < m; i++) {
    norm += a[i][j] * a[i][j]
  }
  norm = Math.sqrt(norm)

  R[j][j] = norm

  if (norm > this.tolerance) {
    for (let i = 0; i < m; i++) {
      Q[i][j] = a[i][j] / norm
    }
  }

  for (let k = j + 1; k < n; k++) {
    let prod = 0
    for (let i = 0; i < m; i++) {
      prod += Q[i][j] * a[i][k]
    }
    R[j][k] = prod

    for (let i = 0; i < m; i++) {
      a[i][k] -= prod * Q[i][j]
    }
  }
}

return { Q, R }
```

}

/**

- Validação de solução
- @param {Array<Array<number>>} A - Matriz
- @param {Array<number>} x - Solução
- @param {Array<number>} b - Vetor original
- @returns {number} Erro residual
  */
  getResidualError(A, x, b) {
  const n = A.length
  let error = 0

```
for (let i = 0; i < n; i++) {
  let sum = 0
  for (let j = 0; j < n; j++) {
    sum += A[i][j] * x[j]
  }
  const residual = sum - b[i]
  error += residual * residual
}

return Math.sqrt(error)
```

}

/**

- Melhora solução usando refinamento iterativo
- @param {Array<Array<number>>} A - Matriz
- @param {Array<number>} b - Vetor
- @param {Array<number>} x - Solução inicial
- @param {number} iterations - Iterações
- @returns {Array<number>}
  */
  refineSolution(A, b, x, iterations = 3) {
  const n = A.length
  let current = […x]

```
for (let iter = 0; iter < iterations; iter++) {
  // Calcular resíduo: r = b - Ax
  const r = new Array(n)
  for (let i = 0; i < n; i++) {
    let sum = 0
    for (let j = 0; j < n; j++) {
      sum += A[i][j] * current[j]
    }
    r[i] = b[i] - sum
  }

  // Resolver: A dx = r
  const matrix = A.map((row, i) => [...row, r[i]])
  const dx = this.solveGaussJordan(matrix)

  if (!dx) break

  // Atualizar solução
  for (let i = 0; i < n; i++) {
    current[i] += dx[i]
  }
}

return current
```

}

/**

- Informações sobre estabilidade numérica
- @param {Array<Array<number>>} A - Matriz
- @returns {Object}
  */
  getStabilityInfo(A) {
  const det = this.getDeterminant(A)
  const cond = this.getConditionNumber(A)

```
return {
  determinant: det,
  conditionNumber: cond,
  isSingular: Math.abs(det) < this.tolerance,
  isWellConditioned: cond < 100,
  stability: cond < 100 ? 'Boa' : cond < 10000 ? 'Moderada' : 'Ruim'
}
```

}
}