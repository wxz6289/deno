Deno命名空间的API是稳定的 标准模块 std

Deno支持兼容浏览器事件的事件load和unload,
load事件是异步的,unload事件是同步，它们都不可取消。
通过window.addEventListener可以多次注册load或unload事件,而通过window.onload或window.unload只执行最后一次注册的。

编译API

1. Deno.compile(rootName [, sources, options]) 获取并缓存代码，编译但不执行
2. Deno.bundle()

deno test --filter "test" tests/

测试 assert() 相等性 assertEquals() assertNotEquals() assertStrictEquals() 包含
assertStringContains() assertArrayContains() 正则 assertMatch() 异常
assertThrows() assertAsyncThrows()

模块元信息
import.meta 提供模块的上下文信息
imoprt.meta.main 当前模块是否是程序的入口模块
import.meta.url 当前模块的url路径
import.meta.resolve 基于当前模块的解析函数

Deno.mainModule 当前模块入口地址

Deno相关的Web框架

- Fresh
- Hono
- SevlteKit
- Nuxt
- Astro
