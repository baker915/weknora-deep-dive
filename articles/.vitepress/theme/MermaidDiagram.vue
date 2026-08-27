<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { renderMermaid } from './mermaid-renderer'

const props = defineProps<{ code: string }>()
const host = ref<HTMLElement | null>(null)
const previewDialog = ref<HTMLDialogElement | null>(null)
const previewHost = ref<HTMLElement | null>(null)
const error = ref('')
const previewError = ref('')
const previewLoading = ref(false)
const zoom = ref(1)

const decodedCode = computed(() => decodeBase64Utf8(props.code))
const previewStyle = computed(() => ({
  width: `${zoom.value * 100}%`,
  minWidth: `${960 * zoom.value}px`
}))

function decodeBase64Utf8(value: string): string {
  const bytes = Uint8Array.from(atob(value), (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

onMounted(async () => {
  try {
    const id = `mermaid-diagram-${crypto.randomUUID()}`
    const { svg, bindFunctions } = await renderMermaid(id, decodedCode.value)
    if (host.value) {
      host.value.innerHTML = svg
      bindFunctions?.(host.value)
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause)
  }
})

async function openPreview() {
  const dialog = previewDialog.value
  if (!dialog) return

  previewError.value = ''
  previewLoading.value = true
  zoom.value = 1
  dialog.showModal()
  document.documentElement.classList.add('mermaid-preview-open')
  await nextTick()

  try {
    const id = `mermaid-preview-${crypto.randomUUID()}`
    const { svg, bindFunctions } = await renderMermaid(id, decodedCode.value)
    if (previewHost.value) {
      previewHost.value.innerHTML = svg
      bindFunctions?.(previewHost.value)
    }
  } catch (cause) {
    previewError.value = cause instanceof Error ? cause.message : String(cause)
  } finally {
    previewLoading.value = false
  }
}

function closePreview() {
  previewDialog.value?.close()
}

function handleDialogClick(event: MouseEvent) {
  if (event.target === previewDialog.value) closePreview()
}

function handleDialogClose() {
  document.documentElement.classList.remove('mermaid-preview-open')
  if (previewHost.value) previewHost.value.innerHTML = ''
}

function changeZoom(delta: number) {
  zoom.value = Math.min(2, Math.max(0.75, zoom.value + delta))
}

onBeforeUnmount(() => {
  document.documentElement.classList.remove('mermaid-preview-open')
})
</script>

<template>
  <figure class="mermaid-diagram">
    <div class="mermaid-diagram__toolbar">
      <div class="mermaid-legend" aria-label="图表颜色说明">
        <span><i class="mermaid-legend__dot mermaid-legend__dot--entry" />入口</span>
        <span><i class="mermaid-legend__dot mermaid-legend__dot--service" />主服务</span>
        <span><i class="mermaid-legend__dot mermaid-legend__dot--agent" />Agent / 模型</span>
        <span><i class="mermaid-legend__dot mermaid-legend__dot--rag" />RAG</span>
        <span><i class="mermaid-legend__dot mermaid-legend__dot--async" />异步</span>
        <span><i class="mermaid-legend__dot mermaid-legend__dot--state" />状态</span>
        <span><i class="mermaid-legend__dot mermaid-legend__dot--parser" />解析</span>
        <span><i class="mermaid-legend__dot mermaid-legend__dot--external" />外部 / 可选</span>
      </div>
      <button type="button" class="mermaid-diagram__open" aria-label="全屏预览架构图" @click="openPreview">
        <span aria-hidden="true">⛶</span>
        全屏预览
      </button>
    </div>
    <div class="mermaid-diagram__viewport">
      <div v-if="!error" ref="host" class="mermaid-diagram__canvas" />
      <pre v-else class="mermaid-diagram__error">图表渲染失败：{{ error }}</pre>
    </div>

    <dialog
      ref="previewDialog"
      class="mermaid-preview"
      aria-label="架构图全屏预览"
      @click="handleDialogClick"
      @close="handleDialogClose"
    >
      <div class="mermaid-preview__panel">
        <header class="mermaid-preview__toolbar">
          <div class="mermaid-preview__heading">
            <strong>架构图预览</strong>
            <div class="mermaid-legend" aria-label="图表颜色说明">
              <span><i class="mermaid-legend__dot mermaid-legend__dot--entry" />入口</span>
              <span><i class="mermaid-legend__dot mermaid-legend__dot--service" />主服务</span>
              <span><i class="mermaid-legend__dot mermaid-legend__dot--agent" />Agent / 模型</span>
              <span><i class="mermaid-legend__dot mermaid-legend__dot--rag" />RAG</span>
              <span><i class="mermaid-legend__dot mermaid-legend__dot--async" />异步</span>
              <span><i class="mermaid-legend__dot mermaid-legend__dot--state" />状态</span>
              <span><i class="mermaid-legend__dot mermaid-legend__dot--parser" />解析</span>
              <span><i class="mermaid-legend__dot mermaid-legend__dot--external" />外部 / 可选</span>
            </div>
          </div>
          <div class="mermaid-preview__actions">
            <button type="button" aria-label="缩小架构图" :disabled="zoom <= 0.75" @click="changeZoom(-0.25)">−</button>
            <output aria-live="polite">{{ Math.round(zoom * 100) }}%</output>
            <button type="button" aria-label="放大架构图" :disabled="zoom >= 2" @click="changeZoom(0.25)">＋</button>
            <button type="button" class="mermaid-preview__close" aria-label="关闭架构图预览" @click="closePreview">关闭</button>
          </div>
        </header>
        <div class="mermaid-preview__body">
          <p v-if="previewLoading" class="mermaid-preview__status">正在渲染架构图…</p>
          <pre v-else-if="previewError" class="mermaid-diagram__error">图表渲染失败：{{ previewError }}</pre>
          <div v-show="!previewLoading && !previewError" ref="previewHost" class="mermaid-preview__canvas" :style="previewStyle" />
        </div>
      </div>
    </dialog>
  </figure>
</template>
