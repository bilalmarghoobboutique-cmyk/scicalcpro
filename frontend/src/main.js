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
import { inject } from '@vercel/analytics'

// Initialize Vercel Web Analytics
inject()

console.log('🧮 SciCalcPro — Calculator loaded!')
console.log('👨‍💻 Bilal Marghoob Creations')

// ============================================
// HELP DATA — Complete Guide for Every Button
// ============================================
const helpData = {
  sin: {
    title: 'sin — Sine Function',
    icon: '📐',
    description: 'Calculates the sine of an angle. Sine is the ratio of the opposite side to the hypotenuse in a right triangle.',
    formula: 'sin(θ) = opposite / hypotenuse',
    examples: ['sin(0) = 0', 'sin(30) = 0.5', 'sin(45) = 0.707', 'sin(90) = 1'],
    note: 'Check DEG/RAD mode before calculating. DEG is for degrees (0-360°), RAD is for radians.'
  },
  cos: {
    title: 'cos — Cosine Function',
    icon: '📐',
    description: 'Calculates the cosine of an angle. Cosine is the ratio of the adjacent side to the hypotenuse.',
    formula: 'cos(θ) = adjacent / hypotenuse',
    examples: ['cos(0) = 1', 'cos(60) = 0.5', 'cos(90) = 0', 'cos(180) = -1'],
    note: 'Check DEG/RAD mode before calculating.'
  },
  tan: {
    title: 'tan — Tangent Function',
    icon: '📐',
    description: 'Calculates the tangent of an angle. Tangent is the ratio of sine to cosine.',
    formula: 'tan(θ) = opposite / adjacent = sin(θ) / cos(θ)',
    examples: ['tan(0) = 0', 'tan(45) = 1', 'tan(60) = 1.732'],
    note: 'tan(90) is undefined. Check your angle mode.'
  },
  log: {
    title: 'log — Logarithm Base 10',
    icon: '🔢',
    description: 'Calculates the base-10 logarithm of a number. Answers the question: "10 to what power gives this number?"',
    formula: 'log(x) = y means 10^y = x',
    examples: ['log(1) = 0', 'log(10) = 1', 'log(100) = 2', 'log(1000) = 3'],
    note: 'Only works for positive numbers. log(0) and log(-1) are undefined.'
  },
  ln: {
    title: 'ln — Natural Logarithm',
    icon: '🔢',
    description: 'Calculates the natural logarithm (base e) of a number. Used in exponential growth and decay.',
    formula: 'ln(x) = y means e^y = x (where e = 2.71828...)',
    examples: ['ln(1) = 0', 'ln(e) = 1', 'ln(10) = 2.302', 'ln(100) = 4.605'],
    note: 'Only works for positive numbers.'
  },
  sqrt: {
    title: '√ — Square Root',
    icon: '√',
    description: 'Calculates the square root of a number. The square root of x is the value that, when multiplied by itself, gives x.',
    formula: '√x × √x = x',
    examples: ['√4 = 2', '√9 = 3', '√16 = 4', '√25 = 5', '√2 = 1.414'],
    note: 'Cannot calculate square root of negative numbers in real numbers.'
  },
  x2: {
    title: 'x² — Square',
    icon: '²',
    description: 'Calculates the square of a number (multiplies it by itself).',
    formula: 'x² = x × x',
    examples: ['2² = 4', '3² = 9', '5² = 25', '10² = 100'],
    note: 'Commonly used in area and energy calculations.'
  },
  xy: {
    title: 'x^y — Power',
    icon: '^',
    description: 'Calculates x raised to the power y. Multiplies x by itself y times.',
    formula: 'x^y = x × x × ... (y times)',
    examples: ['2^3 = 8', '5^2 = 25', '10^4 = 10000', '3^4 = 81'],
    note: 'Used for compound interest, exponential growth, and scientific notation.'
  },
  pi: {
    title: 'π — Pi Constant',
    icon: 'π',
    description: 'Inserts the mathematical constant Pi (π), which is the ratio of a circle\'s circumference to its diameter.',
    formula: 'π = 3.141592653589793...',
    examples: ['π × 2 = 6.283', 'π × 5 = 15.708', 'π × 10 = 31.416'],
    note: 'Used in circle, sphere, and angular calculations.'
  },
  e: {
    title: 'e — Euler\'s Number',
    icon: 'e',
    description: 'Inserts Euler\'s number (e), the base of natural logarithms. Used in exponential growth/decay.',
    formula: 'e = 2.718281828459045...',
    examples: ['e¹ = 2.718', 'e² = 7.389', 'e^0 = 1'],
    note: 'Used in natural growth, decay, and calculus.'
  },
  mc: {
    title: 'MC — Memory Clear',
    icon: '🗑️',
    description: 'Clears the stored value in memory. The memory becomes empty (0).',
    formula: 'Memory = 0',
    examples: ['Use after finishing calculations', 'Use before starting a new problem'],
    note: 'Does not affect current display or expression.'
  },
  mr: {
    title: 'MR — Memory Recall',
    icon: '📤',
    description: 'Recalls the value stored in memory and displays it on the screen.',
    formula: 'Display = Memory',
    examples: ['If 50 is stored, MR shows 50', 'Use in multi-step calculations'],
    note: 'Memory persists even after clearing the display.'
  },
  mplus: {
    title: 'M+ — Memory Add',
    icon: '➕',
    description: 'Adds the current value on the display to the value stored in memory.',
    formula: 'Memory = Memory + Current Value',
    examples: ['Store 25 with M+', 'Then store 35 with M+', 'MR shows 60 (25+35)'],
    note: 'Perfect for calculating running totals.'
  },
  openbracket: {
    title: '( — Open Bracket',
    icon: '🔓',
    description: 'Opens a bracket for grouping calculations. Operations inside brackets are calculated first.',
    formula: '(expression)',
    examples: ['(2 + 3) × 4 = 20', '2 × (5 + 3) = 16'],
    note: 'Always close brackets with ). Unclosed brackets cause errors.'
  },
  closebracket: {
    title: ') — Close Bracket',
    icon: '🔒',
    description: 'Closes a bracket that was previously opened.',
    formula: 'Closes the most recent (',
    examples: ['(2 + 3) = 5', '((2 + 3) × 4) = 20'],
    note: 'Number of ( must equal number of ).'
  },
  ac: {
    title: 'AC — All Clear',
    icon: '🧹',
    description: 'Clears everything: the display, the current expression, and resets to 0.',
    formula: 'Display = 0, Expression = Empty',
    examples: ['Press AC to start fresh', 'Use when you make a mistake'],
    note: 'Does not clear memory. Use MC for that.'
  },
  c: {
    title: 'C — Clear',
    icon: '✖️',
    description: 'Clears only the current input, not the entire expression.',
    formula: 'Current input = 0',
    examples: ['If typing 123, C clears to 0', 'Expression before remains'],
    note: 'Useful when you typed wrong number.'
  },
  backspace: {
    title: '⌫ — Backspace',
    icon: '⬅️',
    description: 'Deletes the last digit or character you typed.',
    formula: 'Removes last character',
    examples: ['123 → 12', '1234 → 123', '5.67 → 5.6'],
    note: 'Works one character at a time.'
  },
  divide: {
    title: '÷ — Divide',
    icon: '➗',
    description: 'Divides the first number by the second number.',
    formula: 'a ÷ b = a / b',
    examples: ['20 ÷ 4 = 5', '100 ÷ 10 = 10', '7 ÷ 2 = 3.5'],
    note: 'Cannot divide by zero — you will get an error.'
  },
  percent: {
    title: '% — Percentage',
    icon: '％',
    description: 'Converts a number to its percentage (divides by 100).',
    formula: 'x% = x / 100',
    examples: ['50% = 0.5', '25% = 0.25', '100% = 1', '150% = 1.5'],
    note: 'Useful for discounts, tax, and interest calculations.'
  },
  multiply: {
    title: '× — Multiply',
    icon: '✖️',
    description: 'Multiplies two numbers together.',
    formula: 'a × b',
    examples: ['6 × 7 = 42', '12 × 12 = 144', '0.5 × 100 = 50'],
    note: 'Also known as "times" or "product".'
  },
  factorial: {
    title: 'x! — Factorial',
    icon: '❗',
    description: 'Calculates the factorial of a number. Multiplies the number by all positive integers below it.',
    formula: 'n! = n × (n-1) × (n-2) × ... × 1',
    examples: ['5! = 120', '4! = 24', '3! = 6', '0! = 1'],
    note: 'Used in permutations, combinations, and probability.'
  },
  subtract: {
    title: '− — Subtract',
    icon: '➖',
    description: 'Subtracts the second number from the first number.',
    formula: 'a − b',
    examples: ['10 − 4 = 6', '100 − 25 = 75', '5 − 8 = -3'],
    note: 'Result can be negative.'
  },
  reciprocal: {
    title: '1/x — Reciprocal',
    icon: '🔃',
    description: 'Calculates the reciprocal of a number (1 divided by the number).',
    formula: '1/x',
    examples: ['1/4 = 0.25', '1/2 = 0.5', '1/10 = 0.1'],
    note: 'Cannot calculate 1/0 (undefined).'
  },
  add: {
    title: '+ — Add',
    icon: '➕',
    description: 'Adds two or more numbers together.',
    formula: 'a + b',
    examples: ['5 + 3 = 8', '100 + 50 = 150', '0.5 + 0.5 = 1'],
    note: 'Simplest operation — used everywhere.'
  },
  togglesign: {
    title: '± — Toggle Sign',
    icon: '🔄',
    description: 'Switches the sign of the current number between positive and negative.',
    formula: 'x → -x or -x → x',
    examples: ['5 → -5', '-10 → 10', '0 → 0'],
    note: 'Useful for negative numbers in equations.'
  },
  equals: {
    title: '= — Equals',
    icon: '✅',
    description: 'Calculates and shows the final result of the current expression.',
    formula: 'Expression → Result',
    examples: ['2 + 3 = 5', '5 × 6 = 30', '100 ÷ 4 = 25'],
    note: 'After pressing =, you can start a new calculation or use the result.'
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
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

  // ============================================
  // UPDATE DISPLAY
  // ============================================
  function updateDisplay() {
    currentInput.textContent = currentInputValue
    previousExpression.textContent = expression || '\u00A0'
    if (state.hasMemory) {
      memoryIndicator.classList.add('active')
    } else {
      memoryIndicator.classList.remove('active')
    }
  }

  // ============================================
  // RENDER HISTORY
  // ============================================
  function renderHistory() {
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

  // ============================================
  // FLASH RESULT ANIMATION
  // ============================================
  function flashResult() {
    currentInput.classList.add('result-flash')
    setTimeout(() => currentInput.classList.remove('result-flash'), 400)
  }

  function showError() {
    currentInput.classList.add('error-state')
    setTimeout(() => currentInput.classList.remove('error-state'), 400)
  }

  // ============================================
  // NUMBER INPUT
  // ============================================
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

  // ============================================
  // DECIMAL
  // ============================================
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

  // ============================================
  // OPERATOR
  // ============================================
  function handleOperator(op) {
    if (waitingForOperand) {
      expression = expression.slice(0, -1) + op
    } else {
      expression += currentInputValue + op
      waitingForOperand = true
    }
    updateDisplay()
  }

  // ============================================
  // EQUALS
  // ============================================
  function handleEquals() {
    if (!expression) return

    const fullExpression = expression + currentInputValue
    const result = calculate(fullExpression)

    if (result.success) {
      const formatted = formatResult(result.value)
      previousExpression.textContent = fullExpression + ' ='
      currentInputValue = formatted
      expression = ''
      addToHistory(fullExpression, formatted)
      state.lastAnswer = result.value
      flashResult()
    } else {
      currentInputValue = 'Error'
      expression = ''
      previousExpression.textContent = result.error
      showError()
    }

    waitingForOperand = false
    lastWasEquals = true
    updateDisplay()
    renderHistory()
  }

  // ============================================
  // SCIENTIFIC FUNCTIONS
  // ============================================
  function handleFunction(func) {
    const num = parseFloat(currentInputValue)
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
      case '!': result = calculate(`factorial(${num})`); displayExpr = `${num}!`; break
      case '%': result = calculate(`(${num})/100`); displayExpr = `${num}%`; break
      case '+/-':
        currentInputValue = String(num * -1)
        updateDisplay()
        return
      case 'x^y':
        expression += num + '^'
        currentInputValue = '0'
        waitingForOperand = true
        previousExpression.textContent = expression
        updateDisplay()
        return
      default: return
    }

    if (result.success) {
      currentInputValue = formatResult(result.value)
      previousExpression.textContent = displayExpr + ' ='
      addToHistory(displayExpr, currentInputValue)
      flashResult()
    } else {
      currentInputValue = 'Error'
      previousExpression.textContent = result.error
      showError()
    }

    waitingForOperand = false
    lastWasEquals = true
    updateDisplay()
    renderHistory()
  }

  // ============================================
  // HELP SIDEBAR — Show Help
  // ============================================
  function showHelp(helpKey) {
    if (!helpDynamic || !helpDefault) return

    const help = helpData[helpKey]
    if (!help) return

    // Build HTML
    const examplesHTML = help.examples
      .map(ex => `<div class="help-example-item">${ex}</div>`)
      .join('')

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

      ${help.note ? `
        <div class="help-note">
          <span class="help-note-icon">⚠️</span>
          <span>${help.note}</span>
        </div>
      ` : ''}
    `

    helpDefault.classList.add('hidden')
    helpDynamic.classList.remove('hidden')
  }

  function resetHelp() {
    if (!helpDynamic || !helpDefault) return
    helpDynamic.classList.add('hidden')
    helpDefault.classList.remove('hidden')
  }

  // ============================================
  // BUTTON CLICK HANDLER
  // ============================================
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.action

      if (!isNaN(action) && action !== '') { handleNumber(action); return }
      if (action === '.') { handleDecimal(); return }
      if (['+', '-', '×', '÷'].includes(action)) { handleOperator(action); return }
      if (action === '=') { handleEquals(); return }

      if (action === 'AC' || action === 'C') {
        currentInputValue = '0'
        expression = ''
        waitingForOperand = false
        lastWasEquals = false
        previousExpression.textContent = '\u00A0'
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
      if (action === 'M+') { memoryAdd(parseFloat(currentInputValue) || 0); updateDisplay(); return }
    })

    // ============================================
    // HOVER / TAP — Show Help in Sidebar
    // ============================================
    const helpKey = button.dataset.help
    if (helpKey) {
      // Desktop hover
      button.addEventListener('mouseenter', () => {
        showHelp(helpKey)
      })

      // Mobile tap (also for desktop click)
      button.addEventListener('touchstart', () => {
        showHelp(helpKey)
      }, { passive: true })
    }
  })

  // ============================================
  // HELP TOGGLE (Mobile)
  // ============================================
  if (helpToggle && helpContent) {
    helpToggle.addEventListener('click', () => {
      helpContent.classList.toggle('collapsed')
      helpToggle.textContent = helpContent.classList.contains('collapsed') ? '▼' : '▲'
    })
  }

  // ============================================
  // HISTORY PANEL TOGGLE
  // ============================================
  if (historyToggle) {
    historyToggle.addEventListener('click', () => {
      historyPanel.classList.toggle('hidden')
    })
  }

  // ============================================
  // CLEAR HISTORY
  // ============================================
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm('Clear all history?')) {
        state.history = []
        localStorage.removeItem('calc-history')
        renderHistory()
      }
    })
  }

  // ============================================
  // ANGLE MODE TOGGLE
  // ============================================
  const angleModes = ['DEG', 'RAD', 'GRAD']
  let currentAngleIndex = 0

  if (modeToggle) {
    modeToggle.addEventListener('click', () => {
      currentAngleIndex = (currentAngleIndex + 1) % angleModes.length
      const newMode = angleModes[currentAngleIndex]
      setAngleMode(newMode)
      angleModeDisplay.textContent = newMode
      angleLabel.textContent = newMode
      console.log('Angle mode:', newMode)
    })
  }

  // ============================================
  // THEME TOGGLE
  // ============================================
  let isDark = true

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      isDark = !isDark
      if (isDark) {
        document.body.style.background = 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0a0e27 100%)'
        themeToggle.innerHTML = '🌙 <span class="hidden md:inline">Dark</span>'
      } else {
        document.body.style.background = 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 50%, #f0f4ff 100%)'
        themeToggle.innerHTML = '☀️ <span class="hidden md:inline">Light</span>'
      }
    })
  }

  // ============================================
  // KEYBOARD SUPPORT
  // ============================================
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
      if (currentInputValue.length > 1) {
        currentInputValue = currentInputValue.slice(0, -1)
      } else {
        currentInputValue = '0'
      }
      updateDisplay()
    }
    else if (key === 'Escape') {
      currentInputValue = '0'
      expression = ''
      previousExpression.textContent = '\u00A0'
      updateDisplay()
    }
  })

  updateDisplay()
  console.log('✅ Calculator ready — try 789 × 2 =')
  console.log('📖 Hover over any button to see its complete guide')
})