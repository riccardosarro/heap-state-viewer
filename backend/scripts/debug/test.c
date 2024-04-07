#include <stdio.h>
#include <malloc.h>

int main(int argc, char const *argv[])
{
  /* code */
  int* p = malloc(100);
  int *q = calloc(100, 1);
  int *s = realloc(p, 100); // s == p
  int *r = pvalloc(100);
  int *t = valloc(100);
  
  
  free(p);
  free(q);
  free(r);
  free(t);
  
  return 0;
}

