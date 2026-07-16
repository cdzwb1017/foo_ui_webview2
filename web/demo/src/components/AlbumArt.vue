<template>
  <div
    class="album-art"
    :class="{ 'has-cover': src, 'is-loading': isLoading }"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      @load="onLoad"
      @error="onError"
    />
    <div v-else class="placeholder">
      <slot>🎵</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  src?: string;
  alt?: string;
  size?: number;
}

// Props 已定义但未直接使用，因为通过 Vue 响应式系统自动处理
defineProps<Props>();

const isLoading = ref(true);
const hasError = ref(false);

function onLoad() {
  isLoading.value = false;
  hasError.value = false;
}

function onError() {
  isLoading.value = false;
  hasError.value = true;
}
</script>

<style scoped>
.album-art {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.album-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.album-art .placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.3);
}

.album-art.is-loading .placeholder {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
