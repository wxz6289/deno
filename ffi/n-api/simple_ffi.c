// 简单的 C 函数，用于 Deno FFI
// 这些函数可以直接被 Deno FFI 调用

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 导出标记 - 确保函数可以被动态链接器找到
#ifdef _WIN32
    #define EXPORT __declspec(dllexport)
#else
    #define EXPORT __attribute__((visibility("default")))
#endif

// 简单的数学运算
EXPORT int add(int a, int b) {
    return a + b;
}

EXPORT int multiply(int a, int b) {
    return a * b;
}

// 字符串处理 - 返回静态字符串
EXPORT const char* get_greeting() {
    return "Hello from C FFI!";
}

// 数组求和
EXPORT int sum_array(int* arr, int length) {
    int sum = 0;
    for (int i = 0; i < length; i++) {
        sum += arr[i];
    }
    return sum;
}

// 简单的内存分配示例
EXPORT char* create_message(const char* name) {
    static char buffer[256];
    snprintf(buffer, sizeof(buffer), "Hello, %s from C!", name);
    return buffer;
}

// 版本信息
EXPORT const char* get_version() {
    return "1.0.0";
}