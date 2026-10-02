// 主线程：创建 Worker，发送任务并接收结果
const worker = new Worker(new URL('./worker.ts', import.meta.url).href, { type: 'module' });

worker.onmessage = (e) => {
  console.log('收到 worker 返回：', e.data);
  // 任务完成后终止 worker
  worker.terminate();
};

worker.onerror = (e) => {
  console.error('Worker 错误：', e.message);
  worker.terminate();
};

// 示例：计算第 40 个斐波那契数（较重的计算，适合放到 Worker）
const n = 40;
console.log('发送任务给 worker，n =', n);
worker.postMessage(n);

export {};
