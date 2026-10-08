// ============================================
// SciCalcPro — Calculator Logic (Pure JS, no mathjs)
// Author: Bilal Marghoob Creations
// ============================================

// ============================================
// STATE
// ============================================
export const state = {
  currentInput: '0',
  expression: '',
  memory: 0,
  angleMode: 'DEG',
  hasMemory: false,
  lastAnswer: 0,
  history: []
}

// ============================================
// DEG / RAD / GRAD CONVERSION
// ============================================
function toRadians(value) {
  if (state.angleMode === 'DEG') return (value * Math.PI) / 180
  if (state.angleMode === 'GRAD') return (value * Math.PI) / 200
  return value
}

function fromRadians(value) {
  if (state.angleMode === 'DEG') return (value * 180) / Math.PI
  if (state.angleMode === 'GRAD') return (value * 200) / Math.PI
  return value
}

// ============================================
// FACTORIAL
// ============================================
function factorial(n) {
  if (n < 0) return NaN
  if (!Number.isInteger(n)) return NaN
  if (n === 0 || n === 1) return 1
  if (n > 170) return Infinity
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

// ============================================
// SAFE EVALUATE EXPRESSION
// ============================================
export function calculate(expression) {
  try {
    if (!expression || expression.trim() === '') {
      return { success: false, error: 'Empty expression' }
    }

    // Replace display symbols
    let jsExpr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')

    // Replace π and e
    jsExpr = jsExpr.replace(/π/g, 'Math.PI')
    jsExpr = jsExpr.replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, 'Math.E')

    // Replace sqrt
    jsExpr = jsExpr.replace(/√\(/g, 'Math.sqrt(')
    jsExpr = jsExpr.replace(/√/g, 'Math.sqrt')

    // Replace trig functions with angle-mode-aware wrappers
    jsExpr = jsExpr.replace(/sin\(/g, '__sin(')
    jsExpr = jsExpr.replace(/cos\(/g, '__cos(')
    jsExpr = jsExpr.replace(/tan\(/g, '__tan(')
    jsExpr = jsExpr.replace(/asin\(/g, '__asin(')
    jsExpr = jsExpr.replace(/acos\(/g, '__acos(')
    jsExpr = jsExpr.replace(/atan\(/g, '__atan(')

    // Replace logs
    jsExpr = jsExpr.replace(/log\(/g, 'Math.log10(')
    jsExpr = jsExpr.replace(/ln\(/g, 'Math.log(')

    // Factorial: convert N! to __fact(N)
    jsExpr = jsExpr.replace(/(\d+(?:\.\d+)?)!/g, '__fact($1)')

    // Power: replace ^ with **
    jsExpr = jsExpr.replace(/\^/g, '**')

    // Percentage: standalone % converts to /100
    jsExpr = jsExpr.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')

    // Create scoped helper functions
    const scope = {
      __sin: (x) => Math.sin(toRadians(x)),
      __cos: (x) => Math.cos(toRadians(x)),
      __tan: (x) => Math.tan(toRadians(x)),
      __asin: (x) => fromRadians(Math.asin(x)),
      __acos: (x) => fromRadians(Math.acos(x)),
      __atan: (x) => fromRadians(Math.atan(x)),
      __fact: factorial,
      Math: Math
    }

    // Build safe evaluator using Function with isolated scope
    const func = new Function(
      ...Object.keys(scope),
      '"use strict"; return (' + jsExpr + ');'
    )

    const result = func(...Object.values(scope))

    if (typeof result !== 'number' || !isFinite(result)) {
      return { success: false, error: 'Invalid result' }
    }

    const rounded = Math.abs(result) < 1e-10 ? 0 : parseFloat(result.toPrecision(12))
    return { success: true, value: rounded }
  } catch (error) {
    return { success: false, error: 'Invalid expression' }
  }
}

// ============================================
// FORMAT RESULT
// ============================================
export function formatResult(value) {
  if (typeof value !== 'number') return '0'

  if (Math.abs(value) >= 1e12 || (Math.abs(value) < 1e-6 && value !== 0)) {
    return value.toExponential(6)
  }

  let formatted = value.toFixed(10).replace(/\.?0+$/, '')
  const parts = formatted.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

// ============================================
// HISTORY
// ============================================
export function addToHistory(expression, result) {
  state.history.unshift({
    expression,
    result,
    timestamp: new Date().toISOString()
  })

  if (state.history.length > 20) {
    state.history = state.history.slice(0, 20)
  }

  try {
    localStorage.setItem('calc-history', JSON.stringify(state.history))
  } catch (e) {
    console.warn('Could not save history:', e)
  }
}

export function loadHistory() {
  try {
    const saved = localStorage.getItem('calc-history')
    if (saved) state.history = JSON.parse(saved)
  } catch (e) {
    console.warn('Could not load history:', e)
  }
}

// ============================================
// MEMORY FUNCTIONS
// ============================================
export function memoryClear() {
  state.memory = 0
  state.hasMemory = false
}

export function memoryRecall() {
  return state.memory
}

export function memoryAdd(value) {
  state.memory += value
  state.hasMemory = true
  return state.memory
}

export function memorySubtract(value) {
  state.memory -= value
  state.hasMemory = true
  return state.memory
}

export function memoryStore(value) {
  state.memory = value
  state.hasMemory = true
  return state.memory
}

// ============================================
// ANGLE MODE
// ============================================
export function setAngleMode(mode) {
  state.angleMode = mode
}

export function getAngleMode() {
  return state.angleMode
}

console.log('✅ Calculator logic loaded (pure JS, no mathjs)')