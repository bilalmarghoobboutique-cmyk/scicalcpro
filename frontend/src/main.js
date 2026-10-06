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

console.log('🧮 SciCalcPro — Calculator loaded!')
console.log('👨‍💻 Bilal Marghoob Creations')

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const currentInput = document.getElementById('current-input')
  const previousExpression = document.getElementById('previous-expression')
  const memoryIndicator = document.getElementById('memory-indicator')
  const angleModeDisplay = document.getElementById('angle-mode')
  const angleLabel = document.getElementById('angle-label')
  const historyList = document.getElementById('history-list')
  const historyPanel = document.getElementById('history-panel')

  const buttons = document.querySelectorAll('.btn')
  const modeToggle = document.getElementById('mode-toggle')
  const themeToggle = document.getElementById('theme-toggle')
  const historyToggle = document.getElementById('history-toggle')
  const clearHistoryBtn = document.getElementById('clear-history')
  const categoryButtons = document.querySelectorAll('.category-btn')

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
  })

  // ============================================
  // CATEGORY BUTTONS
  // ============================================
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category
      console.log('Category clicked:', category)

      // Remove active from all
      categoryButtons.forEach(b => b.classList.remove('active'))
      // Add active to clicked
      btn.classList.add('active')

      // Future: navigate to category page
      // For now, just log
      if (category !== 'scientific') {
        // Placeholder for future pages
        alert(`${category.charAt(0).toUpperCase() + category.slice(1)} Calculator coming soon!`)
      }
    })
  })

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
})