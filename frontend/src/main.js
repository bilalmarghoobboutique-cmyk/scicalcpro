// ============================================
// SciCalcPro — Scientific Calculator Main
// Author: Bilal Marghoob Creations
// ============================================

import './style.css'
import {
  calculate,
  formatResult,
  addToHistory,
  loadHistory,
  memoryClear,
  memoryRecall,
  memoryAdd,
  setAngleMode,
  state
} from './calculator.js'

console.log('🧮 SciCalcPro — Scientific Calculator loaded!')
console.log('👨‍💻 Bilal Marghoob Creations')

// ============================================
// SERVICE WORKER (PWA)
// ============================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

// ============================================
// HELP DATA
// ============================================
const helpData = {
  sin: { title: 'sin — Sine', icon: '📐', description: 'Calculates sine of an angle.', formula: 'sin(θ) = opposite / hypotenuse', examples: ['sin(0) = 0', 'sin(30) = 0.5', 'sin(90) = 1'], note: 'Check DEG/RAD mode first.' },
  cos: { title: 'cos — Cosine', icon: '📐', description: 'Calculates cosine of an angle.', formula: 'cos(θ) = adjacent / hypotenuse', examples: ['cos(0) = 1', 'cos(60) = 0.5', 'cos(90) = 0'], note: 'Check DEG/RAD mode first.' },
  tan: { title: 'tan — Tangent', icon: '📐', description: 'Calculates tangent of an angle.', formula: 'tan(θ) = sin(θ) / cos(θ)', examples: ['tan(0) = 0', 'tan(45) = 1'], note: 'tan(90) is undefined.' },
  log: { title: 'log — Base 10 Log', icon: '🔢', description: 'Base-10 logarithm.', formula: 'log(x) = y means 10^y = x', examples: ['log(10) = 1', 'log(100) = 2'], note: 'Only for positive numbers.' },
  ln: { title: 'ln — Natural Log', icon: '🔢', description: 'Natural logarithm (base e).', formula: 'ln(x) = y means e^y = x', examples: ['ln(1) = 0', 'ln(e) = 1'], note: 'Only for positive numbers.' },
  sqrt: { title: '√ — Square Root', icon: '√', description: 'Square root of a number.', formula: '√x × √x = x', examples: ['√4 = 2', '√9 = 3', '√16 = 4'], note: 'Negative numbers not supported.' },
  x2: { title: 'x² — Square', icon: '²', description: 'Square of a number.', formula: 'x² = x × x', examples: ['2² = 4', '5² = 25'], note: 'Common in area calculations.' },
  xy: { title: 'x^y — Power', icon: '^', description: 'x raised to power y.', formula: 'x^y', examples: ['2^3 = 8', '5^2 = 25'], note: 'Used in compound interest.' },
  pi: { title: 'π — Pi Constant', icon: 'π', description: 'Ratio of circumference to diameter.', formula: 'π = 3.14159...', examples: ['π × 2 = 6.283'], note: 'Used in circle calculations.' },
  e: { title: 'e — Euler\'s Number', icon: 'e', description: 'Base of natural logarithms.', formula: 'e = 2.71828...', examples: ['e^1 = 2.718'], note: 'Used in growth/decay.' },
  mc: { title: 'MC — Memory Clear', icon: '🗑️', description: 'Clears memory.', formula: 'Memory = 0', examples: ['Use before new problem'], note: 'Does not affect display.' },
  mr: { title: 'MR — Memory Recall', icon: '📤', description: 'Recalls stored value.', formula: 'Display = Memory', examples: ['MR shows stored value'], note: 'Memory persists.' },
  mplus: { title: 'M+ — Memory Add', icon: '➕', description: 'Adds display value to memory.', formula: 'Memory = Memory + Value', examples: ['M+ adds current value'], note: 'Perfect for running totals.' },
  openbracket: { title: '( — Open Bracket', icon: '🔓', description: 'Opens bracket for grouping.', formula: '(expression)', examples: ['(2 + 3) × 4 = 20'], note: 'Always close brackets.' },
  closebracket: { title: ') — Close Bracket', icon: '🔒', description: 'Closes the last open bracket.', formula: 'Closes most recent (', examples: ['(2 + 3) = 5'], note: '( count must equal ) count.' },
  ac: { title: 'AC — All Clear', icon: '🧹', description: 'Clears everything.', formula: 'Display = 0', examples: ['Press to start fresh'], note: 'Does not clear memory.' },
  c: { title: 'C — Clear', icon: '✖️', description: 'Clears current input only.', formula: 'Current = 0', examples: ['Clears wrong typing'], note: 'Expression remains.' },
  backspace: { title: '⌫ — Backspace', icon: '⬅️', description: 'Deletes last character.', formula: 'Removes last char', examples: ['123 → 12'], note: 'One character at a time.' },
  divide: { title: '÷ — Divide', icon: '➗', description: 'Divides first by second.', formula: 'a ÷ b', examples: ['20 ÷ 4 = 5'], note: 'Cannot divide by 0.' },
  percent: { title: '% — Percentage', icon: '％', description: 'Converts to percentage.', formula: 'x% = x / 100', examples: ['50% = 0.5'], note: 'For discounts and tax.' },
  multiply: { title: '× — Multiply', icon: '✖️', description: 'Multiplies two numbers.', formula: 'a × b', examples: ['6 × 7 = 42'], note: 'Also called "times".' },
  factorial: { title: 'x! — Factorial', icon: '❗', description: 'Multiplies n by all integers below it.', formula: 'n! = n × (n-1) × ... × 1', examples: ['5! = 120', '4! = 24'], note: 'For permutations.' },
  subtract: { title: '− — Subtract', icon: '➖', description: 'Subtracts second from first.', formula: 'a − b', examples: ['10 − 4 = 6'], note: 'Result can be negative.' },
  reciprocal: { title: '1/x — Reciprocal', icon: '🔃', description: 'Computes 1 divided by x.', formula: '1/x', examples: ['1/4 = 0.25'], note: '1/0 is undefined.' },
  add: { title: '+ — Add', icon: '➕', description: 'Adds numbers together.', formula: 'a + b', examples: ['5 + 3 = 8'], note: 'Simplest operation.' },
  togglesign: { title: '± — Toggle Sign', icon: '🔄', description: 'Switches positive/negative.', formula: 'x → -x', examples: ['5 → -5'], note: 'For negative numbers.' },
  equals: { title: '= — Equals', icon: '✅', description: 'Calculates final result.', formula: 'Expression → Result', examples: ['2 + 3 = 5'], note: 'Result can be reused.' }
}

// ============================================
// MAIN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const currentInput = document.getElementById('current-input')
  const previousExpression = document.getElementById('previous-expression')
  const memoryIndicator = document.getElementById('memory-indicator')
  const angleModeDisplay = document.getElementById('angle-mode')
  const angleLabel = document.getElementById('angle-label')
  const historyList = document.getElementById('history-list')
  const historyPanel = document.getElementById('history-panel')
  const helpDynamic = document.getElementById('help-dynamic')
  const helpDefault = document.getElementById('help-default')
  const helpToggle = document.getElementById('help-toggle')
  const helpContent = document.getElementById('help-content')

  const buttons = document.querySelectorAll('.btn')
  const modeToggle = document.getElementById('mode-toggle')
  const themeToggle = document.getElementById('theme-toggle')
  const historyToggle = document.getElementById('history-toggle')
  const clearHistoryBtn = document.getElementById('clear-history')

  loadHistory()
  renderHistory()

  let currentInputValue = '0'
  let expression = ''
  let waitingForOperand = false
  let lastWasEquals = false

  function updateDisplay() {
    if (currentInput) currentInput.textContent = currentInputValue
    if (previousExpression) previousExpression.textContent = expression || '\u00A0'
    if (memoryIndicator) {
      if (state.hasMemory) memoryIndicator.classList.add('active')
      else memoryIndicator.classList.remove('active')
    }
  }

  function renderHistory() {
    if (!historyList) return
    if (state.history.length === 0) {
      historyList.innerHTML = `
        <div class="history-empty">
          <div class="text-4xl mb-2">📭</div>
          <p>No calculations yet</p>
          <p class="text-xs opacity-60 mt-1">Your history will appear here</p>
        </div>
      `
      return
    }

    historyList.innerHTML = state.history
      .map((item, index) => `
        <div class="history-item" data-index="${index}">
          <div class="history-expression">${item.expression} =</div>
          <div class="history-result">${item.result}</div>
        </div>
      `)
      .join('')

    document.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index)
        const historyItem = state.history[index]
        if (historyItem) {
          currentInputValue = historyItem.result.replace(/,/g, '')
          lastWasEquals = true
          updateDisplay()
          flashResult()
        }
      })
    })
  }

  function flashResult() {
    if (currentInput) {
      currentInput.classList.add('result-flash')
      setTimeout(() => currentInput.classList.remove('result-flash'), 400)
    }
  }

  function showError() {
    if (currentInput) {
      currentInput.classList.add('error-state')
      setTimeout(() => currentInput.classList.remove('error-state'), 400)
    }
  }

  function handleNumber(num) {
    if (waitingForOperand || lastWasEquals) {
      currentInputValue = num
      waitingForOperand = false
      lastWasEquals = false
    } else {
      if (currentInputValue === '0') {
        currentInputValue = num
      } else {
        currentInputValue += num
      }
    }
    updateDisplay()
  }

  function handleDecimal() {
    if (waitingForOperand || lastWasEquals) {
      currentInputValue = '0.'
      waitingForOperand = false
      lastWasEquals = false
    } else if (!currentInputValue.includes('.')) {
      currentInputValue += '.'
    }
    updateDisplay()
  }

  function handleOperator(op) {
    if (waitingForOperand) {
      expression = expression.slice(0, -1) + op
    } else {
      expression += currentInputValue + op
      waitingForOperand = true
    }
    updateDisplay()
  }

  function handleEquals() {
    if (!expression) return

    const fullExpression = expression + currentInputValue
    const result = calculate(fullExpression)

    if (result.success) {
      const formatted = formatResult(result.value)
      if (previousExpression) previousExpression.textContent = fullExpression + ' ='
      currentInputValue = formatted
      expression = ''
      addToHistory(fullExpression, formatted)
      state.lastAnswer = result.value
      flashResult()
    } else {
      currentInputValue = 'Error'
      expression = ''
      if (previousExpression) previousExpression.textContent = result.error
      showError()
    }

    waitingForOperand = false
    lastWasEquals = true
    updateDisplay()
    renderHistory()
  }

  function handleFunction(func) {
    const num = parseFloat(currentInputValue.replace(/,/g, ''))
    if (isNaN(num)) return

    let result
    let displayExpr

    switch (func) {
      case 'sin': result = calculate(`sin(${num})`); displayExpr = `sin(${num})`; break
      case 'cos': result = calculate(`cos(${num})`); displayExpr = `cos(${num})`; break
      case 'tan': result = calculate(`tan(${num})`); displayExpr = `tan(${num})`; break
      case 'log': result = calculate(`log(${num})`); displayExpr = `log(${num})`; break
      case 'ln': result = calculate(`ln(${num})`); displayExpr = `ln(${num})`; break
      case '√': result = calculate(`sqrt(${num})`); displayExpr = `√(${num})`; break
      case 'x²': result = calculate(`${num}^2`); displayExpr = `(${num})²`; break
      case '1/x': result = calculate(`1/(${num})`); displayExpr = `1/(${num})`; break
      case '!': result = calculate(`${num}!`); displayExpr = `${num}!`; break
      case '%': result = calculate(`(${num})/100`); displayExpr = `${num}%`; break
      case '+/-':
        currentInputValue = String(num * -1)
        updateDisplay()
        return
      case 'x^y':
        expression += num + '^'
        currentInputValue = '0'
        waitingForOperand = true
        if (previousExpression) previousExpression.textContent = expression
        updateDisplay()
        return
      default: return
    }

    if (result.success) {
      currentInputValue = formatResult(result.value)
      if (previousExpression) previousExpression.textContent = displayExpr + ' ='
      addToHistory(displayExpr, currentInputValue)
      flashResult()
    } else {
      currentInputValue = 'Error'
      if (previousExpression) previousExpression.textContent = result.error
      showError()
    }

    waitingForOperand = false
    lastWasEquals = true
    updateDisplay()
    renderHistory()
  }

  function showHelp(helpKey) {
    if (!helpDynamic || !helpDefault) return
    const help = helpData[helpKey]
    if (!help) return

    const examplesHTML = help.examples.map(ex => `<div class="help-example-item">${ex}</div>`).join('')

    helpDynamic.innerHTML = `
      <div class="help-btn-title">
        <span class="help-btn-icon">${help.icon}</span>
        <span>${help.title}</span>
      </div>
      <div class="help-section">
        <div class="help-section-label">📝 What it does</div>
        <div class="help-section-text">${help.description}</div>
      </div>
      <div class="help-section">
        <div class="help-section-label">📐 Formula</div>
        <div class="help-formula">${help.formula}</div>
      </div>
      <div class="help-section">
        <div class="help-section-label">💡 Examples</div>
        ${examplesHTML}
      </div>
      ${help.note ? `<div class="help-note"><span class="help-note-icon">⚠️</span><span>${help.note}</span></div>` : ''}
    `

    helpDefault.classList.add('hidden')
    helpDynamic.classList.remove('hidden')
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.action

      if (!isNaN(action) && action !== '' && action !== undefined) { handleNumber(action); return }
      if (action === '.') { handleDecimal(); return }
      if (['+', '-', '×', '÷'].includes(action)) { handleOperator(action); return }
      if (action === '=') { handleEquals(); return }

      if (action === 'AC' || action === 'C') {
        currentInputValue = '0'
        expression = ''
        waitingForOperand = false
        lastWasEquals = false
        if (previousExpression) previousExpression.textContent = '\u00A0'
        updateDisplay()
        return
      }

      if (action === '⌫') {
        if (currentInputValue.length > 1) {
          currentInputValue = currentInputValue.slice(0, -1)
        } else {
          currentInputValue = '0'
        }
        updateDisplay()
        return
      }

      if (['sin', 'cos', 'tan', 'log', 'ln', '√', 'x²', 'x^y', '1/x', '!', '+/-', '%'].includes(action)) {
        handleFunction(action)
        return
      }

      if (action === 'π') { currentInputValue = String(Math.PI); updateDisplay(); return }
      if (action === 'e') { currentInputValue = String(Math.E); updateDisplay(); return }
      if (action === '(' || action === ')') { expression += action; updateDisplay(); return }

      if (action === 'MC') { memoryClear(); updateDisplay(); return }
      if (action === 'MR') { currentInputValue = String(memoryRecall()); updateDisplay(); return }
      if (action === 'M+') { memoryAdd(parseFloat(currentInputValue.replace(/,/g, '')) || 0); updateDisplay(); return }
    })

    const helpKey = button.dataset.help
    if (helpKey) {
      button.addEventListener('mouseenter', () => showHelp(helpKey))
      button.addEventListener('touchstart', () => showHelp(helpKey), { passive: true })
    }
  })

  if (helpToggle && helpContent) {
    helpToggle.addEventListener('click', () => {
      helpContent.classList.toggle('collapsed')
      helpToggle.textContent = helpContent.classList.contains('collapsed') ? '▼' : '▲'
    })
  }

  if (historyToggle && historyPanel) {
    historyToggle.addEventListener('click', () => {
      historyPanel.classList.toggle('hidden')
    })
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm('Clear all history?')) {
        state.history = []
        localStorage.removeItem('calc-history')
        renderHistory()
      }
    })
  }

  const angleModes = ['DEG', 'RAD', 'GRAD']
  let currentAngleIndex = 0

  if (modeToggle) {
    modeToggle.addEventListener('click', () => {
      currentAngleIndex = (currentAngleIndex + 1) % angleModes.length
      const newMode = angleModes[currentAngleIndex]
      setAngleMode(newMode)
      if (angleModeDisplay) angleModeDisplay.textContent = newMode
      if (angleLabel) angleLabel.textContent = newMode
    })
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode')
      const isLight = document.body.classList.contains('light-mode')
      themeToggle.innerHTML = isLight
        ? '☀️ <span class="btn-label">Light</span>'
        : '🌙 <span class="btn-label">Dark</span>'
    })
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

    const key = e.key
    if (key >= '0' && key <= '9') handleNumber(key)
    else if (key === '.') handleDecimal()
    else if (key === '+') handleOperator('+')
    else if (key === '-') handleOperator('-')
    else if (key === '*') handleOperator('×')
    else if (key === '/') { e.preventDefault(); handleOperator('÷') }
    else if (key === 'Enter' || key === '=') { e.preventDefault(); handleEquals() }
    else if (key === 'Backspace') {
      e.preventDefault()
      if (currentInputValue.length > 1) currentInputValue = currentInputValue.slice(0, -1)
      else currentInputValue = '0'
      updateDisplay()
    }
    else if (key === 'Escape') {
      currentInputValue = '0'
      expression = ''
      if (previousExpression) previousExpression.textContent = '\u00A0'
      updateDisplay()
    }
  })

  updateDisplay()
  console.log('✅ Scientific Calculator ready — try 789 × 2 =')
})