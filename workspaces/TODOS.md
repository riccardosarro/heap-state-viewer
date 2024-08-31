# TODOs:

- Minor: When user in frontend uses the CTRL + S shortcut to save the file, it should try to save the code written as a file

## Backend
- Major: Implement how to save bins state
// i.e. bins output is 
bins
tcachebins
0x1a0 [  1]: 0x55555555a760 ◂— 0x0
0x1c0 [  2]: 0x555555559820 —▸ 0x555555559480 ◂— 0x0
0x1e0 [  2]: 0x5555555592a0 —▸ 0x555555559640 ◂— 0x0
fastbins
empty
unsortedbin
all: 0x555555559de0 —▸ 0x7ffff7e1ace0 (main_arena+96) ◂— 0x555555559de0
smallbins
empty
largebins
empty

retrieve the state and send it to the heap state

## Frontend
HERE
Done the majority of ui for viewing chunks state, now needs to think about how to ask to view exact memory of that chunk (there will be a button?, there will be an API to call to retrieve the memory bytes, how to display the memory bytes?)

Later on, focus on bins state (retrieving them in the backend and returning them in a format where the frontend shares (same types)) and how to display them in the frontend