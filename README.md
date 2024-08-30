ODC Project 2024 - Heap

# Project Overview

## Rough Outline
1. The user writes C code in the web editor and clicks a "Compile and Analyze" button.
2. Your frontend code sends a request to your backend with the C code.
3. Your backend code writes the C code to a file, compiles it with gcc, and runs gdb on the resulting binary.
4. The backend collects the output of gdb and sends it back to the frontend.
5. The frontend displays the output to the user.

- Frontend (Web Interface - React)
    - Code Editor
    - Operations (breakpoints hopper)
        - Compile
        - Next
        - Prev
    - Breakpoints Control 
        - White: Unallocated
        - Orange: Top Chunk
        - Green: Allocated
- Backend (Flask)
    - GDB Script
    - Memory Dump

# Frontend

React Web Interface

# Backend

Flask Server

### Notes for myself
```notes
Interfaccia web dove appare
-codice (code-editor)
-tab operazioni
(Compila, next, Prev)
- Breakpoints Control
Bianco non allocato, arancione top chunk, verde allocato

Prendere il codice
Compilo -g (debug info) -nopie

Faccio gdb script e metto breakpoint E dumpo la memoria ad ogni breakpoint

Break prima della funzione
Appena Dopo la funzione
```

# How to Run
In order to run the project, you need node.js (>=14) and python (>=3) installed on your machine.

Clone the repository
```bash
git clone https://github.com/riccardosarro/odc-project.git
```

Change directory
```bash
cd odc-project
```

Install the dependencies

```bash
pip install -r workspaces/backend/src/requirements.txt
npm install
```

Now open two terminals, one for the frontend and one for the backend

### Terminal 1 [Backend]
```bash
npm run start:backend
```

### Terminal 2 [Frontend]
```bash
npm run start:frontend
```

Now it should open a browser window with the frontend

Enjoy!

[]: # (END)