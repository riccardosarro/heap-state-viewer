ODC Project 2024 - Heap

# Project Overview

## Rough Outline
1. The user writes C code in the web editor and clicks a "Compile and Analyze" button.
2. Your frontend code sends a request to your backend with the C code.
3. Your backend code writes the C code to a file inside a new Docker container, compiles it with gcc, and runs gdb and angr on the resulting binary.
4. The backend collects the output of gdb and angr and sends it back to the frontend.
5. The frontend displays the output to the user.

- Frontend (Web Interface - React)
    - Code Editor
    - Operations (breakpoints hopper)
        - Compile
        - Next
        - Prev
    - Chunk Viewer 
        - White: Unallocated
        - Orange: Top Chunk
        - Green: Allocated

- Backend (Flask)
    - Angr Fast CFG
    - GDB Script
    - Memory Dump

# Frontend

React Web Interface

# Backend

Flask Server

# Notes
```notes
Interfaccia web dove appare
-codice (code-editor)
-tab operazioni
(Compila, next, Prev)
- chunk viewer
Bianco non allocato, arancione top chunk, verde allocato

Prendere il codice
Compilo -g (debug info) -nopie

Angr fast cfg prendo gli indirizzi con info su quali devo scegliere (no libreria)

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

Now open two terminals, one for the frontend and one for the backend

### Terminal 1 [Backend]
```bash
cd workspaces/backend/src
pip install -r requirements.txt
python server.py
```

### Terminal 2 [Frontend]
```bash
cd workspaces/frontend
npm install
npm start
```
Now it should open a browser window with the frontend

Enjoy!

[]: # (END)