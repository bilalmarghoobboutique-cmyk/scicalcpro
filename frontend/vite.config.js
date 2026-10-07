import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        age: resolve(__dirname, 'age-calculator.html'),
        profit: resolve(__dirname, 'profit-calculator.html'),
        area: resolve(__dirname, 'area-calculator.html'),
        time: resolve(__dirname, 'time-calculator.html'),
        engineering: resolve(__dirname, 'engineering-calculator.html'),
        gold: resolve(__dirname, 'gold-silver-calculator.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        blogArticle1: resolve(__dirname, 'blog/how-to-use-scientific-calculator.html'),
        blogArticle2: resolve(__dirname, 'blog/deg-vs-rad.html'),
        blogArticle3: resolve(__dirname, 'blog/calculator-tricks.html'),
        blogArticle4: resolve(__dirname, 'blog/how-to-calculate-age.html'),
        blogArticle5: resolve(__dirname, 'blog/profit-vs-markup.html'),
        blogArticle6: resolve(__dirname, 'blog/area-formulas-guide.html'),
        blogArticle7: resolve(__dirname, 'blog/time-calculation-guide.html'),
        blogArticle8: resolve(__dirname, 'blog/ohms-law-explained.html'),
        blogArticle9: resolve(__dirname, 'blog/gold-rate-calculation.html'),
        blogArticle10: resolve(__dirname, 'blog/top-10-free-calculators.html'),
      }
    }
  }
})