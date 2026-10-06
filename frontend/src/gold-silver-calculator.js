import './style.css'

console.log('🥇 Gold & Silver Calculator — SciCalcPro')
console.log('👨‍💻 Bilal Marghoob Creations')

// ============================================
// CONSTANTS
// ============================================
const GRAMS_PER_TOLA = 11.6638
const GRAMS_PER_OUNCE = 31.1035
const GRAMS_PER_KG = 1000

// ============================================
// STATE
// ============================================
let currentMetal = { name: 'Gold 24K', purity: 99.9 }
let lastCalculation = null
let qrCodeInstance = null

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const countrySelect = document.getElementById('country-select')
  const currencyDisplay = document.getElementById('currency-display')
  const metalBtns = document.querySelectorAll('.metal-btn')
  const rateGramInput = document.getElementById('rate-gram')
  const rateTolaInput = document.getElementById('rate-tola')
  const rateOunceInput = document.getElementById('rate-ounce')
  const rateKgInput = document.getElementById('rate-kg')
  const weightInput = document.getElementById('weight-input')
  const weightUnit = document.getElementById('weight-unit')
  const makingCharges = document.getElementById('making-charges')
  const taxPercent = document.getElementById('tax-percent')
  const calculateBtn = document.getElementById('calculate-gold')
  const resetBtn = document.getElementById('reset-gold')
  const copyBtn = document.getElementById('copy-result')
  const printBtn = document.getElementById('print-btn')
  const resultDiv = document.getElementById('gold-result')
  const themeToggle = document.getElementById('theme-toggle')

  // Print modal elements
  const printModal = document.getElementById('print-modal')
  const printModalOverlay = document.getElementById('print-modal-overlay')
  const printModalClose = document.getElementById('print-modal-close')
  const printAction = document.getElementById('print-action')
  const pdfAction = document.getElementById('pdf-action')
  const shareAction = document.getElementById('share-action')

  // ============================================
  // COUNTRY SELECTOR
  // ============================================
  countrySelect.addEventListener('change', () => {
    const value = countrySelect.value
    if (!value) return
    const parts = value.split('|')
    currencyDisplay.value = `${parts[1]} — ${parts[2]}`
  })

  if (countrySelect.value) {
    const parts = countrySelect.value.split('|')
    currencyDisplay.value = `${parts[1]} — ${parts[2]}`
  }

  // ============================================
  // METAL SELECTOR
  // ============================================
  metalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      metalBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      currentMetal = {
        name: btn.querySelector('.metal-name').textContent,
        purity: parseFloat(btn.dataset.purity)
      }
    })
  })

  // ============================================
  // RATE AUTO-CONVERSION
  // ============================================
  function convertRates(sourceUnit, value) {
    if (isNaN(value) || value <= 0) {
      rateGramInput.value = ''
      rateTolaInput.value = ''
      rateOunceInput.value = ''
      rateKgInput.value = ''
      return
    }

    let gramRate = 0
    switch (sourceUnit) {
      case 'gram': gramRate = value; break
      case 'tola': gramRate = value / GRAMS_PER_TOLA; break
      case 'ounce': gramRate = value / GRAMS_PER_OUNCE; break
      case 'kg': gramRate = value / GRAMS_PER_KG; break
    }

    if (sourceUnit !== 'gram') rateGramInput.value = gramRate.toFixed(2)
    if (sourceUnit !== 'tola') rateTolaInput.value = (gramRate * GRAMS_PER_TOLA).toFixed(2)
    if (sourceUnit !== 'ounce') rateOunceInput.value = (gramRate * GRAMS_PER_OUNCE).toFixed(2)
    if (sourceUnit !== 'kg') rateKgInput.value = (gramRate * GRAMS_PER_KG).toFixed(2)
  }

  rateGramInput.addEventListener('input', () => convertRates('gram', parseFloat(rateGramInput.value)))
  rateTolaInput.addEventListener('input', () => convertRates('tola', parseFloat(rateTolaInput.value)))
  rateOunceInput.addEventListener('input', () => convertRates('ounce', parseFloat(rateOunceInput.value)))
  rateKgInput.addEventListener('input', () => convertRates('kg', parseFloat(rateKgInput.value)))

  // ============================================
  // CALCULATE
  // ============================================
  function calculateGold() {
    const gramRate = parseFloat(rateGramInput.value)
    if (isNaN(gramRate) || gramRate <= 0) {
      alert('Please enter a valid rate (at least in one unit)')
      return
    }

    const weight = parseFloat(weightInput.value)
    if (isNaN(weight) || weight <= 0) {
      alert('Please enter a valid weight')
      return
    }

    let weightInGrams = 0
    const unit = weightUnit.value
    switch (unit) {
      case 'gram': weightInGrams = weight; break
      case 'tola': weightInGrams = weight * GRAMS_PER_TOLA; break
      case 'ounce': weightInGrams = weight * GRAMS_PER_OUNCE; break
      case 'kg': weightInGrams = weight * GRAMS_PER_KG; break
    }

    const metalPrice = weightInGrams * gramRate
    const makingPercent = parseFloat(makingCharges.value) || 0
    const makingAmount = metalPrice * (makingPercent / 100)
    const taxPct = parseFloat(taxPercent.value) || 0
    const taxBase = metalPrice + makingAmount
    const taxAmount = taxBase * (taxPct / 100)
    const totalPrice = metalPrice + makingAmount + taxAmount

    const countryParts = countrySelect.value.split('|')
    const countryName = countryParts[3] ? `${countryParts[3]} ${countryParts[0]}` : countryParts[0]
    const currencyCode = currencyDisplay.value.split(' — ')[0] || 'PKR'

    // Save to state
    lastCalculation = {
      country: countryName,
      countryFull: countryParts[2] || '',
      currency: currencyCode,
      metal: currentMetal.name,
      purity: currentMetal.purity,
      weight: weight,
      weightUnit: weightUnit.value,
      weightInGrams: weightInGrams,
      gramRate: gramRate,
      metalPrice: metalPrice,
      makingPercent: makingPercent,
      makingAmount: makingAmount,
      taxPct: taxPct,
      taxAmount: taxAmount,
      totalPrice: totalPrice
    }

    // Update UI
    document.getElementById('total-price').textContent = `${currencyCode} ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    document.getElementById('total-price-detail').textContent = `${weightInGrams.toFixed(4)} grams × ${gramRate.toFixed(2)} per gram`

    document.getElementById('result-weight-grams').textContent = weightInGrams.toFixed(4) + ' g'
    document.getElementById('result-weight-tola').textContent = (weightInGrams / GRAMS_PER_TOLA).toFixed(4) + ' tola'
    document.getElementById('result-weight-ounce').textContent = (weightInGrams / GRAMS_PER_OUNCE).toFixed(4) + ' oz'

    document.getElementById('result-rate-gram').textContent = `${currencyCode} ${gramRate.toFixed(2)}`
    document.getElementById('result-rate-tola').textContent = `${currencyCode} ${(gramRate * GRAMS_PER_TOLA).toFixed(2)}`
    document.getElementById('result-rate-ounce').textContent = `${currencyCode} ${(gramRate * GRAMS_PER_OUNCE).toFixed(2)}`

    document.getElementById('result-metal-price').textContent = `${currencyCode} ${metalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    document.getElementById('result-making').textContent = `${currencyCode} ${makingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    document.getElementById('result-tax').textContent = `${currencyCode} ${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    resultDiv.classList.remove('hidden')
    resultDiv.classList.add('fade-in')
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
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

    // Generate QR Code
    setTimeout(() => {
      const qrContainer = document.getElementById('qrcode')
      qrContainer.innerHTML = ''
      if (typeof QRCode !== 'undefined') {
        qrCodeInstance = new QRCode(qrContainer, {
          text: 'https://scicalcpro.vercel.app/gold-silver-calculator.html',
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

  // ============================================
  // POPULATE RECEIPT
  // ============================================
  function populateReceipt() {
    if (!lastCalculation) return
    const c = lastCalculation

    const now = new Date()
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    const receiptNum = `GSC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`

    document.getElementById('receipt-date').textContent = dateStr
    document.getElementById('receipt-time').textContent = timeStr
    document.getElementById('receipt-number').textContent = receiptNum

    document.getElementById('receipt-country').textContent = `${c.country} (${c.currency})`
    document.getElementById('receipt-metal').textContent = `${c.metal} (${c.purity}% pure)`
    document.getElementById('receipt-weight').textContent = `${c.weight} ${c.weightUnit} (${c.weightInGrams.toFixed(4)} g)`
    document.getElementById('receipt-rate').textContent = `${c.currency} ${c.gramRate.toFixed(2)}`

    document.getElementById('receipt-metal-price').textContent = `${c.currency} ${c.metalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    document.getElementById('receipt-making').textContent = `${c.currency} ${c.makingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    document.getElementById('receipt-tax').textContent = `${c.currency} ${c.taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    document.getElementById('receipt-total').textContent = `${c.currency} ${c.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    // Hide making/tax rows if zero
    document.getElementById('receipt-making-row').style.display = c.makingAmount > 0 ? '' : 'none'
    document.getElementById('receipt-tax-row').style.display = c.taxAmount > 0 ? '' : 'none'

    document.getElementById('receipt-rate-gram').textContent = `${c.currency} ${c.gramRate.toFixed(2)}`
    document.getElementById('receipt-rate-tola').textContent = `${c.currency} ${(c.gramRate * GRAMS_PER_TOLA).toFixed(2)}`
    document.getElementById('receipt-rate-ounce').textContent = `${c.currency} ${(c.gramRate * GRAMS_PER_OUNCE).toFixed(2)}`
    document.getElementById('receipt-rate-kg').textContent = `${c.currency} ${(c.gramRate * GRAMS_PER_KG).toFixed(2)}`
  }

  // ============================================
  // PRINT ACTION
  // ============================================
  function printReceipt() {
    window.print()
  }

  // ============================================
  // PDF ACTION (opens print dialog with Save as PDF)
  // ============================================
  function savePDF() {
    alert('In the print dialog, choose "Save as PDF" as the destination.')
    window.print()
  }

  // ============================================
  // SHARE ACTION
  // ============================================
  function shareResult() {
    if (!lastCalculation) return
    const c = lastCalculation
    const text = `🥇 Gold & Silver Calculator — SciCalcPro
━━━━━━━━━━━━━━━━━━━━━━━
Country: ${c.country} (${c.currency})
Metal: ${c.metal} (${c.purity}% pure)
Weight: ${c.weight} ${c.weightUnit} (${c.weightInGrams.toFixed(4)} g)
Rate/gram: ${c.currency} ${c.gramRate.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━
Metal Price: ${c.currency} ${c.metalPrice.toFixed(2)}
Making: ${c.currency} ${c.makingAmount.toFixed(2)}
Tax: ${c.currency} ${c.taxAmount.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: ${c.currency} ${c.totalPrice.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━
By Bilal Marghoob Creations
https://scicalcpro.vercel.app`

    if (navigator.share) {
      navigator.share({
        title: 'Gold & Silver Calculation',
        text: text,
        url: 'https://scicalcpro.vercel.app/gold-silver-calculator.html'
      }).catch(() => {})
    } else {
      // Fallback: WhatsApp
      const encoded = encodeURIComponent(text)
      window.open(`https://wa.me/?text=${encoded}`, '_blank')
    }
  }

  // ============================================
  // RESET
  // ============================================
  function resetGold() {
    rateGramInput.value = ''
    rateTolaInput.value = ''
    rateOunceInput.value = ''
    rateKgInput.value = ''
    weightInput.value = ''
    makingCharges.value = '0'
    taxPercent.value = '0'
    resultDiv.classList.add('hidden')
    resultDiv.classList.remove('fade-in')
    lastCalculation = null
  }

  // ============================================
  // COPY RESULT
  // ============================================
  function copyResult() {
    if (!lastCalculation) return
    const c = lastCalculation
    const text = `🥇 Gold & Silver Calculator — SciCalcPro
━━━━━━━━━━━━━━━━━━━━━━━
Metal: ${c.metal} (${c.purity}% pure)
Weight: ${c.weight} ${c.weightUnit}
Rate: ${c.currency} ${c.gramRate.toFixed(2)}/gram
━━━━━━━━━━━━━━━━━━━━━━━
Total: ${c.currency} ${c.totalPrice.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━
By Bilal Marghoob Creations
https://scicalcpro.vercel.app`

    navigator.clipboard.writeText(text).then(() => {
      const btn = copyBtn
      const originalText = btn.textContent
      btn.textContent = '✅ Copied!'
      setTimeout(() => { btn.textContent = originalText }, 2000)
    })
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  calculateBtn.addEventListener('click', calculateGold)
  resetBtn.addEventListener('click', resetGold)
  copyBtn.addEventListener('click', copyResult)
  printBtn.addEventListener('click', openPrintModal)
  printModalOverlay.addEventListener('click', closePrintModal)
  printModalClose.addEventListener('click', closePrintModal)
  printAction.addEventListener('click', printReceipt)
  pdfAction.addEventListener('click', savePDF)
  shareAction.addEventListener('click', shareResult)

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !printModal.classList.contains('hidden')) {
      closePrintModal()
    }
  })

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

  console.log('✅ Gold & Silver Calculator ready with Print feature')
})