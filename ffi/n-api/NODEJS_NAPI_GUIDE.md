# Node.js 如何加载和使用 NAPI 模块

## 🎯 成功示例

我们的 NAPI 模块已经成功构建并在 Node.js 中运行！

### ✅ 运行结果
```
🚀 Node.js NAPI 模块加载示例 (CommonJS)
✅ NAPI 模块加载成功!
📋 导出的函数: [ 'add', 'multiply', 'hello', 'sumArray', 'createObject' ]
✓ add(10, 20) = 30
✓ multiply(6, 7) = 42
✓ hello("Node.js") = "Hello, Node.js from Node-API!"
✓ sumArray([1,2,3,4,5]) = 15
✓ createObject() = { name: 'Deno Node-API', version: 1 }
⚡ 性能测试: 22.739ms (1,000,000 次调用)
```

## 📋 完整的 Node.js NAPI 使用流程

### 1. 项目结构
```
n-api/
├── napi_addon.cpp      # C++ 源码
├── binding.gyp         # 构建配置
├── package.json        # Node.js 项目配置
├── node-test.cjs       # CommonJS 测试文件
└── build/Release/      # 构建产物
    └── napi_addon.node # NAPI 模块
```

### 2. C++ 代码 (napi_addon.cpp)
```cpp
#include <node_api.h>

// 数学运算函数
napi_value Add(napi_env env, napi_callback_info info) {
    napi_value args[2];
    size_t argc = 2;
    napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);

    int32_t a, b;
    napi_get_value_int32(env, args[0], &a);
    napi_get_value_int32(env, args[1], &b);

    napi_value result;
    napi_create_int32(env, a + b, &result);
    return result;
}

// 模块初始化
napi_value Init(napi_env env, napi_value exports) {
    napi_value fn;

    // 注册 add 函数
    napi_create_function(env, nullptr, 0, Add, nullptr, &fn);
    napi_set_named_property(env, exports, "add", fn);

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```

### 3. 构建配置 (binding.gyp)
```json
{
  "targets": [
    {
      "target_name": "napi_addon",
      "sources": ["napi_addon.cpp"],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "CLANG_CXX_LIBRARY": "libc++",
        "MACOSX_DEPLOYMENT_TARGET": "10.9"
      }
    }
  ]
}
```

### 4. Node.js 加载代码 (CommonJS)
```javascript
// node-test.cjs
const addon = require('./build/Release/napi_addon.node');

console.log("✅ NAPI 模块加载成功!");
console.log("导出的函数:", Object.keys(addon));

// 使用函数
console.log("add(10, 20) =", addon.add(10, 20));
console.log("multiply(6, 7) =", addon.multiply(6, 7));
console.log("hello('Node.js') =", addon.hello("Node.js"));
```

### 5. ES 模块版本 (需要特殊处理)
```javascript
// node-test.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const addon = require('./build/Release/napi_addon.node');
console.log("ES模块中加载NAPI:", addon.add(5, 10));
```

## 🔧 构建和运行步骤

### 安装依赖
```bash
npm install
```

### 构建模块
```bash
npm run build
# 或者
node-gyp rebuild
```

### 运行测试
```bash
# CommonJS 版本 (推荐)
node node-test.cjs

# ES 模块版本
node node-test.mjs
```

## 📊 Node.js NAPI vs Deno FFI 对比

| 特性           | Node.js NAPI  | Deno FFI        |
|----------------|---------------|-----------------|
| **模块格式**   | .node 文件    | .so/.dylib/.dll |
| **加载方式**   | require()     | Deno.dlopen()   |
| **类型转换**   | 自动          | 手动            |
| **内存管理**   | 自动 GC       | 手动管理        |
| **构建复杂度** | 高 (node-gyp) | 低 (gcc)        |
| **性能**       | 优秀          | 优秀            |
| **跨平台**     | 需重新编译    | 需重新编译      |

## 🚀 NAPI 模块的优势

### 1. 自动类型转换
```cpp
// C++ 中简单处理 JavaScript 类型
napi_get_value_int32(env, args[0], &a);  // JS number → C int
napi_create_string_utf8(env, "hello", -1, &result);  // C string → JS string
```

### 2. 内存管理
```cpp
// NAPI 自动处理垃圾回收
// 无需手动 free() 内存
```

### 3. 错误处理
```cpp
// 内置异常处理机制
napi_throw_error(env, nullptr, "Something went wrong");
```

## ⚡ 性能特点

我们的测试结果显示：
- **100万次函数调用**: 22.739ms
- **每次调用平均时间**: ~0.023微秒
- **调用频率**: ~44百万次/秒

这证明了 NAPI 模块的高性能特性！

## 🛠️ 故障排除

### 常见问题

#### 1. 模块未找到
```
Error: Cannot find module './build/Release/napi_addon.node'
```
**解决方案**: 运行 `npm run build` 构建模块

#### 2. 架构不匹配
```
Error: dlopen: wrong architecture
```
**解决方案**: 重新构建 `npm run clean && npm run build`

#### 3. ES 模块导入错误
```
ReferenceError: require is not defined in ES module scope
```
**解决方案**: 使用 .cjs 文件或 createRequire

## 🎯 最佳实践

1. **使用 CommonJS** for NAPI 模块加载
2. **错误处理** 始终检查模块是否存在
3. **性能测试** 验证 NAPI 调用开销
4. **跨平台** 考虑不同操作系统的差异
5. **文档化** 清楚记录导出的函数接口

## 🔗 相关文件

- **C++ 源码**: `napi_addon.cpp`
- **构建配置**: `binding.gyp`
- **测试文件**: `node-test.cjs`
- **构建产物**: `build/Release/napi_addon.node`
- **构建脚本**: `test-nodejs.sh`

Node.js 的 NAPI 模块系统提供了强大而高效的原生代码集成能力！🚀