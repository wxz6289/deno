#ifndef SLEEP_H
#define SLEEP_H

#ifdef __cplusplus
extern "C" {
#endif

/**
 * 跨平台毫秒级睡眠函数
 * @param ms 睡眠时间（毫秒）
 * @return 0 成功，-1 失败
 */
int sleep_ms(unsigned int ms);

#ifdef __cplusplus
}
#endif

#endif // SLEEP_H