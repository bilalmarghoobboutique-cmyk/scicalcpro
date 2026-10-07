import './style.css'

console.log('💰 Profit Calculator — SciCalcPro')
console.log('👨‍💻 Bilal Marghoob Creations')

// ============================================
// HELP DATA
// ============================================
const helpData = {
  'name-input': {
    title: 'Your Name',
    icon: '👤',
    description: 'Optional field. Enter your name for a personalized result and printed receipt.',
    formula: 'Optional — can be left empty',
    examples: ['Ahmed Traders', 'Bilal Store', 'Leave empty'],
    note: 'Maximum 30 characters.'
  },
  'cost-price': {
    title: 'Cost Price (CP)',
    icon: '💵',
    description: 'The price at which you bought the product. This is your investment per unit.',
    formula: 'Example: 100 rupees / 100 dollars',
    examples: ['Bought for: 80', 'Bought for: 250.50', 'Bought for: 1000'],
    note: 'Must be greater than 0. Use decimal for paisa/cents.'
  },
  'selling-price': {
    title: 'Selling Price (SP)',
    icon: '🏷️',
    description: 'The price at which you sold the product. This is your revenue per unit.',
    formula: 'Example: 120 rupees / 120 dollars',
    examples: ['Sold for: 100', 'Sold for: 300', 'Sold for: 1200'],
    note: 'Must be greater than 0. If SP > CP → Profit, if SP < CP → Loss.'
  },
  'calculate-profit': {
    title: 'Calculate Profit Button',
    icon: '✨',
    description: 'Calculates profit or loss, profit percentage, markup, margin, revenue, cost, and break-even price.',
    formula: 'Profit = SP − CP',
    examples: ['Click to calculate', 'Result appears instantly'],
    note: 'Both Cost Price and Selling Price are required.'
  },
  'reset-profit': {
    title: 'Reset Button',
    icon: '🔄',
    description: 'Clears all inputs and results. Use it for a new calculation.',
    formula: 'Clears: Name, CP, SP, Result',
    examples: ['After showing result', 'For the next product'],
    note: 'Does not affect other pages.'
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name-input')
  const costInput = document.getElementById('cost-price')
  const sellInput = document.getElementById('selling-price')
  const calculateBtn = document.getElementById('calculate-profit')
  const resetBtn = document.getElementById('reset-profit')
  const printResultBtn = document.getElementById('print-result-btn')
  const resultDiv = document.getElementById('profit-result')
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

  let lastCalculation = null
  let qrCodeInstance = null

  // ============================================
  // CALCULATE PROFIT
  // ============================================
  function calculateProfit() {
    const nameValue = nameInput.value.trim()
    const cp = parseFloat(costInput.value)
    const sp = parseFloat(sellInput.value)

    if (isNaN(cp) || isNaN(sp)) {
      alert('Please enter both Cost Price and Selling Price')
      return
    }
    if (cp < 0 || sp < 0) {
      alert('Values cannot be negative')
      return
    }

    const diff = sp - cp
    const isProfit = diff >= 0
    const profitPercent = cp !== 0 ? (diff / cp) * 100 : 0
    const marginPercent = sp !== 0 ? (diff / sp) * 100 : 0
    const markupPercent = cp !== 0 ? (diff / cp) * 100 : 0

    lastCalculation = {
      name: nameValue,
      cp: cp,
      sp: sp,
      diff: diff,
      isProfit: isProfit,
      profitPercent: profitPercent,
      marginPercent: marginPercent,
      markupPercent: markupPercent
    }

    const banner = document.getElementById('profit-status-banner')
    const icon = document.getElementById('profit-status-icon')
    const text = document.getElementById('profit-status-text')
    const greeting = document.getElementById('result-greeting')

    if (isProfit) {
      banner.classList.remove('loss')
      icon.textContent = '📈'
      text.textContent = 'Profit'
    } else {
      banner.classList.add('loss')
      icon.textContent = '📉'
      text.textContent = 'Loss'
    }

    greeting.textContent = nameValue ? `${nameValue}'s Profit/Loss` : 'Profit / Loss Amount'

    document.getElementById('profit-amount').textContent = 
      (isProfit ? '+' : '') + diff.toFixed(2)
    document.getElementById('profit-percent').textContent = profitPercent.toFixed(2) + '%'
    document.getElementById('markup-percent').textContent = markupPercent.toFixed(2) + '%'
    document.getElementById('margin-percent').textContent = marginPercent.toFixed(2) + '%'
    document.getElementById('total-revenue').textContent = sp.toFixed(2)
    document.getElementById('total-cost').textContent = cp.toFixed(2)
    document.getElementById('breakeven').textContent = cp.toFixed(2)

    resultDiv.classList.remove('hidden')
    resultDiv.classList.add('fade-in')
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  // ============================================
  // RESET
  // ============================================
  function resetProfit() {
    nameInput.value = ''
    costInput.value = ''
    sellInput.value = ''
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
      alert('Please calculate profit first, then print the receipt.')
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
          text: 'https://scicalcpro.vercel.app/profit-calculator.html',
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
    const receiptNum = `PRO-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`

    document.getElementById('receipt-date').textContent = dateStr
    document.getElementById('receipt-time').textContent = timeStr
    document.getElementById('receipt-number').textContent = receiptNum

    document.getElementById('receipt-name').textContent = c.name || '—'
    document.getElementById('receipt-cost').textContent = c.cp.toFixed(2)
    document.getElementById('receipt-sell').textContent = c.sp.toFixed(2)
    document.getElementById('receipt-status').textContent = c.isProfit ? 'Profit' : 'Loss'
    document.getElementById('receipt-amount').textContent = 
      (c.isProfit ? '+' : '') + c.diff.toFixed(2)
    document.getElementById('receipt-percent').textContent = c.profitPercent.toFixed(2) + '%'
    document.getElementById('receipt-markup').textContent = c.markupPercent.toFixed(2) + '%'
    document.getElementById('receipt-margin').textContent = c.marginPercent.toFixed(2) + '%'
    document.getElementById('receipt-revenue').textContent = c.sp.toFixed(2)
    document.getElementById('receipt-cost-total').textContent = c.cp.toFixed(2)
    document.getElementById('receipt-breakeven').textContent = c.cp.toFixed(2)
  }

  function printReceipt() {
    window.print()
  }

  function savePDF() {
    alert('In the print dialog, choose "Save as PDF" as the destination.')
    window.print()
  }

  function shareResult() {
    if (!lastCalculation) return
    const c = lastCalculation
    const text = `💰 Profit Calculator — SciCalcPro
━━━━━━━━━━━━━━━━━━━━━━━
${c.name ? `Name: ${c.name}` : ''}
Cost Price: ${c.cp.toFixed(2)}
Selling Price: ${c.sp.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━
Status: ${c.isProfit ? 'Profit' : 'Loss'}
Amount: ${(c.isProfit ? '+' : '') + c.diff.toFixed(2)}
Profit %: ${c.profitPercent.toFixed(2)}%
Markup %: ${c.markupPercent.toFixed(2)}%
Margin %: ${c.marginPercent.toFixed(2)}%
━━━━━━━━━━━━━━━━━━━━━━━
By Bilal Marghoob Creations
https://scicalcpro.vercel.app`

    if (navigator.share) {
      navigator.share({ title: 'Profit Calculation', text: text, url: 'https://scicalcpro.vercel.app/profit-calculator.html' }).catch(() => {})
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
        <div class="help-section-label">📐 Format</div>
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
  calculateBtn.addEventListener('click', calculateProfit)
  resetBtn.addEventListener('click', resetProfit)
  printResultBtn.addEventListener('click', openPrintModal)
  printBtn.addEventListener('click', openPrintModal)
  printModalOverlay.addEventListener('click', closePrintModal)
  printModalClose.addEventListener('click', closePrintModal)
  printAction.addEventListener('click', printReceipt)
  pdfAction.addEventListener('click', savePDF)
  shareAction.addEventListener('click', shareResult)

  nameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') costInput.focus() })
  costInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sellInput.focus() })
  sellInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') calculateProfit() })

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

  console.log('✅ Profit Calculator ready')
})