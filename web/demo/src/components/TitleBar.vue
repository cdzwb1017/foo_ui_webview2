<!--
  TitleBar.vue - 自定义标题栏组件
  Demo 版本
-->
<template>
  <header class="titlebar">
    <!-- 左侧应用图标和标题 -->
    <div class="titlebar-left">
      <span class="app-icon">🎵</span>
      <span class="app-title">foobar2000</span>
    </div>

    <!-- 中间区域 -->
    <div class="titlebar-center"></div>

    <!-- 右侧窗口控制按钮 -->
    <div class="titlebar-right">
      <!-- 最小化 -->
      <button
        class="titlebar-btn"
        @click.stop="minimize"
        title="最小化"
      >
        <svg width="10" height="1" viewBox="0 0 10 1">
          <rect width="10" height="1" fill="currentColor" />
        </svg>
      </button>

      <!-- 最大化/还原 -->
      <button
        class="titlebar-btn"
        @click.stop="toggleMaximize"
        :title="isMaximized ? '还原' : '最大化'"
      >
        <svg v-if="isMaximized" width="10" height="10" viewBox="0 0 10 10">
          <path d="M2 0v2H0v8h8V8h2V0H2zm6 8H1V3h7v5zm1-6H3V1h6v1z" fill="currentColor" />
        </svg>
        <svg v-else width="10" height="10" viewBox="0 0 10 10">
          <rect width="10" height="10" fill="none" stroke="currentColor" stroke-width="1" />
        </svg>
      </button>

      <!-- 关闭 -->
      <button
        class="titlebar-btn titlebar-btn-close"
        @click.stop="close"
        title="关闭"
      >
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4-4-4z" fill="currentColor" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { invoke } from '@/api/fb2k';

const isMaximized = ref(false);

// 窗口控制
async function minimize() {
  await invoke('window.minimize');
}

async function toggleMaximize() {
  await invoke('window.toggleMaximize');
  isMaximized.value = !isMaximized.value;
}

async function close() {
  await invoke('window.close');
}

// 检查初始最大化状态
async function checkMaximized() {
  try {
    const result = await invoke('window.isMaximized');
    isMaximized.value = result.isMaximized || false;
  } catch (e) {
    // 忽略错误
  }
}

onMounted(() => {
  checkMaximized();
});
</script>

<style scoped>
.titlebar {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 8px;
  background: var(--bg-titlebar);
  user-select: none;
  cursor: default;
}

.titlebar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-icon {
  font-size: 14px;
}

.app-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
}

.titlebar-center {
  flex: 1;
}

.titlebar-right {
  display: flex;
}

.titlebar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.1s;
}

.titlebar-btn:hover {
  background: var(--bg-hover);
}

.titlebar-btn:active {
  background: var(--bg-active);
}

.titlebar-btn-close:hover {
  background: #e81123;
  color: white;
}

.titlebar-btn-close:active {
  background: #bf0f1d;
  color: white;
}
</style>
