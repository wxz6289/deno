#ifndef JSCALLBACK_H
#define JSCALLBACK_H

#ifdef __cplusplus
extern "C" {
#endif

// 函数指针类型定义
typedef void (*js_callback_t)(int value);

/**
 * 设置 JavaScript 回调函数
 * @param callback 回调函数指针
 */
void setCallback(js_callback_t callback);

/**
 * 执行已设置的回调函数
 */
void runCallback(void);

/**
 * 检查回调函数状态
 * @return 1 如果回调函数已设置，0 如果未设置
 */
int checkStatus(void);

#ifdef __cplusplus
}
#endif

#endif // JSCALLBACK_H