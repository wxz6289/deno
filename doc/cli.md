# Deno 命令行工具

## 帮助信息

```bash
deno help
deno -h
deno --help
deno help compile
deno compile -h
deno compile --help
```

## 初始化项目

```bash
deno init
deno init --lib project_name
deno init --npm project_name
deno init --serve
```

选项

- --lib 生成示例库项目
- --npm 生成示例 npm creat-* 项目
- --serve 生成示例 deno serve 项目

## 运行

```bash
deno run main.ts
deno repl --eval "import { assert } from '@std/assert';"
deno repl --eval-file=eval.ts,main.ts
```

```bash
deno eval "console.log('Hello from Deno!')"
deno eval --ext=ts "const x: number = 42; console.log(x);"
```

```sh
deno serve server.ts
deno serve --watch --port=8080 server.ts
```

## 安装和卸载

```bash
deno install
deno install jsr:@std/bytes
deno install npm:chalk
deno install --entrypoint entry1.ts entry2.ts
deno install -g --allow-net --allow-read jsr:@std/http/file_server
deno install -g --allow-net --allow-read npm:serve
deno install -g --allow-net --allow-read -n serve jsr:@std/http/file_server
deno install -g --allow-net --allow-read --root /usr/local  jsr:@std/http/file_server
deno install --allow-scripts=npm:sqlite3
deno uninstall file_server
deno uninstall @std/dotenv chalk
deno uninstall -g file_server
deno uninstall -g  --root /usr/local serve
deno remove express @std/http
```

## 更新依赖

```bash
deno update
deno update --latest
deno outdated --update
deno update --latest "@std/*"
deno update --latest "@std/*" "!@std/fmt*"
deno update @std/fmt@^1.0.2
```

## 升级Deno版本

```bash
deno upgrade
deno upgrade  1.45.0
deno upgrade stable
deno upgrade rc
deno upgrade canary
deno upgrade --output $HOME/my_deno
```

## 检查更新依赖

```bash
deno outdated
deno outdated "@std/*"
deno outdated  --compatible
deno outdated  --update
deno outdated  --update --latest
```

## 测试

```bash
deno test
deno test util/
deno test test_util.ts
deno test --parallel
deno test test_main.ts  -- -e --foo --bar
deno test -A
deno test --allow-all
deno test --watch
deno test -A --watch
deno test --filter add
deno test --filter "/test-*\d/" tests/
```

## 添加包

```bash
deno add jsr:@std/path
deno add npm:react
deno add jsr:@std/assert npm:chalk
deno add --jsr @std/path
deno add --npm react
deno add --lock=lock.json jsr:@std/path
```

## 发布包

```bash
deno publish
deno publish --dry-run
deno publish --check=all
```

## 基准测试

```bash
deno bench
deno bench --filter fib
deno bench --filter "/bench-*\d/"
deno bench --watch
deno bench --allow-exclude "**/exclude_bench.ts"
deno bench --json
deno bench --json --output=bench.json
```

## 编译

```bash
deno compile mod.ts
deno compile --unstable mod.ts
deno compile -A mod.ts
deno compile --allow-all mod.ts
deno compile -A --unstable mod.ts
deno compile --allow-all --unstable mod.ts
deno compile -A --unstable --output my_program mod.ts
deno compile --allow-all --unstable --output my_program mod.ts
```

## 打包

```bash
deno bundle mod.ts > bundle.js
deno bundle --unstable mod.ts > bundle.js
deno bundle -o bundle.js mod.ts
```

## 检查

```bash
deno check mod.ts
deno check --no-check=remote mod.ts
deno check --no-check=all mod.ts
```

## 格式化

```bash
deno fmt
deno fmt mod.ts
deno fmt src/
```

## 语法检查lint

```bash
deno lint
deno lint mod.ts
deno lint src/
deno lint --json
deno lint --rules
```

## 清理

```bash
deno clean
deno clean --dry-run
deno clean --except=registry
```

## 任务执行

```bash
deno task
deno task build
deno task test
deno task --list
deno task --eval "echo $(pwd)"
deno task "build-*"
deno eval "console.log(1); console.log(2);" |& deno run main.ts
deno run main.ts $(git rev-parse HEAD)
```

环境变量

- INIT_CWD - 任务执行目录
- DENO_JOBS - 任务并行数

`&&` 和 `||` 支持
`&&` 前一个任务成功才执行后一个任务
`||` 前一个任务失败才执行后一个任务
`;` 前一个任务结束后执行下一个任务,不管成功与否
`&` 异步执行任务 `||true` 确保命令成功
`|` 管道符,将前一个任务的输出作为后一个任务的输入
`|&` 将前一个任务的标准输出和标准错误作为后一个任务的输入
`$(command)` 命令替换
`!` 否定退出代码, 命令前加感叹号和空格

重定向
`>` 重定向标准输出到文件
`>>` 追加标准输出到文件
`2>` 重定向标准错误到文件
`2>>` 追加标准错误到文件
`&>` 重定向标准输出和标准错误到文件
`&>>` 追加标准输出和标准错误到文件
`<` 从文件重定向标准输入
`<<` 从内联文本重定向标准输入
`<<<` 从字符串重定向标准输入
`>&2` 重定向标准输出到标准错误
`2>&1` 重定向标准错误到标准输出

环境变量与Shell变量
Shell变量不会被导出到生成的命令中

内置命令

- cp 复制文件
- mv 移动文件
- rm 删除文件或目录
- mkdir 创建目录
- pwd 显示当前目录
- sleep 休眠指定秒数
- echo 输出文本
- cat 连接并将其输出到标准输出
- exit 退出并返回指定代码
- head 输出文件的前几行
- unset 取消设置Shell变量
- xargs 将标准输入转换为命令行参数

Deno不支持npm生命周期事件，必须明确运行脚本

## 部署

```bash
# 部署当前目录
deno deploy
deno deploy --project=your-project-name script.ts
### 全局选项
-  --org <name> 指定组织
- --app <name> 指定应用
- --prod 部署到生产环境

### 创建新应用
```bash
deno deploy create --org <name> <app-name> 创建新应用
```

### 环境变量管理

```bash
deno deploy env list
deno deploy env ls --app <name> 列出环境变量
deno deploy env add <key> <value> 添加/更新环境变量
deno deploy env update-value <key> <value> 添加/更新环境变量
deno deploy env update-context <key> <context> 更新环境变量上下文
deno deploy env delete <key> 删除环境变量
deno deploy env load <file> 从文件加载环境变量
```

### 应用日志

```bash
deno deploy logs
deno deploy logs --app <name> 查看应用日志
deno deploy logs --start <date> --end <date> --org <name> --app <name> 查看指定时间段内的日志
```

### 云服务集成

```bash
deno deploy setup-aws  --app <name> 集成AWS云服务
deno deploy setup-gcp  --app <name> 集成Google Cloud Platform云服务
```

## 补全脚本

```bash
deno completions bash > deno_bash_completions.sh
deno completions zsh > _deno
deno completions fish > deno.fish
```

## 覆盖率测试

```bash
deno coverage cov_profile
deno coverage  --include="^file:" --exclude="test\.(ts|js)" cov_profile
deno coverage --lcov --output=cov.lcov cov_profile
deno coverage --o html_cov cov.lcov
```

## 文档生成

```bash
deno doc ./path/to/module.ts
deno doc --html --name="My Lib" ./path/to/module.ts
deno doc --lint ./path/to/module.ts
deno doc ./path/to/module.ts MyClass.someField
deno doc
deno doc --filter Deno.Listener
```

## 依赖检查

```bash
deno info
deno info jsr:@std/path
deno info npm:chalk
```

## Jupyter

```bash
deno jupyter --unstable
deno jupyter --unstable --install
```

常用选项

## 依赖管理选项

- --node-modules-dir 指定 node_modules 目录
- --vendor/--no-vendor 启用/禁用 vendor 目录
- --allow-scripts npm生命周期脚本
- --config/-c/--no-config 指定配置文件
- --outdir 指定输出目录
- --output/-o 指定输出文件
- --watch/-w 监听文件变化
- --lock 检查指定锁文件
- --no-lock 禁用锁文件的自动发现
- --npm/--no-npm 启用/禁用 npm 支持
- --remote/--no-remote 启用/不解析远程模块
- --reload/-r 重新下载远程模块和 npm 包
- --frozen 如果锁文件过期则报错
- --import-map 指定导入映射文件
- --reload/-r 重新加载指定模块
- --preload 预加载脚本
- --no-code-cache 禁用V8代码缓存
- --cached-only 缓存远程依赖

## 类型检查选项

- --check/-C 启用类型检查
- --no-check 跳过类型检查

## 权限选项

- --allow-*/--deny-* 允许/拒绝特定权限
- --allow-all/-A 允许所有权限
- --allow-import/-I/--deny-import 允许/拒绝导入远程模块
- --allow-read/-R/--deny-read 允许/拒绝读取文件
- --allow-write/-W/--deny-write 允许/拒绝写入文件
- --allow-net/-N/--deny-net 允许/拒绝网络请求
- --allow-env/-E/--deny-env 允许/拒绝访问环境变量
- --allow-run/--deny-run 允许/拒绝运行子进程
- --cert 指定CA证书
- --conditions 指定条件自定义条件
- --permission-set/-P 指定权限集

## 调试选项

- --inspect 启用 V8 Inspector
- --inspect-brk 启用 V8 Inspector 并在第一行暂停
- --inspect-await 端口上激活检查器并等待调试器连接后再运行用户代码

## 监视选项

- --watch/-w 监听文件变化
- --no-clear-screen 禁用清屏
- --watch-exclude 指定忽略的文件
- --watch-hmr 监视文件更改并自动进行模块替换而不是重新启动

## 编译选项

- --icon 指定应用图标
- --exclude 指定排除的文件
- --include 指定包含的文件
- --output/-o 指定输出文件
- --target 指定编译目标
- --no-terminal

## 文档选项

- --doc 对JSDOC以及实际代码进行类型检查
- --doc-only 仅对JSDoc和Markdown中的代码进行类型检查
- --json 指定输出 JSON 文档文件
- --html 以HTML格式输出
- --lint 输出文档诊断
- --name 指定文档名称
- --private 输出私有文档
- --filter 过滤文档输出
- --category-docs 仅输出指定类别的文档

## 其他选项

- --evn-file 指定环境变量文件
- --config/-c 指定配置文件
- --no-config 禁用配置文件自动加载
- --ext 指定文件扩展名
- --location 一些WEB API使用的globalThis.location的值
- --seed 指定随机数种子
- --v8-flags 传递给 V8 的标志
- --cwd 指定任务执行目录
- --filter/-f 过滤工作区的成员

## 安装选项

- --dev/-D 作为开发依赖安装
- --entrypoint/-e 安装指定文件及其依赖
- --force/-f 强制重新安装
- --global/-g 全局安装
- --name/-n 指定安装的可执行文件名称
- --root 指定安装根目录
- --quiet/-q 静默安装
- --compatible 兼容模式安装
- --interactive/-i 交互式安装
- --latest 安装最新版本,不考虑semver兼容性
- --recursive/-r 包括所有工作区

## 升级选项

- --dry-run 仅执行检查，不进行实际升级
- --force 强制升级
- --output/-o 更新版本的路径
- --latest 升级到最新版本
- --version 指定升级到的版本
- --canary 升级到最新的canary版本
