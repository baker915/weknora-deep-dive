<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const previewDialog = ref<HTMLDialogElement | null>(null)
const previewImage = ref<HTMLImageElement | null>(null)
const src = ref('')
const alt = ref('')
const naturalWidth = ref(0)
const zoom = ref(1)

let observer: MutationObserver | undefined

const previewStyle = computed(() => ({
  width: naturalWidth.value ? `${naturalWidth.value * zoom.value}px` : 'auto',
  maxWidth: zoom.value <= 1 ? '100%' : 'none'
}))

function enhanceArticleImages() {
  document.querySelectorAll<HTMLImageElement>('.vp-doc p > img').forEach((image) => {
    const paragraph = image.parentElement
    if (!paragraph || paragraph.dataset.imagePreview === 'true') return

    paragraph.dataset.imagePreview = 'true'
    paragraph.classList.add('article-image')

    const toolbar = document.createElement('span')
    toolbar.className = 'article-image__toolbar'

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'mermaid-diagram__open article-image__open'
    button.setAttribute('aria-label', `全屏预览：${image.alt || '文章图片'}`)
    button.innerHTML = '<span aria-hidden="true">⛶</span>全屏预览'
    toolbar.append(button)
    paragraph.insertBefore(toolbar, image)

    image.tabIndex = 0
    image.setAttribute('role', 'button')
    image.setAttribute('aria-label', `放大预览：${image.alt || '文章图片'}`)
  })
}

function imageFromTarget(target: EventTarget | null): HTMLImageElement | null {
  if (!(target instanceof Element)) return null
  const paragraph = target.closest<HTMLParagraphElement>('.article-image')
  return paragraph?.querySelector<HTMLImageElement>(':scope > img') ?? null
}

function openPreview(image: HTMLImageElement) {
  const dialog = previewDialog.value
  if (!dialog) return

  src.value = image.currentSrc || image.src
  alt.value = image.alt
  naturalWidth.value = image.naturalWidth
  zoom.value = 1
  dialog.showModal()
  document.documentElement.classList.add('mermaid-preview-open')
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Element)) return
  if (!target.matches('.article-image > img, .article-image__open, .article-image__open *')) return

  const image = imageFromTarget(target)
  if (image) openPreview(image)
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  const target = event.target
  if (!(target instanceof HTMLImageElement) || !target.matches('.article-image > img')) return

  event.preventDefault()
  openPreview(target)
}

function handlePreviewLoad() {
  naturalWidth.value = previewImage.value?.naturalWidth ?? naturalWidth.value
}

function closePreview() {
  previewDialog.value?.close()
}

function handleDialogClick(event: MouseEvent) {
  if (event.target === previewDialog.value) closePreview()
}

function handleDialogClose() {
  document.documentElement.classList.remove('mermaid-preview-open')
  src.value = ''
  alt.value = ''
  naturalWidth.value = 0
}

function changeZoom(delta: number) {
  zoom.value = Math.min(2, Math.max(0.75, zoom.value + delta))
}

async function enhanceAfterNavigation() {
  await nextTick()
  enhanceArticleImages()
}

watch(() => route.path, enhanceAfterNavigation)

onMounted(() => {
  enhanceArticleImages()
  document.addEventListener('click', handleDocumentClick)
  document.addEventListener('keydown', handleDocumentKeydown)

  observer = new MutationObserver(enhanceArticleImages)
  observer.observe(document.body, { childList: true, subtree: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  document.removeEventListener('click', handleDocumentClick)
  document.removeEventListener('keydown', handleDocumentKeydown)
  document.documentElement.classList.remove('mermaid-preview-open')
})
</script>

<template>
  <dialog
    ref="previewDialog"
    class="mermaid-preview article-image-preview"
    aria-label="文章图片全屏预览"
    @click="handleDialogClick"
    @close="handleDialogClose"
  >
    <div class="mermaid-preview__panel">
      <header class="mermaid-preview__toolbar">
        <div class="mermaid-preview__heading">
          <strong>{{ alt || '图片预览' }}</strong>
        </div>
        <div class="mermaid-preview__actions">
          <button type="button" aria-label="缩小图片" :disabled="zoom <= 0.75" @click="changeZoom(-0.25)">−</button>
          <output aria-live="polite">{{ Math.round(zoom * 100) }}%</output>
          <button type="button" aria-label="放大图片" :disabled="zoom >= 2" @click="changeZoom(0.25)">＋</button>
          <button type="button" class="mermaid-preview__close" aria-label="关闭图片预览" @click="closePreview">关闭</button>
        </div>
      </header>
      <div class="mermaid-preview__body article-image-preview__body">
        <img
          v-if="src"
          ref="previewImage"
          :src="src"
          :alt="alt"
          class="article-image-preview__image"
          :style="previewStyle"
          @load="handlePreviewLoad"
        />
      </div>
    </div>
  </dialog>
</template>
