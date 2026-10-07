import './style.css'

console.log('📐 Area Calculator — SciCalcPro')
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
    examples: ['Ahmed', 'Fatima', 'Leave empty'],
    note: 'Maximum 30 characters.'
  },
  'shape-selector': {
    title: 'Shape Selector',
    icon: '📐',
    description: 'Choose the shape whose area you want to calculate: Rectangle, Circle, Triangle, or Square.',
    formula: 'Click a shape to switch',
    examples: ['▭ Rectangle — L × W', '⭕ Circle — πr²', '🔺 Triangle — ½ × b × h', '◼️ Square — s²'],
    note: 'Different inputs will appear for each shape.'
  },
  'rect-length': {
    title: 'Length (Rectangle)',
    icon: '📏',
    description: 'The longer side of the rectangle. Used for area = L × W.',
    formula: 'Area = Length × Width',
    examples: ['Length = 10', 'Length = 15.5'],
    note: 'Must be greater than 0.'
  },
  'rect-width': {
    title: 'Width (Rectangle)',
    icon: '📏',
    description: 'The shorter side of the rectangle. Used for area = L × W.',
    formula: 'Area = Length × Width',
    examples: ['Width = 5', 'Width = 7.5'],
    note: 'Must be greater than 0.'
  },
  'circle-radius': {
    title: 'Radius (Circle)',
    icon: '⭕',
    description: 'The distance from center to edge of the circle. Half of diameter.',
    formula: 'Area = π × r²',
    examples: ['Radius = 5 → Area = 78.54', 'Radius = 10 → Area = 314.16'],
    note: 'Use decimal if needed.'
  },
  'tri-base': {
    title: 'Base (Triangle)',
    icon: '📏',
    description: 'The bottom side of the triangle.',
    formula: 'Area = ½ × base × height',
    examples: ['Base = 10', 'Base = 6.5'],
    note: 'Must be greater than 0.'
  },
  'tri-height': {
    title: 'Height (Triangle)',
    icon: '📏',
    description: 'Perpendicular height from base to top of triangle.',
    formula: 'Area = ½ × base × height',
    examples: ['Height = 8', 'Height = 12'],
    note: 'Must be greater than 0.'
  },
  'square-side': {
    title: 'Side (Square)',
    icon: '◼️',
    description: 'One side of the square. All sides are equal.',
    formula: 'Area = side²',
    examples: ['Side = 5 → Area = 25', 'Side = 10 → Area = 100'],
    note: 'Perimeter = 4 × side.'
  },
  'calculate-area': {
    title: 'Calculate Area Button',
    icon: '✨',
    description: 'Calculates the area and perimeter based on the shape and dimensions entered.',
    formula: 'Click to calculate',
    examples: ['Rectangle: 10 × 5 = 50', 'Circle r=5: 78.54'],
    note: 'All required fields must be filled.'
  },
  'reset-area': {
    title: 'Reset Button',
    icon: '🔄',
    description: 'Clears all inputs and results. Use it for a new calculation.',
    formula: 'Clears all fields',
    examples: ['After showing result', 'For the next shape'],
    note: 'Does not affect other pages.'
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name-input')
  const shapeBtns = document.querySelectorAll('.shape-btn')
  const shapeGroups = document.querySelectorAll('.shape-input-group')
  const calculateBtn = document.getElementById('calculate-area')
  const resetBtn = document.getElementById('reset-area')
  const printResultBtn = document.getElementById('print-result-btn')
  const resultDiv = document.getElementById('area-result')
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

  let currentShape = 'rectangle'
  let lastCalculation = null
  let qrCodeInstance = null

  // ============================================
  // SHAPE SELECTOR
  // ============================================
  shapeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentShape = btn.dataset.shape
      shapeBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      shapeGroups.forEach(g => {
        g.classList.toggle('hidden', g.dataset.shape !== currentShape)
      })
    })
  })

  // ============================================
  // CALCULATE AREA
  // ============================================
  function calculateArea() {
    const nameValue = nameInput.value.trim()
    let area = 0, perimeter = 0, formula = '', shapeName = '', dims = ''

    if (currentShape === 'rectangle') {
      const l = parseFloat(document.getElementById('rect-length').value)
      const w = parseFloat(document.getElementById('rect-width').value)
      if (isNaN(l) || isNaN(w)) { alert('Please enter length and width'); return }
      area = l * w
      perimeter = 2 * (l + w)
      formula = 'L × W'
      shapeName = 'Rectangle'
      dims = `L = ${l}, W = ${w}`
    } else if (currentShape === 'circle') {
      const r = parseFloat(document.getElementById('circle-radius').value)
      if (isNaN(r)) { alert('Please enter radius'); return }
      area = Math.PI * r * r
      perimeter = 2 * Math.PI * r
      formula = 'π × r²'
      shapeName = 'Circle'
      dims = `r = ${r}`
    } else if (currentShape === 'triangle') {
      const b = parseFloat(document.getElementById('tri-base').value)
      const h = parseFloat(document.getElementById('tri-height').value)
      if (isNaN(b) || isNaN(h)) { alert('Please enter base and height'); return }
      area = 0.5 * b * h
      perimeter = 0
      formula = '½ × b × h'
      shapeName = 'Triangle'
      dims = `b = ${b}, h = ${h}`
    } else if (currentShape === 'square') {
      const s = parseFloat(document.getElementById('square-side').value)
      if (isNaN(s)) { alert('Please enter side length'); return }
      area = s * s
      perimeter = 4 * s
      formula = 's²'
      shapeName = 'Square'
      dims = `s = ${s}`
    }

    lastCalculation = {
      name: nameValue,
      shape: shapeName,
      formula: formula,
      dims: dims,
      area: area,
      perimeter: perimeter
    }

    document.getElementById('result-greeting').textContent = 
      nameValue ? `${nameValue}'s Area Result` : 'Area'

    document.getElementById('area-display').textContent = area.toFixed(2)
    document.getElementById('shape-name-display').textContent = shapeName
    document.getElementById('perimeter-display').textContent = perimeter > 0 ? perimeter.toFixed(2) : 'N/A'
    document.getElementById('formula-display').textContent = formula

    resultDiv.classList.remove('hidden')
    resultDiv.classList.add('fade-in')
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  // ============================================
  // RESET
  // ============================================
  function resetArea() {
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
      alert('Please calculate area first, then print the receipt.')
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
          text: 'https://scicalcpro.vercel.app/area-calculator.html',
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
    const receiptNum = `ARE-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`

    document.getElementById('receipt-date').textContent = dateStr
    document.getElementById('receipt-time').textContent = timeStr
    document.getElementById('receipt-number').textContent = receiptNum

    document.getElementById('receipt-name').textContent = c.name || '—'
    document.getElementById('receipt-shape').textContent = c.shape
    document.getElementById('receipt-formula').textContent = c.formula
    document.getElementById('receipt-area').textContent = c.area.toFixed(2)
    document.getElementById('receipt-perimeter').textContent = c.perimeter > 0 ? c.perimeter.toFixed(2) : 'N/A'
  }

  function printReceipt() { window.print() }

  function savePDF() {
    alert('In the print dialog, choose "Save as PDF" as the destination.')
    window.print()
  }

  function shareResult() {
    if (!lastCalculation) return
    const c = lastCalculation
    const text = `📐 Area Calculator — SciCalcPro
━━━━━━━━━━━━━━━━━━━━━━━
${c.name ? `Name: ${c.name}` : ''}
Shape: ${c.shape}
Formula: ${c.formula}
Dimensions: ${c.dims}
━━━━━━━━━━━━━━━━━━━━━━━
Area: ${c.area.toFixed(2)}
Perimeter: ${c.perimeter > 0 ? c.perimeter.toFixed(2) : 'N/A'}
━━━━━━━━━━━━━━━━━━━━━━━
By Bilal Marghoob Creations
https://scicalcpro.vercel.app`

    if (navigator.share) {
      navigator.share({ title: 'Area Calculation', text: text, url: 'https://scicalcpro.vercel.app/area-calculator.html' }).catch(() => {})
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
  calculateBtn.addEventListener('click', calculateArea)
  resetBtn.addEventListener('click', resetArea)
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

  console.log('✅ Area Calculator ready')
})