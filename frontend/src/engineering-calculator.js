import './style.css'

console.log('⚙️ Engineering Calculator — SciCalcPro')
console.log('👨‍💻 Bilal Marghoob Creations')

document.addEventListener('DOMContentLoaded', () => {
  const engBtns = document.querySelectorAll('.eng-btn')
  const engGroups = document.querySelectorAll('.eng-input-group')
  const calculateBtn = document.getElementById('calculate-eng')
  const resetBtn = document.getElementById('reset-eng')
  const resultDiv = document.getElementById('eng-result')
  const themeToggle = document.getElementById('theme-toggle')

  let currentEng = 'ohm'

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
    let result = 0, formula = '', unit = ''

    if (currentEng === 'ohm') {
      const v = parseFloat(document.getElementById('ohm-voltage').value)
      const i = parseFloat(document.getElementById('ohm-current').value)
      const r = parseFloat(document.getElementById('ohm-resistance').value)

      const count = [v, i, r].filter(x => !isNaN(x)).length
      if (count < 2) {
        alert('Please enter at least 2 values')
        return
      }

      if (isNaN(v)) { result = i * r; formula = 'V = I × R'; unit = 'Volts' }
      else if (isNaN(i)) { result = v / r; formula = 'I = V / R'; unit = 'Amperes' }
      else if (isNaN(r)) { result = v / i; formula = 'R = V / I'; unit = 'Ohms' }
      else { result = v; formula = 'V = I × R'; unit = 'Volts' }

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
    }

    document.getElementById('eng-display').textContent = result.toFixed(4)
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
    document.querySelectorAll('.age-input').forEach(i => i.value = '')
    resultDiv.classList.add('hidden')
    resultDiv.classList.remove('fade-in')
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  calculateBtn.addEventListener('click', calculateEng)
  resetBtn.addEventListener('click', resetEng)

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

  console.log('✅ Engineering Calculator ready')
})