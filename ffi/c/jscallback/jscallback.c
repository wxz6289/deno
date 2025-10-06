// JavaScript 回调函数示例的 C 源文件
#include <stdio.h>

// 函数指针类型定义
typedef void (*js_callback_t)(int value);

// 全局变量存储回调函数指针
static js_callback_t stored_callback = NULL;

// 设置回调函数
void setCallback(js_callback_t callback) {
    stored_callback = callback;
    printf("C: Callback function set\n");
}

// 执行回调函数
void runCallback() {
    if (stored_callback != NULL) {
        printf("C: Calling JavaScript callback with value 42\n");
        stored_callback(42);
    } else {
        printf("C: No callback function set\n");
    }
}

// 检查回调函数状态
int checkStatus() {
    if (stored_callback != NULL) {
        printf("C: Callback status - ACTIVE (function is set)\n");
        return 1; // 回调函数已设置
    } else {
        printf("C: Callback status - INACTIVE (no function set)\n");
        return 0; // 回调函数未设置
    }
}