# How to use: run `gdb -x script.gdb`

file {{tmpdir}}/code

start

b *malloc
b *calloc
b *free
b *realloc
# b *valloc
# b *pvalloc

c

# check how to script gdb
# We want to:
# $running = true

# loop until the program ends
# at each break, we want to print the current state of the heap
# while $running
#   commands
#     silent
#     where
#     info registers
#     x/64xg $rsp
#     end
#   cextret

  # after each break, we want to go to next step and dump memory (of chunks)
  # along with output of `heap` command 
  # nextret
  # heap
  # ... dump ... (probably rax contains the address to the memory)
  # c