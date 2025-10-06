# 跨平台编译脚本

# macOS/Linux 编译
echo "=== 编译 macOS/Linux 版本 ==="
gcc -o test_sleep test_sleep.c sleep.c -std=c99
if [ $? -eq 0 ]; then
    echo "✅ 编译成功"
    echo "🚀 运行测试..."
    ./test_sleep
else
    echo "❌ 编译失败"
fi

# 清理
echo ""
echo "=== 清理编译文件 ==="
rm -f test_sleep

# 编译为共享库用于 Deno FFI
echo ""
echo "=== 编译共享库 ==="
gcc -shared -fPIC -o libsleep.so sleep.c -std=c99
if [ $? -eq 0 ]; then
    echo "✅ 共享库编译成功: libsleep.so"
else
    echo "❌ 共享库编译失败"
fi

echo ""
echo "=== 编译完成 ==="