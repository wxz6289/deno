#ifdef _WIN32
#include <windows.h>
#else
#include <time.h>
#include <unistd.h>
#endif

int sleep_ms(unsigned int ms) {
  #ifdef _WIN32
    Sleep(ms);
    return 0;
  #else
    struct timespec ts;
    ts.tv_sec = ms / 1000;
    ts.tv_nsec = (ms % 1000) * 1000000;
    return nanosleep(&ts, NULL);
  #endif
}
