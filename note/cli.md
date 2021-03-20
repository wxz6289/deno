### 获取帮助信息
```sh
deno help
deno -h
deno help bundle
deno bundle -h
```

### 执行脚本
```sh
deno run main.ts
cat main.ts | deno run -
```
注意: 选项在前,参数在后

### 常用选项
--lock file 检查lock文件
--lock-write 写locak文件 

缓存和编译标记 deno cache/run/test
--config file 加载tsconfig.json
--import-map file 导入map文件
--no-remote 不解析远程模块
--reload=<CACHE_BLOCKLIST> 重载源码缓存
--unstable 启用不稳定API

运行时标记 deno run/test
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

### watch模式
```shell
deno run --watch --unstale test.ts
```



deno install -qAf --unstable https://deno.land/x/denon@2.4.4/denon.ts

CLI科学上网代理设置
set http_proxy http://host:port
set PATH=%PATH%;C:\Users\Dreamer\.deno\bin