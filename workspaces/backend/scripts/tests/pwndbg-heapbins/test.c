#include <stdio.h>
#include <stdlib.h>

int main() {
  int* ptr1 = malloc(460);
  int* ptr2 = malloc(432);
  int* ptr3 = malloc(464);
  int* ptr4 = malloc(428);

  printf("Allocated memory blocks:\n");
  printf("ptr1: %p\n", ptr1);
  printf("ptr2: %p\n", ptr2);
  printf("ptr3: %p\n", ptr3);
  printf("ptr4: %p\n", ptr4);

  free(ptr2);
  free(ptr3);

  printf("\nFreed memory blocks:\n");
  printf("ptr2: %p\n", ptr2);
  printf("ptr3: %p\n", ptr3);

  int* ptr5 = malloc(2400);
  int* ptr6 = malloc(400);

  printf("\nAllocated memory blocks after freeing some:\n");
  printf("ptr5: %p\n", ptr5);
  printf("ptr6: %p\n", ptr6);

  free(ptr1);
  free(ptr4);
  free(ptr5);
  free(ptr6);

  return 0;
}