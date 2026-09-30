// ============================================
// SciCalcPro — Calculator Logic
// Author: Bilal Marghoob Creations
// ============================================

import { evaluate, factorial, sqrt, log, log10 } from 'mathjs'

// ============================================
// CALCULATOR STATE
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
function toRadians(value, mode) {
  if (mode === 'DEG') return (value * Math.PI) / 180
  if (mode === 'GRAD') return (value * Math.PI) / 200
  return value
}

// ============================================
// CUSTOM FUNCTIONS FOR MATH.JS
// ============================================
const customScope = {
  sin: (x) => Math.sin(toRadians(x, state.angleMode)),
  cos: (x) => Math.cos(toRadians(x, state.angleMode)),
  tan: (x) => Math.tan(toRadians(x, state.angleMode)),
  asin: (x) => {
    const result = Math.asin(x)
    return state.angleMode === 'DEG' ? (result * 180) / Math.PI :
           state.angleMode === 'GRAD' ? (result * 200) / Math.PI : result
  },
  acos: (x) => {
    const result = Math.acos(x)
    return state.angleMode === 'DEG' ? (result * 180) / Math.PI :
           state.angleMode === 'GRAD' ? (result * 200) / Math.PI : result
  },
  atan: (x) => {
    const result = Math.atan(x)
    return state.angleMode === 'DEG' ? (result * 180) / Math.PI :
           state.angleMode === 'GRAD' ? (result * 200) / Math.PI : result
  },
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  log: log10,
  ln: log,
  sqrt: sqrt,
  factorial: factorial,
  pi: Math.PI,
  e: Math.E
}

// ============================================
// EVALUATE EXPRESSION
// ============================================
export function calculate(expression) {
  try {
    if (!expression || expression.trim() === '') {
      return { success: false, error: 'Empty expression' }
    }

    let parsedExpr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'pi')
      .replace(/√/g, 'sqrt')
      .replace(/x²/g, '^2')
      .replace(/x³/g, '^3')

    const result = evaluate(parsedExpr, customScope)

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

console.log('✅ Calculator logic module loaded')