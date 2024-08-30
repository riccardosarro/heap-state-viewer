# How to use: run `gdb -x script.gdb`

file ./test

start

b *malloc
b *calloc
b *free
b *realloc
# b *valloc
# b *pvalloc

c

# in loop
  # nextret
  # heap / (bins)
  # ... dump ... (probably rax contains the address to the memory)
  # c