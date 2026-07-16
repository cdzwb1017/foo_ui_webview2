/**
 * fb2k Bridge 封装
 *
 * ⚠️ 易出错点 1: window.fb2k 在插件加载后才可用
 * 必须等待 DOMContentLoaded 或使用 ready 检测
 */

interface Fb2kBridge {
  invoke<T = any>(method: string, params?: Record<string, any>): Promise<T>;
  on(event: string, callback: (data: any) => void): () => void;
  off(event: string, callback: (data: any) => void): void;
  once(event: string, callback: (data: any) => void): void;
}

// 获取 fb2k bridge 实例
export function getFb2k(): Fb2kBridge {
  const fb2k = (window as any).fb2k;
  if (!fb2k) {
    throw new Error('fb2k bridge not available. Are you running inside foo_ui_webview2?');
  }
  return fb2k;
}

/**
 * 安全调用 API
 *
 * ⚠️ 易出错点 2: API 调用可能失败，必须处理错误
 */
export async function invoke<T = any>(
  method: string,
  params: Record<string, any> = {}
): Promise<T> {
  try {
    const fb2k = getFb2k();
    const result = await fb2k.invoke(method, params);

    // ⚠️ 易出错点 3: 检查 success 字段
    // 大多数 API 返回 { success: boolean, ... }
    if (result && typeof result.success === 'boolean' && !result.success) {
      throw new Error(result.error || 'API call failed');
    }

    return result;
  } catch (error) {
    console.error(`[fb2k] ${method} failed:`, error);
    throw error;
  }
}

/**
 * 订阅事件
 *
 * ⚠️ 易出错点 4: 组件卸载时必须取消订阅，否则会内存泄漏
 */
export function subscribe(event: string, callback: (data: any) => void): () => void {
  const fb2k = getFb2k();
  return fb2k.on(event, callback);
}

/**
 * 检查 fb2k 是否可用
 */
export function isAvailable(): boolean {
  return typeof (window as any).fb2k !== 'undefined';
}

/**
 * 等待 fb2k 可用
 */
export function waitForFb2k(timeout = 5000): Promise<Fb2kBridge> {
  return new Promise((resolve, reject) => {
    if (isAvailable()) {
      resolve(getFb2k());
      return;
    }

    const start = Date.now();
    const check = () => {
      if (isAvailable()) {
        resolve(getFb2k());
      } else if (Date.now() - start > timeout) {
        reject(new Error('Timeout waiting for fb2k bridge'));
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });
}
