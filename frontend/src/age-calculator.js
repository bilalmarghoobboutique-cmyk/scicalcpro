import './style.css'

console.log('🎂 Age Calculator — SciCalcPro')
console.log('👨‍💻 Bilal Marghoob Creations')

document.addEventListener('DOMContentLoaded', () => {
  const dobInput = document.getElementById('dob-input')
  const asofInput = document.getElementById('asof-input')
  const calculateBtn = document.getElementById('calculate-age')
  const resetBtn = document.getElementById('reset-age')
  const resultDiv = document.getElementById('age-result')
  const themeToggle = document.getElementById('theme-toggle')

  // Set max date to today
  const today = new Date().toISOString().split('T')[0]
  dobInput.setAttribute('max', today)
  asofInput.setAttribute('max', today)

  // ============================================
  // CALCULATE AGE
  // ============================================
  function calculateAge() {
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
    dobInput.value = ''
    asofInput.value = ''
    resultDiv.classList.add('hidden')
    resultDiv.classList.remove('fade-in')
    dobInput.focus()
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  calculateBtn.addEventListener('click', calculateAge)
  resetBtn.addEventListener('click', resetAge)

  dobInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculateAge()
  })
  asofInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculateAge()
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

  console.log('✅ Age Calculator ready')
})