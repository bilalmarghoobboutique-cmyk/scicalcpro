import './style.css'

console.log('⚙️ Engineering Calculator — SciCalcPro')
console.log('👨‍💻 Bilal Marghoob Creations')

// ============================================
// HELP DATA
// ============================================
const helpData = {
  'name-input': {
    title: 'Your Name',
    icon: '👤',
    description: 'Optional. Enter your name for personalized result and printed receipt.',
    formula: 'Optional — can be left empty',
    examples: ['Ahmed', 'Engineer Ali', 'Leave empty'],
    note: 'Maximum 30 characters.'
  },
  'eng-selector': {
    title: 'Calculator Type',
    icon: '⚡',
    description: 'Choose between Ohm\'s Law, Power, or Energy calculations.',
    formula: 'Ohm\'s Law: V = I × R | Power: P = V × I | Energy: E = P × t',
    examples: ['Ohm\'s Law — Voltage, Current, Resistance', 'Power — Voltage × Current', 'Energy — Power × Time'],
    note: 'Different inputs will appear for each type.'
  },
  'ohm-voltage': {
    title: 'Voltage (Ohm\'s Law)',
    icon: '⚡',
    description: 'Electrical potential difference. Measured in Volts (V).',
    formula: 'V = I × R',
    examples: ['Voltage = 12V', 'Voltage = 220V'],
    note: 'Leave empty if you want to calculate it from Current and Resistance.'
  },
  'ohm-current': {
    title: 'Current (Ohm\'s Law)',
    icon: '🔌',
    description: 'Flow of electric charge. Measured in Amperes (A).',
    formula: 'I = V / R',
    examples: ['Current = 2A', 'Current = 0.5A'],
    note: 'Leave empty if you want to calculate it from Voltage and Resistance.'
  },
  'ohm-resistance': {
    title: 'Resistance (Ohm\'s Law)',
    icon: '⚙️',
    description: 'Opposition to current flow. Measured in Ohms (Ω).',
    formula: 'R = V / I',
    examples: ['Resistance = 100Ω', 'Resistance = 4.7kΩ'],
    note: 'Leave empty if you want to calculate it from Voltage and Current.'
  },
  'power-voltage': {
    title: 'Voltage (Power)',
    icon: '⚡',
    description: 'Electrical potential difference in Volts.',
    formula: 'P = V × I',
    examples: ['Voltage = 220V', 'Voltage = 12V'],
    note: 'Required for Power calculation.'
  },
  'power-current': {
    title: 'Current (Power)',
    icon: '🔌',
    description: 'Flow of electric charge in Amperes.',
    formula: 'P = V × I',
    examples: ['Current = 5A', 'Current = 0.5A'],
    note: 'Required for Power calculation.'
  },
  'energy-power': {
    title: 'Power (Energy)',
    icon: '⚡',
    description: 'Rate of energy consumption in Watts.',
    formula: 'E = P × t',
    examples: ['Power = 1000W', 'Power = 60W'],
    note: 'Required for Energy calculation.'
  },
  'energy-time': {
    title: 'Time (Energy)',
    icon: '⏱️',
    description: 'Duration of power usage in Hours.',
    formula: 'E = P × t',
    examples: ['Time = 5 hours', 'Time = 24 hours'],
    note: 'Required for Energy calculation.'
  },
  'calculate-eng': {
    title: 'Calculate Button',
    icon: '✨',
    description: 'Calculates the missing value based on the selected calculator type.',
    formula: 'Click to calculate',
    examples: ['Ohm\'s Law with V=12, I=2 → V=12V', 'Power with V=220, I=5 → P=1100W'],
    note: 'For Ohm\'s Law, leave 1 field empty.'
  },
  'reset-eng': {
    title: 'Reset Button',
    icon: '🔄',
    description: 'Clears all inputs and results. Use it for a new calculation.',
    formula: 'Clears all fields',
    examples: ['After showing result', 'For new calculation'],
    note: 'Does not affect other pages.'
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name-input')
  const engBtns = document.querySelectorAll('.eng-btn')
  const engGroups = document.querySelectorAll('.eng-input-group')
  const calculateBtn = document.getElementById('calculate-eng')
  const resetBtn = document.getElementById('reset-eng')
  const printResultBtn = document.getElementById('print-result-btn')
  const resultDiv = document.getElementById('eng-result')
  const themeToggle = document.getElementById('theme-toggle')
  const printBtn = document.getElementById('print-btn')
  const helpDynamic = document.getElementById('help-dynamic')
  const helpDefault = document.getElementById('help-default')
  const helpToggle = document.getElementById('help-toggle')
  const helpContent = document.getElementById('help-content')

  const printModal = document.getElementById('print-modal')
  const printModalOverlay = document.getElementById('print-modal-overlay')
  const printModalClose = document.getElementById('print-modal-close')
  const printAction = document.getElementById('print-action')
  const pdfAction = document.getElementById('pdf-action')
  const shareAction = document.getElementById('share-action')

  let currentEng = 'ohm'
  let lastCalculation = null
  let qrCodeInstance = null

  // ============================================
  // CALCULATOR TYPE SELECTOR
  // ============================================
  engBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentEng = btn.dataset.eng
      engBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      engGroups.forEach(g => {
        g.classList.toggle('hidden', g.dataset.eng !== currentEng)
      })
    })
  })

  // ============================================
  // CALCULATE
  // ============================================
  function calculateEng() {
    const nameValue = nameInput.value.trim()
    let result = 0, formula = '', unit = '', typeName = '', inputs = ''

    if (currentEng === 'ohm') {
      const v = parseFloat(document.getElementById('ohm-voltage').value)
      const i = parseFloat(document.getElementById('ohm-current').value)
      const r = parseFloat(document.getElementById('ohm-resistance').value)

      const count = [v, i, r].filter(x => !isNaN(x)).length
      if (count < 2) {
        alert('Please enter at least 2 values')
        return
      }

      if (isNaN(v)) {
        result = i * r
        formula = 'V = I × R'
        unit = 'Volts'
        typeName = 'Ohm\'s Law — Voltage'
        inputs = `I = ${i}A, R = ${r}Ω`
      } else if (isNaN(i)) {
        result = v / r
        formula = 'I = V / R'
        unit = 'Amperes'
        typeName = 'Ohm\'s Law — Current'
        inputs = `V = ${v}V, R = ${r}Ω`
      } else if (isNaN(r)) {
        result = v / i
        formula = 'R = V / I'
        unit = 'Ohms'
        typeName = 'Ohm\'s Law — Resistance'
        inputs = `V = ${v}V, I = ${i}A`
      } else {
        result = v
        formula = 'V = I × R'
        unit = 'Volts'
        typeName = 'Ohm\'s Law — Voltage'
        inputs = `V = ${v}V, I = ${i}A, R = ${r}Ω`
      }

    } else if (currentEng === 'power') {
      const v = parseFloat(document.getElementById('power-voltage').value)
      const i = parseFloat(document.getElementById('power-current').value)
      if (isNaN(v) || isNaN(i)) {
        alert('Please enter voltage and current')
        return
      }
      result = v * i
      formula = 'P = V × I'
      unit = 'Watts'
      typeName = 'Electrical Power'
      inputs = `V = ${v}V, I = ${i}A`

    } else if (currentEng === 'energy') {
      const p = parseFloat(document.getElementById('energy-power').value)
      const t = parseFloat(document.getElementById('energy-time').value)
      if (isNaN(p) || isNaN(t)) {
        alert('Please enter power and time')
        return
      }
      result = p * t
      formula = 'E = P × t'
      unit = 'Watt-hours'
      typeName = 'Energy'
      inputs = `P = ${p}W, t = ${t}h`
    }

    lastCalculation = {
      name: nameValue,
      typeName: typeName,
      inputs: inputs,
      formula: formula,
      result: result,
      unit: unit
    }

    document.getElementById('result-greeting').textContent = 
      nameValue ? `${nameValue}'s Result` : 'Result'

    document.getElementById('eng-display').textContent = result.toFixed(4) + ' ' + unit
    document.getElementById('eng-formula').textContent = formula
    document.getElementById('eng-unit').textContent = unit

    resultDiv.classList.remove('hidden')
    resultDiv.classList.add('fade-in')
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  // ============================================
  // RESET
  // ============================================
  function resetEng() {
    nameInput.value = ''
    document.querySelectorAll('.age-input').forEach(i => i.value = '')
    resultDiv.classList.add('hidden')
    resultDiv.classList.remove('fade-in')
    lastCalculation = null
    nameInput.focus()
  }

  // ============================================
  // PRINT MODAL
  // ============================================
  function openPrintModal() {
    if (!lastCalculation) {
      alert('Please calculate first, then print the receipt.')
      return
    }
    populateReceipt()
    printModal.classList.remove('hidden')
    document.body.style.overflow = 'hidden'

    setTimeout(() => {
      const qrContainer = document.getElementById('qrcode')
      qrContainer.innerHTML = ''
      if (typeof QRCode !== 'undefined') {
        qrCodeInstance = new QRCode(qrContainer, {
          text: 'https://scicalcpro.vercel.app/engineering-calculator.html',
          width: 80,
          height: 80,
          colorDark: '#1a1a1a',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        })
      }
    }, 100)
  }

  function closePrintModal() {
    printModal.classList.add('hidden')
    document.body.style.overflow = ''
  }

  function populateReceipt() {
    if (!lastCalculation) return
    const c = lastCalculation

    const now = new Date()
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    const receiptNum = `ENG-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`

    document.getElementById('receipt-date').textContent = dateStr
    document.getElementById('receipt-time').textContent = timeStr
    document.getElementById('receipt-number').textContent = receiptNum

    document.getElementById('receipt-name').textContent = c.name || '—'
    document.getElementById('receipt-type').textContent = c.typeName
    document.getElementById('receipt-inputs').textContent = c.inputs
    document.getElementById('receipt-formula').textContent = c.formula
    document.getElementById('receipt-result').textContent = c.result.toFixed(4)
    document.getElementById('receipt-unit').textContent = c.unit
  }

  function printReceipt() { window.print() }

  function savePDF() {
    alert('In the print dialog, choose "Save as PDF" as the destination.')
    window.print()
  }

  function shareResult() {
    if (!lastCalculation) return
    const c = lastCalculation
    const text = `⚙️ Engineering Calculator — SciCalcPro
━━━━━━━━━━━━━━━━━━━━━━━
${c.name ? `Name: ${c.name}` : ''}
Type: ${c.typeName}
Inputs: ${c.inputs}
━━━━━━━━━━━━━━━━━━━━━━━
Formula: ${c.formula}
Result: ${c.result.toFixed(4)} ${c.unit}
━━━━━━━━━━━━━━━━━━━━━━━
By Bilal Marghoob Creations
https://scicalcpro.vercel.app`

    if (navigator.share) {
      navigator.share({ title: 'Engineering Calculation', text: text, url: 'https://scicalcpro.vercel.app/engineering-calculator.html' }).catch(() => {})
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }
  }

  // ============================================
  // HELP SIDEBAR
  // ============================================
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

  document.querySelectorAll('[data-help]').forEach(el => {
    const helpKey = el.dataset.help
    if (helpKey) {
      el.addEventListener('mouseenter', () => showHelp(helpKey))
      el.addEventListener('touchstart', () => showHelp(helpKey), { passive: true })
      el.addEventListener('focus', () => showHelp(helpKey))
    }
  })

  // ============================================
  // EVENT LISTENERS
  // ============================================
  calculateBtn.addEventListener('click', calculateEng)
  resetBtn.addEventListener('click', resetEng)
  printResultBtn.addEventListener('click', openPrintModal)
  printBtn.addEventListener('click', openPrintModal)
  printModalOverlay.addEventListener('click', closePrintModal)
  printModalClose.addEventListener('click', closePrintModal)
  printAction.addEventListener('click', printReceipt)
  pdfAction.addEventListener('click', savePDF)
  shareAction.addEventListener('click', shareResult)

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !printModal.classList.contains('hidden')) closePrintModal()
  })

  if (helpToggle && helpContent) {
    helpToggle.addEventListener('click', () => {
      helpContent.classList.toggle('collapsed')
      helpToggle.textContent = helpContent.classList.contains('collapsed') ? '▼' : '▲'
    })
  }

  let isDark = true
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      isDark = !isDark
      if (isDark) {
        document.body.classList.remove('light-mode')
        document.body.style.background = 'linear-gradient(135deg, #0b1020 0%, #141a35 50%, #0b1020 100%)'
        themeToggle.innerHTML = '🌙 <span class="hidden md:inline">Dark</span>'
      } else {
        document.body.classList.add('light-mode')
        document.body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)'
        themeToggle.innerHTML = '☀️ <span class="hidden md:inline">Light</span>'
      }
    })
  }

  console.log('✅ Engineering Calculator ready')
})