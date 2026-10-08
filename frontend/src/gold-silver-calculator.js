// ============================================
// Gold & Silver Calculator — With Ratti & Masha
// By Bilal Marghoob Creations
// ============================================

// ============================================
// CONVERSION CONSTANTS (in grams)
// ============================================
const UNIT_TO_GRAMS = {
  ratti: 0.1215,
  masha: 0.972,
  gram: 1,
  tola: 11.6638,
  ounce: 31.1035,
  kg: 1000
}

const UNIT_LABELS = {
  ratti: 'Ratti',
  masha: 'Masha',
  gram: 'Gram',
  tola: 'Tola',
  ounce: 'Ounce',
  kg: 'KG'
}

const UNIT_SHORT = {
  ratti: 'Ratti',
  masha: 'Masha',
  gram: 'g',
  tola: 'Tola',
  ounce: 'oz',
  kg: 'kg'
}

// ============================================
// STATE
// ============================================
let selectedMetal = 'gold24'
let selectedPurity = 99.9
let selectedWeightUnit = 'ratti'
let currentRatePerGram = 0
let currentCurrency = 'PKR'

// ============================================
// SERVICE WORKER REGISTER (PWA)
// ============================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('✅ SW registered:', reg.scope))
      .catch((err) => console.log('❌ SW failed:', err))
  })
}

// ============================================
// DOM ELEMENTS
// ============================================
const countrySelect = document.getElementById('country-select')
const currencyDisplay = document.getElementById('currency-display')
const metalButtons = document.querySelectorAll('.metal-btn')
const weightUnitButtons = document.querySelectorAll('.weight-unit-btn')
const weightUnitInput = document.getElementById('weight-unit')
const weightInput = document.getElementById('weight-input')
const makingCharges = document.getElementById('making-charges')
const taxPercent = document.getElementById('tax-percent')
const calculateBtn = document.getElementById('calculate-gold')
const resultDiv = document.getElementById('gold-result')
const resetBtn = document.getElementById('reset-gold')
const copyBtn = document.getElementById('copy-result')

// Rate inputs
const rateInputs = {
  ratti: document.getElementById('rate-ratti'),
  masha: document.getElementById('rate-masha'),
  gram: document.getElementById('rate-gram'),
  tola: document.getElementById('rate-tola'),
  ounce: document.getElementById('rate-ounce'),
  kg: document.getElementById('rate-kg')
}

// ============================================
// COUNTRY SELECT — Update Currency
// ============================================
countrySelect.addEventListener('change', (e) => {
  const value = e.target.value
  if (!value) return
  
  const parts = value.split('|')
  if (parts.length >= 4) {
    const [code, currency, currencyName, flag] = parts
    currentCurrency = currency
    currencyDisplay.value = `${currency} — ${currencyName}`
  }
})

// ============================================
// METAL SELECTOR
// ============================================
metalButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    metalButtons.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    selectedMetal = btn.dataset.metal
    selectedPurity = parseFloat(btn.dataset.purity)
  })
})

// ============================================
// WEIGHT UNIT SELECTOR
// ============================================
weightUnitButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    weightUnitButtons.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    selectedWeightUnit = btn.dataset.unit
    weightUnitInput.value = selectedWeightUnit
  })
})

// ============================================
// RATE INPUT — Auto-calculate other units
// ============================================
Object.keys(rateInputs).forEach(unit => {
  rateInputs[unit].addEventListener('input', (e) => {
    const value = parseFloat(e.target.value)
    if (!value || value <= 0) return
    
    // Convert entered rate to per-gram rate
    const gramsForUnit = UNIT_TO_GRAMS[unit]
    const ratePerGram = value / gramsForUnit
    
    // Update all other rate inputs
    Object.keys(rateInputs).forEach(otherUnit => {
      if (otherUnit === unit) return
      const otherGrams = UNIT_TO_GRAMS[otherUnit]
      const otherRate = ratePerGram * otherGrams
      rateInputs[otherUnit].value = otherRate.toFixed(4)
    })
  })
})

// ============================================
// CALCULATE
// ============================================
calculateBtn.addEventListener('click', () => {
  // Find rate per gram from whichever field is filled
  let ratePerGram = 0
  let rateSourceUnit = null
  
  Object.keys(rateInputs).forEach(unit => {
    const value = parseFloat(rateInputs[unit].value)
    if (value > 0 && !rateSourceUnit) {
      ratePerGram = value / UNIT_TO_GRAMS[unit]
      rateSourceUnit = unit
    }
  })
  
  if (!ratePerGram || ratePerGram <= 0) {
    alert('❌ Please enter a rate in at least one unit (Ratti, Masha, Gram, Tola, Ounce, or KG)')
    return
  }
  
  const weightValue = parseFloat(weightInput.value)
  if (!weightValue || weightValue <= 0) {
    alert('❌ Please enter a valid weight')
    return
  }
  
  // Convert weight to grams
  const weightInGrams = weightValue * UNIT_TO_GRAMS[selectedWeightUnit]
  
  // Calculate metal price
  const metalPrice = weightInGrams * ratePerGram
  
  // Making charges & tax
  const makingPercent = parseFloat(makingCharges.value) || 0
  const taxPercentValue = parseFloat(taxPercent.value) || 0
  
  const makingAmount = metalPrice * (makingPercent / 100)
  const subtotal = metalPrice + makingAmount
  const taxAmount = subtotal * (taxPercentValue / 100)
  const totalPrice = subtotal + taxAmount
  
  // Update result display
  document.getElementById('total-price').textContent = 
    `${currentCurrency} ${totalPrice.toFixed(2)}`
  
  document.getElementById('total-price-detail').textContent = 
    `${weightValue} ${UNIT_SHORT[selectedWeightUnit]} × ${(ratePerGram * UNIT_TO_GRAMS[selectedWeightUnit]).toFixed(2)} per ${UNIT_SHORT[selectedWeightUnit]}`
  
  // Update all weight breakdowns
  document.getElementById('result-ratti').textContent = (weightInGrams / UNIT_TO_GRAMS.ratti).toFixed(4)
  document.getElementById('result-masha').textContent = (weightInGrams / UNIT_TO_GRAMS.masha).toFixed(4)
  document.getElementById('result-gram').textContent = weightInGrams.toFixed(4)
  document.getElementById('result-tola').textContent = (weightInGrams / UNIT_TO_GRAMS.tola).toFixed(4)
  document.getElementById('result-ounce').textContent = (weightInGrams / UNIT_TO_GRAMS.ounce).toFixed(4)
  document.getElementById('result-kg').textContent = (weightInGrams / UNIT_TO_GRAMS.kg).toFixed(6)
  
  // Update all rate breakdowns
  document.getElementById('result-rate-ratti').textContent = (ratePerGram * UNIT_TO_GRAMS.ratti).toFixed(4)
  document.getElementById('result-rate-masha').textContent = (ratePerGram * UNIT_TO_GRAMS.masha).toFixed(4)
  document.getElementById('result-rate-gram').textContent = ratePerGram.toFixed(4)
  document.getElementById('result-rate-tola').textContent = (ratePerGram * UNIT_TO_GRAMS.tola).toFixed(4)
  document.getElementById('result-rate-ounce').textContent = (ratePerGram * UNIT_TO_GRAMS.ounce).toFixed(4)
  document.getElementById('result-rate-kg').textContent = (ratePerGram * UNIT_TO_GRAMS.kg).toFixed(2)
  
  // Update metal price, making, tax
  document.getElementById('result-metal-price').textContent = `${currentCurrency} ${metalPrice.toFixed(2)}`
  document.getElementById('result-making').textContent = `${currentCurrency} ${makingAmount.toFixed(2)}`
  document.getElementById('result-tax').textContent = `${currentCurrency} ${taxAmount.toFixed(2)}`
  
  // Show result
  resultDiv.classList.remove('hidden')
  
  // Scroll to result
  setTimeout(() => {
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 100)
})

// ============================================
// RESET
// ============================================
resetBtn.addEventListener('click', () => {
  Object.values(rateInputs).forEach(input => input.value = '')
  weightInput.value = ''
  makingCharges.value = '0'
  taxPercent.value = '0'
  resultDiv.classList.add('hidden')
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// ============================================
// COPY RESULT
// ============================================
copyBtn.addEventListener('click', () => {
  const total = document.getElementById('total-price').textContent
  const detail = document.getElementById('total-price-detail').textContent
  
  let text = `🥇 Gold & Silver Calculation\n`
  text += `━━━━━━━━━━━━━━━━━━━━\n`
  text += `Country: ${currencyDisplay.value}\n`
  text += `Metal: ${selectedMetal.toUpperCase()} (${selectedPurity}% purity)\n`
  text += `Weight: ${weightInput.value} ${UNIT_SHORT[selectedWeightUnit]}\n`
  text += `Total Price: ${total}\n`
  text += `━━━━━━━━━━━━━━━━━━━━\n`
  text += `✨ By Bilal Marghoob Creations`
  
  navigator.clipboard.writeText(text).then(() => {
    copyBtn.textContent = '✅ Copied!'
    setTimeout(() => { copyBtn.textContent = '📋 Copy Result' }, 2000)
  })
})

// ============================================
// PRINT FUNCTIONALITY (placeholder)
// ============================================
const printBtn = document.getElementById('print-btn')
if (printBtn) {
  printBtn.addEventListener('click', () => {
    window.print()
  })
}

console.log('✅ Gold & Silver Calculator loaded — Ratti & Masha supported')