import './style.css'

console.log('💰 Profit Calculator — SciCalcPro')
console.log('👨‍💻 Bilal Marghoob Creations')

document.addEventListener('DOMContentLoaded', () => {
  const costInput = document.getElementById('cost-price')
  const sellInput = document.getElementById('selling-price')
  const calculateBtn = document.getElementById('calculate-profit')
  const resetBtn = document.getElementById('reset-profit')
  const resultDiv = document.getElementById('profit-result')
  const themeToggle = document.getElementById('theme-toggle')

  // ============================================
  // CALCULATE PROFIT
  // ============================================
  function calculateProfit() {
    const cp = parseFloat(costInput.value)
    const sp = parseFloat(sellInput.value)

    if (isNaN(cp) || isNaN(sp)) {
      alert('Please enter both cost and selling price')
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

    const banner = document.getElementById('profit-status-banner')
    const icon = document.getElementById('profit-status-icon')
    const text = document.getElementById('profit-status-text')

    if (isProfit) {
      banner.classList.remove('loss')
      icon.textContent = '📈'
      text.textContent = 'Profit'
    } else {
      banner.classList.add('loss')
      icon.textContent = '📉'
      text.textContent = 'Loss'
    }

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
    costInput.value = ''
    sellInput.value = ''
    resultDiv.classList.add('hidden')
    resultDiv.classList.remove('fade-in')
    costInput.focus()
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  calculateBtn.addEventListener('click', calculateProfit)
  resetBtn.addEventListener('click', resetProfit)

  costInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculateProfit()
  })
  sellInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculateProfit()
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

  console.log('✅ Profit Calculator ready')
})