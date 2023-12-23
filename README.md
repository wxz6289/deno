# Deno

Deno是基于V8、Rust和Tokio建立的默认安全并致力于提升开发者体验的JavaScript/TypeScript/WebAssembly运行环境。

无需任何配置文件、依赖清单或者构建脚本。

## 特性

- 默认安全
- TypeScript开箱即用
- 单一执行命令
- 内置多种工具
- deno官方维护的标准模块
- 打包到单一文件

## 安装 Deno

```sh
curl -fsSL https://deno.land/x/install/install.sh | sh
```

环境配置 添加如下环境变量到`$HOME/.zshrc`

```sh
export DENO_INSTALL="/Users/dreamerking/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"
```

```sh
# `-` 表示从标准输入中读取
cat main.ts | deno run -
cat ../test/dateTime.ts | deno run -
```

升级

```sh
deno upgrade
```

## Deno CLI

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

- 锁定文件
  适应子命令: cache、run、test、bundle、compile、doc
  --lock file 检查lock文件
  --lock-write 写locak文件

- 缓存和编译标记
  适用子命令: cache/run/test/bundle/doc/compile
  --config file 加载tsconfig.json
  --import-map file 导入map文件
  --no-remote 不解析远程模块
  --reload=<CACHE_BLOCKLIST> 重载源码缓存
  --unstable 启用不稳定API

- 运行时选项
  适用子命令:run/test
  - 权限选项
    -A, --allow-all 允许所有权限
    --allow-env 允许访问和设置环境变量
    --allow-hrtime 允许高精度时间
    --allow-net=<allow-net> 允许网路访问
    --allow-plugin 允许加载插件
    --allow-read=<allow-read>
    --allow-run\
    --allow-write=<allow-write>

  - 其他
    --cached-only
    --inspect=<HOST:PORT>
    --inspect-brk=<HOST:PORT>
    --seed <NUMBER>  指定 Math.random() 的随机种子
    --v8-flags=<v8-flags>
    --no-check 禁用ts类型检查 import/export type

- watch 选项
适用子命令: run、test、fmt、bundle

```shell
deno run --watch --unstale test.ts
```

代理设置 安装denon

```sh
set http_proxy http://host:port
deno install -qAf --unstable https://deno.land/x/denon@2.4.4/denon.ts
set PATH=%PATH%;C:\Users\Dreamer\.deno\bin
```

## 脚本参数

脚本名称后指定参数
Deno运行时选项参数在脚本名称之前

项目配置文件
deno.json/dene.jsonc
类似Node中的package.json 和 import map文件，不是必须的
