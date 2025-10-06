#include <stdio.h>
#include <time.h>
#include "sleep.h"

// 获取当前时间戳（毫秒）
long long get_timestamp_ms() {
    struct timespec ts;
    clock_gettime(CLOCK_MONOTONIC, &ts);
    return ts.tv_sec * 1000 + ts.tv_nsec / 1000000;
}

int main() {
    printf("=== 跨平台睡眠函数测试 ===\n\n");

    // 测试不同的睡眠时间
    unsigned int test_times[] = {100, 500, 1000, 2000};
    int num_tests = sizeof(test_times) / sizeof(test_times[0]);

    for (int i = 0; i < num_tests; i++) {
        unsigned int sleep_time = test_times[i];

        printf("测试 %d: 睡眠 %u 毫秒...\n", i + 1, sleep_time);

        long long start = get_timestamp_ms();
        int result = sleep_ms(sleep_time);
        long long end = get_timestamp_ms();

        long long actual_time = end - start;

        printf("  - 返回值: %d\n", result);
        printf("  - 预期时间: %u ms\n", sleep_time);
        printf("  - 实际时间: %lld ms\n", actual_time);
        printf("  - 误差: %+lld ms\n", actual_time - sleep_time);

        if (result == 0) {
            printf("  - 状态: ✅ 成功\n");
        } else {
            printf("  - 状态: ❌ 失败\n");
        }

        printf("\n");
    }

    printf("测试完成！\n");
    return 0;
}