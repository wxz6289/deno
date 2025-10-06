// 更复杂的 C 函数示例，展示更多 FFI 功能
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 基础数学运算
int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

// 浮点数运算
double add_double(double a, double b) {
    return a + b;
}

// 字符串长度 (接受指针参数)
int string_length(const char* str) {
    if (str == NULL) return -1;
    return strlen(str);
}

// 数组求和
int sum_array(int* arr, int length) {
    if (arr == NULL) return 0;
    int sum = 0;
    for (int i = 0; i < length; i++) {
        sum += arr[i];
    }
    return sum;
}

// 修改传入的数值 (通过指针)
void increment(int* value) {
    if (value != NULL) {
        (*value)++;
    }
}

// 返回结构体数据 (简单的坐标点)
typedef struct {
    int x;
    int y;
} Point;

Point create_point(int x, int y) {
    Point p = {x, y};
    return p;
}

// 打印调试信息
void debug_print(const char* message) {
    printf("[C Debug] %s\n", message);
    fflush(stdout);
}