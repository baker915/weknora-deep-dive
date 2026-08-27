import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import MermaidDiagram from './MermaidDiagram.vue'
import ThemeLayout from './ThemeLayout.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: ThemeLayout,
  enhanceApp({ app }) {
    app.component('MermaidDiagram', MermaidDiagram)
  }
} satisfies Theme
