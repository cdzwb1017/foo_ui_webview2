import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './styles/main.css';

// 等待 fb2k 可用
async function main() {
  try {
    // 初始化 Vue 应用
    const app = createApp(App);
    const pinia = createPinia();

    app.use(pinia);

    app.mount('#app');

    console.log('[Demo] foo_ui_webview2 Demo 已启动');
  } catch (error) {
    console.error('[Demo] 启动失败:', error);
  }
}

// 启动应用
main();
