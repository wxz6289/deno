// Node-API C++ 原生模块
// 演示如何创建 Node-API 模块供 Deno 使用
#include <node_api.h>
#include <assert.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>

// 基础数学运算函数
napi_value Add(napi_env env, napi_callback_info info) {
    napi_status status;
    size_t argc = 2;
    napi_value args[2];
    status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    assert(status == napi_ok);

    if (argc < 2) {
        napi_throw_type_error(env, nullptr, "Wrong number of arguments");
        return nullptr;
    }

    int32_t value1, value2;
    status = napi_get_value_int32(env, args[0], &value1);
    assert(status == napi_ok);
    status = napi_get_value_int32(env, args[1], &value2);
    assert(status == napi_ok);

    napi_value result;
    status = napi_create_int32(env, value1 + value2, &result);
    assert(status == napi_ok);

    return result;
}

// 乘法运算
napi_value Multiply(napi_env env, napi_callback_info info) {
    napi_status status;
    size_t argc = 2;
    napi_value args[2];
    status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    assert(status == napi_ok);

    int32_t value1, value2;
    status = napi_get_value_int32(env, args[0], &value1);
    assert(status == napi_ok);
    status = napi_get_value_int32(env, args[1], &value2);
    assert(status == napi_ok);

    napi_value result;
    status = napi_create_int32(env, value1 * value2, &result);
    assert(status == napi_ok);

    return result;
}

// 字符串处理函数
napi_value Hello(napi_env env, napi_callback_info info) {
    napi_status status;
    size_t argc = 1;
    napi_value args[1];
    status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    assert(status == napi_ok);

    // 获取字符串参数
    size_t str_size;
    status = napi_get_value_string_utf8(env, args[0], nullptr, 0, &str_size);
    assert(status == napi_ok);

    char* input_str = (char*)malloc(str_size + 1);
    status = napi_get_value_string_utf8(env, args[0], input_str, str_size + 1, &str_size);
    assert(status == napi_ok);

    // 创建响应字符串
    char response[256];
    snprintf(response, sizeof(response), "Hello, %s from Node-API!", input_str);

    napi_value result;
    status = napi_create_string_utf8(env, response, NAPI_AUTO_LENGTH, &result);
    assert(status == napi_ok);

    free(input_str);
    return result;
}

// 数组求和函数
napi_value SumArray(napi_env env, napi_callback_info info) {
    napi_status status;
    size_t argc = 1;
    napi_value args[1];
    status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    assert(status == napi_ok);

    // 检查是否为数组
    bool is_array;
    status = napi_is_array(env, args[0], &is_array);
    assert(status == napi_ok);

    if (!is_array) {
        napi_throw_type_error(env, nullptr, "Expected an array");
        return nullptr;
    }

    // 获取数组长度
    uint32_t length;
    status = napi_get_array_length(env, args[0], &length);
    assert(status == napi_ok);

    // 计算数组元素之和
    int32_t sum = 0;
    for (uint32_t i = 0; i < length; i++) {
        napi_value element;
        status = napi_get_element(env, args[0], i, &element);
        assert(status == napi_ok);

        int32_t value;
        status = napi_get_value_int32(env, element, &value);
        assert(status == napi_ok);

        sum += value;
    }

    napi_value result;
    status = napi_create_int32(env, sum, &result);
    assert(status == napi_ok);

    return result;
}

// 对象操作函数
napi_value CreateObject(napi_env env, napi_callback_info info) {
    napi_status status;
    napi_value obj;
    status = napi_create_object(env, &obj);
    assert(status == napi_ok);

    // 添加属性
    napi_value name_value;
    status = napi_create_string_utf8(env, "Deno Node-API", NAPI_AUTO_LENGTH, &name_value);
    assert(status == napi_ok);

    napi_value version_value;
    status = napi_create_int32(env, 1, &version_value);
    assert(status == napi_ok);

    status = napi_set_named_property(env, obj, "name", name_value);
    assert(status == napi_ok);

    status = napi_set_named_property(env, obj, "version", version_value);
    assert(status == napi_ok);

    return obj;
}

// 模块初始化函数
napi_value Init(napi_env env, napi_value exports) {
    napi_status status;
    napi_value fn;

    // 注册 add 函数
    status = napi_create_function(env, nullptr, 0, Add, nullptr, &fn);
    assert(status == napi_ok);
    status = napi_set_named_property(env, exports, "add", fn);
    assert(status == napi_ok);

    // 注册 multiply 函数
    status = napi_create_function(env, nullptr, 0, Multiply, nullptr, &fn);
    assert(status == napi_ok);
    status = napi_set_named_property(env, exports, "multiply", fn);
    assert(status == napi_ok);

    // 注册 hello 函数
    status = napi_create_function(env, nullptr, 0, Hello, nullptr, &fn);
    assert(status == napi_ok);
    status = napi_set_named_property(env, exports, "hello", fn);
    assert(status == napi_ok);

    // 注册 sumArray 函数
    status = napi_create_function(env, nullptr, 0, SumArray, nullptr, &fn);
    assert(status == napi_ok);
    status = napi_set_named_property(env, exports, "sumArray", fn);
    assert(status == napi_ok);

    // 注册 createObject 函数
    status = napi_create_function(env, nullptr, 0, CreateObject, nullptr, &fn);
    assert(status == napi_ok);
    status = napi_set_named_property(env, exports, "createObject", fn);
    assert(status == napi_ok);

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)