// Worker: 接收一个数字 n，计算斐波那契并返回结果
self.onmessage = (e) => {
  const n = e.data;

  function fib(m: number): number {
    if (m <= 1) return m;
    let a = 0;
    let b = 1;
    for (let i = 2; i <= m; i++) {
      const tmp = a + b;
      a = b;
      b = tmp;
    }
    return b;
  }

  const result = fib(n);
  // 向主线程发送结果
  // 使用简单对象封装，便于扩展
  self.postMessage({ n, result });
};

export { };
