import './style.css'
import { inject } from '@vercel/analytics'

// Initialize Vercel Web Analytics
inject()

console.log('📝 Blog Home — SciCalcPro')
console.log('👨‍💻 Bilal Marghoob Creations')

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle')

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

  console.log('✅ Blog Home ready')
})