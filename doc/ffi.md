# FFI

- 在Deno应用程序中使用现有的本地库。
- 使用Rust或C等语言实现的关键性代码。
- 访问JavaScript无法直接访问的系统资源或功能。

通过FFI加载的本地库具有与Deno运行时相同的权限，因此请确保只加载受信任的库。

- 访问文件系统
- 进行网络通信
- 访问环境变量
- 执行系统命令

FFI API受限于`--allow-ffi`权限标志。

```bash
deno run --allow-ffi your_script.ts
```

FFI替代方案

- WebAssembly (WASM) 在沙箱环境中运行代码
- Rust + wasm-pack 编译Rust代码为WASM模块
- Deno.command 以受限权限执行外部二进制文件和子进程
- Deno原生API
