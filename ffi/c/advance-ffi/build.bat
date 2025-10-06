@echo off
REM Windows 批处理脚本 - 编译 C 代码为 DLL

echo 🔨 开始编译 C 代码为 DLL...

REM 检查是否存在 add.c 文件
if not exist "add.c" (
    echo ❌ 错误: 找不到 add.c 文件
    pause
    exit /b 1
)

REM 检查是否安装了 gcc
gcc --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 gcc 编译器
    echo 请安装 MinGW-w64 或 MSYS2
    echo 下载地址: https://www.mingw-w64.org/
    pause
    exit /b 1
)

echo 🪟 检测到 Windows 系统

REM 编译 DLL
gcc -shared -o add.dll add.c

if errorlevel 1 (
    echo ❌ 编译失败
    pause
    exit /b 1
)

echo ✅ 成功生成: add.dll
dir add.dll

echo.
echo 🎉 编译完成！
echo.
echo 📋 下一步:
echo 1. 运行 FFI 测试: deno run --allow-ffi ffi-add.ts
echo 2. 或者查看 DLL 信息: objdump -T add.dll

pause