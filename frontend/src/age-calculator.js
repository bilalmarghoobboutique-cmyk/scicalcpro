import './style.css'
import { inject } from '@vercel/analytics'

// Initialize Vercel Web Analytics
inject()

console.log('🎂 Age Calculator — SciCalcPro')
console.log('👨‍💻 Bilal Marghoob Creations')

// ============================================
// HELP DATA
// ============================================
const helpData = {
  'name-input': {
    title: 'Your Name',
    icon: '👤',
    description: 'Optional field. Enter your name and it will appear in the result greeting and on the printed receipt.',
    formula: 'Optional — can be left empty',
    examples: ['Ahmed Khan', 'Fatima', 'Muhammad Ali', 'Leave empty for "Your Age"'],
    note: 'Maximum 30 characters.'
  },
  'dob-input': {
    title: 'Date of Birth',
    icon: '📅',
    description: 'Enter your birth date (day, month, year). This is the starting point for age calculation. Required field.',
    formula: 'Format: DD/MM/YYYY (based on your device)',
    examples: ['Born on: 15 May 2000', 'Born on: 01 Jan 1995', 'Born on: 31 Dec 2010'],
    note: 'Date cannot be in the future.'
  },
  'asof-input': {
    title: 'Calculate Age As Of',
    icon: '📆',
    description: 'Optional field. Calculate your age on a specific date. Leave empty to use today.',
    formula: 'Leave empty = Today\'s Date',
    examples: ['Leave empty for current age', 'Set to 01 Jan 2025 for age on New Year'],
    note: 'Must be after Date of Birth.'
  },
  'calculate-age': {
    title: 'Calculate Age Button',
    icon: '✨',
    description: 'Calculates your exact age. Shows years, months, days, hours, minutes, next birthday, and day of birth.',
    formula: 'Age = (As Of Date) − (Date of Birth)',
    examples: ['Click to calculate', 'Result appears instantly'],
    note: 'Date of Birth is required.'
  },
  'reset-age': {
    title: 'Reset Button',
    icon: '🔄',
    description: 'Clears all inputs and results. Use it to start a new calculation.',
    formula: 'Clears: Name, DOB, As Of, Result',
    examples: ['After showing result', 'To calculate for someone else'],
    note: 'Does not affect other pages.'
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const nameInput = document.getElementById('name-input')
  const dobInput = document.getElementById('dob-input')
  const asofInput = document.getElementById('asof-input')
  const calculateBtn = document.getElementById('calculate-age')
  const resetBtn = document.getElementById('reset-age')
  const printResultBtn = document.getElementById('print-result-btn')
  const resultDiv = document.getElementById('age-result')
  const themeToggle = document.getElementById('theme-toggle')
  const printBtn = document.getElementById('print-btn')
  const helpDynamic = document.getElementById('help-dynamic')
  const helpDefault = document.getElementById('help-default')
  const helpToggle = document.getElementById('help-toggle')
  const helpContent = document.getElementById('help-content')

  // Print Modal Elements
  const printModal = document.getElementById('print-modal')
  const printModalOverlay = document.getElementById('print-modal-overlay')
  const printModalClose = document.getElementById('print-modal-close')
  const printAction = document.getElementById('print-action')
  const pdfAction = document.getElementById('pdf-action')
  const shareAction = document.getElementById('share-action')

  let lastCalculation = null
  let qrCodeInstance = null

  const today = new Date().toISOString().split('T')[0]
  dobInput.setAttribute('max', today)
  asofInput.setAttribute('max', today)

  // ============================================
  // CALCULATE AGE
  // ============================================
  function calculateAge() {
    const nameValue = nameInput.value.trim()
    const dobValue = dobInput.value
    const asofValue = asofInput.value

    if (!dobValue) {
      alert('Please select your date of birth')
      return
    }

    const dob = new Date(dobValue)
    const asof = asofValue ? new Date(asofValue) : new Date()

    if (dob > asof) {
      alert('Date of birth cannot be in the future')
      return
    }

    let years = asof.getFullYear() - dob.getFullYear()
    let months = asof.getMonth() - dob.getMonth()
    let days = asof.getDate() - dob.getDate()

    if (days < 0) {
      months--
      const lastMonth = new Date(asof.getFullYear(), asof.getMonth(), 0)
      days += lastMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    const diffMs = asof - dob
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
    const totalMinutes = Math.floor(diffMs / (1000 * 60))
    const totalMonths = years * 12 + months

    const nextBirthday = new Date(asof.getFullYear(), dob.getMonth(), dob.getDate())
    if (nextBirthday < asof) {
      nextBirthday.setFullYear(asof.getFullYear() + 1)
    }
    const daysToBirthday = Math.ceil((nextBirthday - asof) / (1000 * 60 * 60 * 24))

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayBorn = daysOfWeek[dob.getDay()]

    lastCalculation = {
      name: nameValue,
      dob: dob,
      asof: asof,
      years: years,
      months: months,
      days: days,
      totalMonths: totalMonths,
      totalDays: totalDays,
      totalHours: totalHours,
      totalMinutes: totalMinutes,
      daysToBirthday: daysToBirthday,
      dayBorn: dayBorn
    }

    const greetingText = nameValue ? `${nameValue}, your age is` : 'Your Age'
    document.getElementById('result-greeting').textContent = greetingText

    document.getElementById('age-display').textContent = 
      `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}`
    document.getElementById('total-months').textContent = totalMonths.toLocaleString()
    document.getElementById('total-days').textContent = totalDays.toLocaleString()
    document.getElementById('total-hours').textContent = totalHours.toLocaleString()
    document.getElementById('total-minutes').textContent = totalMinutes.toLocaleString()
    document.getElementById('next-birthday').textContent = 
      daysToBirthday === 0 ? '🎉 Today!' : `${daysToBirthday} day${daysToBirthday !== 1 ? 's' : ''}`
    document.getElementById('day-born').textContent = dayBorn

    resultDiv.classList.remove('hidden')
    resultDiv.classList.add('fade-in')
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  // ============================================
  // RESET
  // ============================================
  function resetAge() {
    nameInput.value = ''
    dobInput.value = ''
    asofInput.value = ''
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
      alert('Please calculate age first, then print the receipt.')
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
          text: 'https://scicalcpro.vercel.app/age-calculator.html',
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
    const receiptNum = `AGE-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`

    document.getElementById('receipt-date').textContent = dateStr
    document.getElementById('receipt-time').textContent = timeStr
    document.getElementById('receipt-number').textContent = receiptNum

    document.getElementById('receipt-name').textContent = c.name || '—'
    document.getElementById('receipt-dob').textContent = c.dob.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    document.getElementById('receipt-asof').textContent = c.asof.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

    document.getElementById('receipt-age').textContent = 
      `${c.years} year${c.years !== 1 ? 's' : ''}, ${c.months} month${c.months !== 1 ? 's' : ''}, ${c.days} day${c.days !== 1 ? 's' : ''}`
    document.getElementById('receipt-months').textContent = c.totalMonths.toLocaleString()
    document.getElementById('receipt-days').textContent = c.totalDays.toLocaleString()
    document.getElementById('receipt-hours').textContent = c.totalHours.toLocaleString()
    document.getElementById('receipt-minutes').textContent = c.totalMinutes.toLocaleString()
    document.getElementById('receipt-birthday').textContent = 
      c.daysToBirthday === 0 ? 'Today!' : `${c.daysToBirthday} days`
    document.getElementById('receipt-day').textContent = c.dayBorn
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
    const text = `🎂 Age Calculator — SciCalcPro
━━━━━━━━━━━━━━━━━━━━━━━
${c.name ? `Name: ${c.name}` : ''}
Date of Birth: ${c.dob.toLocaleDateString()}
Calculated As Of: ${c.asof.toLocaleDateString()}
━━━━━━━━━━━━━━━━━━━━━━━
Exact Age: ${c.years} years, ${c.months} months, ${c.days} days
Total Days: ${c.totalDays.toLocaleString()}
Next Birthday: ${c.daysToBirthday} days
Day Born: ${c.dayBorn}
━━━━━━━━━━━━━━━━━━━━━━━
By Bilal Marghoob Creations
https://scicalcpro.vercel.app`

    if (navigator.share) {
      navigator.share({
        title: 'Age Calculation',
        text: text,
        url: 'https://scicalcpro.vercel.app/age-calculator.html'
      }).catch(() => {})
    } else {
      const encoded = encodeURIComponent(text)
      window.open(`https://wa.me/?text=${encoded}`, '_blank')
    }
  }

  // ============================================
  // HELP SIDEBAR
  // ============================================
  function showHelp(helpKey) {
    if (!helpDynamic || !helpDefault) return
    const help = helpData[helpKey]
    if (!help) return

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
        <div class="help-section-label">📐 Format / Formula</div>
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

  const helpElements = document.querySelectorAll('[data-help]')
  helpElements.forEach(el => {
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
  calculateBtn.addEventListener('click', calculateAge)
  resetBtn.addEventListener('click', resetAge)
  printResultBtn.addEventListener('click', openPrintModal)
  printBtn.addEventListener('click', openPrintModal)
  printModalOverlay.addEventListener('click', closePrintModal)
  printModalClose.addEventListener('click', closePrintModal)
  printAction.addEventListener('click', printReceipt)
  pdfAction.addEventListener('click', savePDF)
  shareAction.addEventListener('click', shareResult)

  nameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') dobInput.focus() })
  dobInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') calculateAge() })
  asofInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') calculateAge() })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !printModal.classList.contains('hidden')) {
      closePrintModal()
    }
  })

  if (helpToggle && helpContent) {
    helpToggle.addEventListener('click', () => {
      helpContent.classList.toggle('collapsed')
      helpToggle.textContent = helpContent.classList.contains('collapsed') ? '▼' : '▲'
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

  console.log('✅ Age Calculator ready')
})