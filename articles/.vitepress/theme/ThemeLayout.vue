<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ArticleImagePreview from './ArticleImagePreview.vue'

const VitePressLayout = DefaultTheme.Layout
</script>

<template>
  <VitePressLayout />
  <ArticleImagePreview />
</template>
