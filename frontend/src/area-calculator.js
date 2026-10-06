import './style.css'

console.log('📐 Area Calculator — SciCalcPro')
console.log('👨‍💻 Bilal Marghoob Creations')

document.addEventListener('DOMContentLoaded', () => {
  const shapeBtns = document.querySelectorAll('.shape-btn')
  const shapeGroups = document.querySelectorAll('.shape-input-group')
  const calculateBtn = document.getElementById('calculate-area')
  const resetBtn = document.getElementById('reset-area')
  const resultDiv = document.getElementById('area-result')
  const themeToggle = document.getElementById('theme-toggle')

  let currentShape = 'rectangle'

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
    let area = 0, perimeter = 0, formula = '', shapeName = ''

    if (currentShape === 'rectangle') {
      const l = parseFloat(document.getElementById('rect-length').value)
      const w = parseFloat(document.getElementById('rect-width').value)
      if (isNaN(l) || isNaN(w)) { alert('Please enter length and width'); return }
      area = l * w
      perimeter = 2 * (l + w)
      formula = 'L × W'
      shapeName = 'Rectangle'
    } else if (currentShape === 'circle') {
      const r = parseFloat(document.getElementById('circle-radius').value)
      if (isNaN(r)) { alert('Please enter radius'); return }
      area = Math.PI * r * r
      perimeter = 2 * Math.PI * r
      formula = 'π × r²'
      shapeName = 'Circle'
    } else if (currentShape === 'triangle') {
      const b = parseFloat(document.getElementById('tri-base').value)
      const h = parseFloat(document.getElementById('tri-height').value)
      if (isNaN(b) || isNaN(h)) { alert('Please enter base and height'); return }
      area = 0.5 * b * h
      perimeter = 0
      formula = '½ × b × h'
      shapeName = 'Triangle'
    } else if (currentShape === 'square') {
      const s = parseFloat(document.getElementById('square-side').value)
      if (isNaN(s)) { alert('Please enter side length'); return }
      area = s * s
      perimeter = 4 * s
      formula = 's²'
      shapeName = 'Square'
    }

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
    document.querySelectorAll('.age-input').forEach(i => i.value = '')
    resultDiv.classList.add('hidden')
    resultDiv.classList.remove('fade-in')
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  calculateBtn.addEventListener('click', calculateArea)
  resetBtn.addEventListener('click', resetArea)

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

  console.log('✅ Area Calculator ready')
})