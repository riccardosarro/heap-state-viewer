# Heap State Viewer - ODC Project 2024

## Project Overview
The goal of this project is to create a web-based tool that allows users to write C code, compile it, and analyze its heap state at different points in the program's execution. The tool will display the memory state of the heap at each breakpoint, highlighting the top chunk, allocated chunks, and unallocated chunks.

### Rough Outline Specifications
1. The user writes C code in the web editor and clicks a "Compile" button.
2. The frontend code sends a request to your backend with the C code.
3. The backend code writes the C code to a file, compiles it with gcc, and runs gdb on the resulting binary.
4. The backend collects the output of gdb, collects chunks and bins state and memory, and sends it back to the frontend, preserving all the memory of the chunks.
5. The frontend displays the output to the user.
6. The user can use the slider to move between breakpoints, and the frontend will display the memory state at each breakpoint.
7. The user can visualize the memory of a chunk by clicking the right icon.

### Components and Technologies
- Frontend (Web Interface - React)
    - Code Editor
    - Operations (breakpoints hopper)
        - Compile
        - Next
        - Prev
        - Slider
    - Breakpoints Control 
        - Chunk Memory Viewer
- Backend (Flask)
    - GDB Script
    - Memory Dump

## Frontend

React Web Interface with Code Editor

#### LocalStorage API
It uses the `localStorage` API to store the code edits, so you can close or reload the page without losing your code.

#### Shortcuts
You can see all the shortcuts by pressing the `?` icon at the end of the page, alongside the copyright.

*Code Editor*
- `Ctrl + S` - Compile

*Flow Control*
- `Ctrl + ArrowRight` - Next breakpoint
- `Ctrl + ArrowLeft` - Previous breakpoint

#### Memory State Viewer
It uses the [react-hexviewer-ts](https://github.com/KondakovArtem/react-hexviewer-ts) library to display the memory state of the heap at each breakpoint. 

There is a **size limit** (just a warning) of **10MB** for the memory dump file, since higher sizes of memory dumps *may* cause the application to slow down or crash.

## Backend API
Flask Server with the following endpoints:
- `/compile` - POST
    - Request: `{ code: string }`
    - Response: `{ breakpoints: Breakpoint[] } | { error: string }`
    (see src for Breakpoint structure)
- `/memory/<bpId>/<addr>` - GET
    - Response: `{ <addr>: string[] } | { error: string }`

    **bpId**: Breakpoint ID
    **addr**: Memory Address (of the chunk)

## How to Run
In order to run the project, you need **node.js** *(>=14)* and **python** *(>=3)* installed on your machine.

Clone the repository
```bash
git clone https://github.com/riccardosarro/heap-state-viewer.git
```

Change directory
```bash
cd heap-state-viewer
```

Add the environment variable
```bash
echo "PROJECT_PATH=$(pwd)" > .env
echo "BACKEND_PATH=$(pwd)/workspaces/backend" >> .env
echo "FRONTEND_PATH=$(pwd)/workspaces/frontend" >> .env
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
