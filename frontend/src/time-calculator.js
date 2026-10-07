import './style.css'

console.log('⏰ Time Calculator — SciCalcPro')
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
  'mode-selector': {
    title: 'Operation Mode',
    icon: '➕',
    description: 'Choose between adding or subtracting two time values.',
    formula: 'Add: T1 + T2 | Subtract: T1 − T2',
    examples: ['Add — 2h + 1h = 3h', 'Subtract — 5h − 2h = 3h'],
    note: 'For subtraction, Time 1 must be larger than Time 2.'
  },
  'time1-input': {
    title: 'Time 1',
    icon: '🕐',
    description: 'First time value — Hours (HH), Minutes (MM), Seconds (SS).',
    formula: 'Format: HH:MM:SS',
    examples: ['2:30:45', '5:00:00', '0:15:30'],
    note: 'Minutes and Seconds should be 0-59.'
  },
  'time2-input': {
    title: 'Time 2',
    icon: '🕑',
    description: 'Second time value — Hours (HH), Minutes (MM), Seconds (SS).',
    formula: 'Format: HH:MM:SS',
    examples: ['1:45:30', '0:30:00', '2:20:15'],
    note: 'For subtract mode, this must be smaller than Time 1.'
  },
  'calculate-time': {
    title: 'Calculate Time Button',
    icon: '✨',
    description: 'Calculates the total time by adding or subtracting both time values.',
    formula: 'Total = Time 1 (±) Time 2',
    examples: ['Add: 2:30 + 1:45 = 4:15', 'Subtract: 5:00 − 2:30 = 2:30'],
    note: 'Auto-converts 60 seconds = 1 minute, 60 minutes = 1 hour.'
  },
  'reset-time': {
    title: 'Reset Button',
    icon: '🔄',
    description: 'Clears all inputs and results. Use it for a new calculation.',
    formula: 'Clears all fields',
    examples: ['After showing result', 'For new time calculation'],
    note: 'Does not affect other pages.'
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name-input')
  const modeBtns = document.querySelectorAll('.time-mode-btn')
  const calculateBtn = document.getElementById('calculate-time')
  const resetBtn = document.getElementById('reset-time')
  const printResultBtn = document.getElementById('print-result-btn')
  const resultDiv = document.getElementById('time-result')
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

  let currentMode = 'add'
  let lastCalculation = null
  let qrCodeInstance = null

  // ============================================
  // MODE SELECTOR
  // ============================================
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode
      modeBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
    })
  })

  // ============================================
  // CALCULATE TIME
  // ============================================
  function calculateTime() {
    const nameValue = nameInput.value.trim()
    const h1 = parseInt(document.getElementById('time1-hours').value) || 0
    const m1 = parseInt(document.getElementById('time1-minutes').value) || 0
    const s1 = parseInt(document.getElementById('time1-seconds').value) || 0

    const h2 = parseInt(document.getElementById('time2-hours').value) || 0
    const m2 = parseInt(document.getElementById('time2-minutes').value) || 0
    const s2 = parseInt(document.getElementById('time2-seconds').value) || 0

    const total1 = h1 * 3600 + m1 * 60 + s1
    const total2 = h2 * 3600 + m2 * 60 + s2

    let resultSeconds = currentMode === 'add' ? total1 + total2 : total1 - total2

    if (resultSeconds < 0) {
      alert('Time cannot be negative. Time 1 must be larger than Time 2.')
      return
    }

    const rHours = Math.floor(resultSeconds / 3600)
    const rMinutes = Math.floor((resultSeconds % 3600) / 60)
    const rSecs = resultSeconds % 60

    const resultString = 
      `${String(rHours).padStart(2, '0')}:${String(rMinutes).padStart(2, '0')}:${String(rSecs).padStart(2, '0')}`

    lastCalculation = {
      name: nameValue,
      mode: currentMode === 'add' ? 'Add' : 'Subtract',
      time1: `${String(h1).padStart(2, '0')}:${String(m1).padStart(2, '0')}:${String(s1).padStart(2, '0')}`,
      time2: `${String(h2).padStart(2, '0')}:${String(m2).padStart(2, '0')}:${String(s2).padStart(2, '0')}`,
      resultString: resultString,
      totalHours: rHours,
      totalMinutes: Math.floor(resultSeconds / 60),
      totalSeconds: resultSeconds
    }

    document.getElementById('result-greeting').textContent = 
      nameValue ? `${nameValue}'s Time Result` : 'Result'

    document.getElementById('time-display').textContent = resultString
    document.getElementById('result-hours').textContent = rHours.toLocaleString()
    document.getElementById('result-minutes').textContent = Math.floor(resultSeconds / 60).toLocaleString()
    document.getElementById('result-seconds').textContent = resultSeconds.toLocaleString()

    resultDiv.classList.remove('hidden')
    resultDiv.classList.add('fade-in')
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  // ============================================
  // RESET
  // ============================================
  function resetTime() {
    nameInput.value = ''
    document.querySelectorAll('.time-input').forEach(i => i.value = '')
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
      alert('Please calculate time first, then print the receipt.')
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
          text: 'https://scicalcpro.vercel.app/time-calculator.html',
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
    const receiptNum = `TIM-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`

    document.getElementById('receipt-date').textContent = dateStr
    document.getElementById('receipt-time').textContent = timeStr
    document.getElementById('receipt-number').textContent = receiptNum

    document.getElementById('receipt-name').textContent = c.name || '—'
    document.getElementById('receipt-mode').textContent = c.mode
    document.getElementById('receipt-time1').textContent = c.time1
    document.getElementById('receipt-time2').textContent = c.time2
    document.getElementById('receipt-result').textContent = c.resultString
    document.getElementById('receipt-hours').textContent = c.totalHours.toLocaleString()
    document.getElementById('receipt-minutes').textContent = c.totalMinutes.toLocaleString()
    document.getElementById('receipt-seconds').textContent = c.totalSeconds.toLocaleString()
  }

  function printReceipt() { window.print() }

  function savePDF() {
    alert('In the print dialog, choose "Save as PDF" as the destination.')
    window.print()
  }

  function shareResult() {
    if (!lastCalculation) return
    const c = lastCalculation
    const text = `⏰ Time Calculator — SciCalcPro
━━━━━━━━━━━━━━━━━━━━━━━
${c.name ? `Name: ${c.name}` : ''}
Operation: ${c.mode}
Time 1: ${c.time1}
Time 2: ${c.time2}
━━━━━━━━━━━━━━━━━━━━━━━
Result: ${c.resultString}
Total Hours: ${c.totalHours}
Total Minutes: ${c.totalMinutes}
Total Seconds: ${c.totalSeconds}
━━━━━━━━━━━━━━━━━━━━━━━
By Bilal Marghoob Creations
https://scicalcpro.vercel.app`

    if (navigator.share) {
      navigator.share({ title: 'Time Calculation', text: text, url: 'https://scicalcpro.vercel.app/time-calculator.html' }).catch(() => {})
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
  calculateBtn.addEventListener('click', calculateTime)
  resetBtn.addEventListener('click', resetTime)
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

  console.log('✅ Time Calculator ready')
})