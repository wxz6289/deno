# 模块

Deno采用类似浏览器的模块解析规则,文件名必须全部指定，不能省略扩展名，也没有对index.js等作特殊处理。

本地模块
远程模块

导入映射
在`deno.json`文件中配置`imports`。通过配置`scopes`来覆盖特定模块中的导入。
导入映射适合应用程序，库开发优先depts。

## 环境变量

- 内置Deno.env
- .env文件 使用库dotenv读取
- 使用库`std/flags`解析cli参数

```bash
deno check test.ts
deno check --all test.ts
deno run test.ts // 不做类型检查
deno run --check module.ts
deno run --check=all module.ts // 对远程模块和npm模块都做检查
// @ts-ignore or // @ts-expect-error
```

文件类型确定

- 本地模块根据扩展名确定文件类型，扩展名缺失默认为js类型
- 远程模块根据mime-type确定文件类型

Deno对ts的检查默认使用strict模式,默认不对js文件做类型检查,在js文件中不支持ts模块的导入，ts模块中指出js模块的导入

在Deno中配置ts

```bash
deno run --config ./deno.json main.ts
```

配置文件`tsconfig.json`在deno项目中仍然有效，但更推荐使用`deno.json`或`deno.jsonc`。deno只查看`tsconfig.json`中编译选项`compilerOption`部分,并且有些选项会被忽略。

```ts
// @deno-types="./coolLib.d.ts"
/// <reference types="./coolLib.d.ts" />

```
