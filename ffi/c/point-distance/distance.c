// 计算两点之间距离的 C 函数
#include <math.h>
#include <stdio.h>

// 点结构体
typedef struct {
    double x;
    double y;
} Point;

// 计算两点之间的欧几里得距离
double distance(const Point* p1, const Point* p2) {
    if (p1 == NULL || p2 == NULL) {
        return -1.0; // 错误值
    }

    double dx = p2->x - p1->x;
    double dy = p2->y - p1->y;

    return sqrt(dx * dx + dy * dy);
}

// 创建点的辅助函数
Point create_point(double x, double y) {
    Point p = {x, y};
    return p;
}

// 打印点坐标的辅助函数
void print_point(const Point* p) {
    if (p != NULL) {
        printf("Point(%.2f, %.2f)\n", p->x, p->y);
    }
}