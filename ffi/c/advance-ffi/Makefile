# Makefile for building shared library from add.c

# 检测操作系统
UNAME_S := $(shell uname -s)

# 根据操作系统设置变量
ifeq ($(UNAME_S),Darwin)
    # macOS
    LIB_EXT = dylib
    ADD_LIB = libadd.$(LIB_EXT)
    ADV_LIB = libadvanced.$(LIB_EXT)
    CC_FLAGS = -shared -fPIC
else ifeq ($(UNAME_S),Linux)
    # Linux
    LIB_EXT = so
    ADD_LIB = libadd.$(LIB_EXT)
    ADV_LIB = libadvanced.$(LIB_EXT)
    CC_FLAGS = -shared -fPIC
else
    # Windows (假设使用 MinGW)
    LIB_EXT = dll
    ADD_LIB = add.$(LIB_EXT)
    ADV_LIB = advanced.$(LIB_EXT)
    CC_FLAGS = -shared
endif

# 编译器和源文件
CC = gcc
ADD_SRC = add.c
ADV_SRC = advanced.c

# 默认目标
all: $(ADD_LIB) $(ADV_LIB)

# 编译基础共享库
$(ADD_LIB): $(ADD_SRC)
	@echo "🔨 编译 $(ADD_SRC) 为 $(ADD_LIB)..."
	$(CC) $(CC_FLAGS) -o $(ADD_LIB) $(ADD_SRC)
	@echo "✅ 编译完成: $(ADD_LIB)"

# 编译高级共享库
$(ADV_LIB): $(ADV_SRC)
	@echo "🔨 编译 $(ADV_SRC) 为 $(ADV_LIB)..."
	$(CC) $(CC_FLAGS) -o $(ADV_LIB) $(ADV_SRC)
	@echo "✅ 编译完成: $(ADV_LIB)"

# 单独编译目标
basic: $(ADD_LIB)
advanced: $(ADV_LIB)

# 测试基础 FFI
test-basic: $(ADD_LIB)
	@echo "🧪 运行基础 FFI 测试..."
	deno run --allow-ffi ffi-add.ts

# 测试高级 FFI
test-advanced: $(ADV_LIB)
	@echo "🧪 运行高级 FFI 测试..."
	deno run --allow-ffi advanced-ffi.ts

# 运行所有测试
test: test-basic test-advanced

# 查看符号表
symbols: $(ADD_LIB) $(ADV_LIB)
	@echo "🔍 查看基础库符号表:"
ifeq ($(UNAME_S),Darwin)
	nm -gU $(ADD_LIB)
	@echo ""
	@echo "🔍 查看高级库符号表:"
	nm -gU $(ADV_LIB)
else ifeq ($(UNAME_S),Linux)
	nm -D $(ADD_LIB)
	@echo ""
	@echo "🔍 查看高级库符号表:"
	nm -D $(ADV_LIB)
else
	@echo "Windows 系统请使用:"
	@echo "  objdump -T $(ADD_LIB)"
	@echo "  objdump -T $(ADV_LIB)"
endif

# 清理生成的文件
clean:
	@echo "🧹 清理生成的文件..."
	rm -f *.so *.dylib *.dll
	@echo "✅ 清理完成"

# 显示帮助信息
help:
	@echo "可用的 make 目标:"
	@echo "  all          - 编译所有共享库 (默认)"
	@echo "  basic        - 编译基础共享库"
	@echo "  advanced     - 编译高级共享库"
	@echo "  test-basic   - 编译并运行基础 FFI 测试"
	@echo "  test-advanced- 编译并运行高级 FFI 测试"
	@echo "  test         - 运行所有测试"
	@echo "  symbols      - 查看共享库的符号表"
	@echo "  clean        - 清理生成的文件"
	@echo "  help         - 显示此帮助信息"

# 声明伪目标
.PHONY: all basic advanced test-basic test-advanced test symbols clean help