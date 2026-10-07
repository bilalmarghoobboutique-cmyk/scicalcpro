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
      }
    }
  }
})