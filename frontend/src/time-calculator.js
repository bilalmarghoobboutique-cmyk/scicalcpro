import './style.css'

console.log('⏰ Time Calculator — SciCalcPro')
console.log('👨‍💻 Bilal Marghoob Creations')

document.addEventListener('DOMContentLoaded', () => {
  const modeBtns = document.querySelectorAll('.time-mode-btn')
  const calculateBtn = document.getElementById('calculate-time')
  const resetBtn = document.getElementById('reset-time')
  const resultDiv = document.getElementById('time-result')
  const themeToggle = document.getElementById('theme-toggle')

  let currentMode = 'add'

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
      alert('Time cannot be negative')
      return
    }

    const rHours = Math.floor(resultSeconds / 3600)
    const rMinutes = Math.floor((resultSeconds % 3600) / 60)
    const rSecs = resultSeconds % 60

    document.getElementById('time-display').textContent = 
      `${String(rHours).padStart(2, '0')}:${String(rMinutes).padStart(2, '0')}:${String(rSecs).padStart(2, '0')}`
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
    document.querySelectorAll('.time-input').forEach(i => i.value = '')
    resultDiv.classList.add('hidden')
    resultDiv.classList.remove('fade-in')
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  calculateBtn.addEventListener('click', calculateTime)
  resetBtn.addEventListener('click', resetTime)

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

  console.log('✅ Time Calculator ready')
})