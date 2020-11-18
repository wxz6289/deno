获取帮助信息
```sh
deno help
deno -h
deno --help
deno help bundle
deno bundle -h
deno bundle --help
```
执行脚本
```sh
deno run main.ts
cat main.ts | deno run -
```

脚本的参数放在脚本后，脚本前的参数是Deno运行时标记

--lock file 检查lock文件
--lock-write 写locak文件 

--config file 加载tsconfig.json
--importmap file 导入map文件
--no-remote 不解析远程模块
--reload=<CACHE_BLOCKLIST> 重载源码缓存
--unstable 启用不稳定API

运行时标记 run test
权限标记
-A, --allow-all 允许所有权限
--allow-env 允许访问和设置环境变量
--allow-hrtime 允许高精度时间
--allow-net=<allow-net> 允许网路访问
--allow-plugin 允许加载插件
--allow-read=<allow-read>
--allow-run
--allow-write=<allow-write>

其他
--cached-only 
--inspect=<HOST:PORT>
--inspect-brk=<HOST:PORT>
--seed <NUMBER> seed Math.random()
--v8-flags=<v8-flags>
--no-check 禁用ts类型检查  import/export type

Deno命名空间的API是稳定的
标准模块 std

Deno支持兼容浏览器事件的事件load和unload, load事件是异步的,unload事件是同步，它们都不可取消。
通过window.addEventListener可以多次注册load或unload事件,而通过window.onload或window.unload只执行最后一次注册的。

编译API
1. Deno.compile(rootName [, sources, options]) 获取并缓存代码，编译但不执行
2. Deno.bundle()

deno test --filter "test" tests/

测试
assert()
相等性
assertEquals()
assertNotEquals()
assertStrictEquals()
包含
assertStringContains()
assertArrayContains()
正则
assertMatch()
异常
assertThrows()
assertAsyncThrows()


set http_proxy http://host:port

deno install -qAf --unstable https://deno.land/x/denon@2.4.4/denon.ts

set PATH=%PATH%;C:\Users\Dreamer\.deno\bin


