int add(int a, int b) {
  return a + b;
}

// gcc -shared -fPIC -o libadd.so add.c
// cc -c -o add.o add.c
// cc -shared -W -o libadd.so add.o