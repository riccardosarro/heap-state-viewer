# TODO:
# see get_memory() function
# import classes in server.py
# understand from bino what are the parameters (Chunk class) to take and pass to frontend
# finish debug() functions: return not a dumb breakpoint list but the real one (without memory)
# test functions in server.py
# Idea:
# - user can compile code
# - server holds latest compiled code data
# - server returns minimal information on compile:
#       number of breakpoints, chunks for each breakpoints and which function called
# - user can access memory of each chunk using the /memory/<bp_id>/<addr> endpoint
# - on new compiled code the previous code data will be lost

from pwn import *
import os
import tempfile
import re
from classes import Breakpoint, Chunk


gdb_script_template_path = "../scripts/script-template.gdb"
FILENAME = "code.c"
GDBSCRIPT_NAME = "script.gdb"
EXECUTABLE_NAME = "code"
BREAK_FNS = [
    "malloc",
    "calloc",
    "realloc",
    "free",
    # "valloc",
    # "pvalloc"
]
# the last debugged breakpoints
breakpoints: list[Breakpoint] = []


def cleanup(tmp_dir):
    """
    Cleans up the temporary directory, by executing: 
    ```python
    os.system(f"rm -rf {tmp_dir}")
    ``` 
    Args:
        tmp_dir (str): The path to the temporary directory.
    """
    os.system(f"rm -rf {tmp_dir}")


def error_exit_cleanup(errorMessage, e, tmp_dir):
    """
    Cleans up the temporary directory and prints an error message.
    
    Args:
        errorMessage (str): The error message to print.
        e (Exception): The exception that occurred.
        tmp_dir (str): The path to the temporary directory.
    
    Returns:
        dict: The error message and the status code.
    """
    # assert type of tmp_dir must be string
    assert type(tmp_dir) == str, "tmp_dir must be string"
    cleanup(tmp_dir)
    print(f"{errorMessage}: {e}")
    # return ({"error": errorMessage}), 500


# TODO: Check if code is escaped correctly (see '' and "")
def save_code_to_file(code):
    """
    Saves the provided code to a file in a temporary directory.
    Saves a gdb script to a file in the same directory.
    
    Args:
        code (str): The code to save.
        
    Returns:
        str: The path to the temporary directory.
    """
    global FILENAME
    tmp_dir = None
    try:
        # make tmp directory in /tmp
        tmp_dir = tempfile.mkdtemp()
        # save code to file
        tmp_file = os.path.join(tmp_dir, FILENAME)
        with open(tmp_file, "w") as f:
            f.write(code)
    except Exception as e:
        if tmp_dir:
            error_exit_cleanup("Error during save code to file", e, tmp_dir)
        else:
            print(f"Error during save code to file: {e}")
        return None
    try:
        # save gdb script to file
        gdb_script = os.path.join(tmp_dir, GDBSCRIPT_NAME)
        with open(gdb_script, "w") as f:
            with open(gdb_script_template_path, "r") as gdb_script_template:
                # replace {{tmpdir}} with tmp_dir
                for line in gdb_script_template:
                    f.write(line.replace("{{tmpdir}}", tmp_dir))

        # return the path to the tmp directory
        return tmp_dir

    except Exception as e:
        if tmp_dir:
            error_exit_cleanup("Error during save gdb script to file", e, tmp_dir)
        else:
            print(f"Error during save gdb script to file: {e}")
        return None


def remove_colors(bashtext: str):
    """
    Removes colors from the specified text.
    
    Args:
        bashtext (str): The text to remove colors from.
        
    Returns:
        str: The text without colors.
    """
    # remove colors with regexp
    return re.sub(r"\x1b[^m]*m", "", bashtext)


def recvuntil(p: process, text: bytes | str):
    """
    Receives data from the process until the specified text is found.
    Removes colors from the received data.
    
    Args:
        p (process): The process to receive data from.
        text (bytes | str): The text to receive until.
        
    Returns:
        str: The received data without colors.
    """
    return remove_colors(p.recvuntil(text).decode())

def retrieve_chunks_and_memory(p: process, chunks: list[str]):
    print(f"Retrieving {len(chunks)} chunks")
    _chunks: list[Chunk] = [None] * len(chunks)
    _memory: dict[str, str] = {}
    for i, chunk in enumerate(chunks):
            # print(chunk)
            # input("Next chunk?")
            values = chunk.split("\n")
            allocated = values[0]
            values = values[1:]
            [addr, prev_size, size, fd, bk, fd_nextsize, bk_nextsize] = (
                value.split(": ", 1)[1] for value in values
            )
            # print(
            #     f"allocated: {allocated}\naddr: {addr}\nprev_size: {prev_size}\nsize: {size}\nfd: {fd}\nbk: {bk}\nfd_nextsize: {fd_nextsize}\nbk_nextsize: {bk_nextsize}"
            # )
            [size, size_flagbits] = size.split(" ", 1)
            size_flagbits = size_flagbits.split(": ")[1][:-1]  # remove trailing ')'
            _chunks[i] = Chunk(
                allocated,
                addr,
                prev_size,
                size,
                size_flagbits,
                fd,
                bk,
                fd_nextsize,
                bk_nextsize,
            )
            # retrieve memory of chunk
            print(f"Retrieving memory of chunk {i} at {addr} of size {size}")
            size_b10 = int(size, 16) // 4 # size in bytes
            p.sendline(f"x/{str(size_b10)}x {addr}".encode())
            memory = recvuntil(p, b"pwndbg> ")
            # input(f"type of addr is {type(addr)}")
            _memory[addr] = []
            for mem in memory.split("\n")[:-1]:
                _memory[addr] += mem.split("\t")[1:]
                # print(_memory)
            input(f"size: {size}, lenmemory: {hex(len(_memory[addr])*4)}")
            # input("Press Enter to continue...")
            # input(f"Memory of chunk {i} at #{addr}:\n{_memory}\n\nPress Enter to continue...")
    return _chunks, _memory

def debug(tmp_dir):
    global breakpoints
    # TODO: Run gdb and/or angr on the resulting binary
    # gdb_output = os.system(f"gdb -x {tmp_dir}/{GDBSCRIPT_NAME}")
    # p = process(f"gdb -x {tmp_dir}/{GDBSCRIPT_NAME}")
    p = process(["gdb", "-x", f"{tmp_dir}/{GDBSCRIPT_NAME}"])
    # p.sendline(b"c")
    p.recvuntil(b"pwndbg> ")
    breakpoints = []
    while True:
        # print("1")
        p.sendline(b"nextret")
        res = recvuntil(p, b"pwndbg> ")
        if "exited normally" in res or "The program is not being run." in res:
            # finished
            break

        # res = p.recvuntil(b"BACKTRACE")
        res = res.split("BACKTRACE")[1]
        function = res.split("\n")[1].split(" ")[-1]
        # print(f"function is '{function}'")
        # input("Press Enter to continue...")
        # p.interactive()
        p.sendline(b"heap -v")
        heap = recvuntil(p, b"pwndbg> ")
        chunks = heap.split("\n\n")[:-1]
        # retrieve chunks and their memory 
        chunks, memory = retrieve_chunks_and_memory(p, chunks)
        # print(chunks)
        # input("Press Enter to continue...")
        print(f"Appending breakpoint #{len(breakpoints)} - {function} with {len(chunks)} chunks, memory addresses {memory.keys()}")
        breakpoints.append(Breakpoint(chunks, function, memory))

        p.sendline(b"c")
        p.recvuntil(b"pwndbg> ")

        # print(p.recvline().decode())
    p.kill()

def compile(code):
    try:
        if code == "":
            return ({"error": "No code provided"}), 400
        tmp_dir = save_code_to_file(code)
        if tmp_dir is None:
            return ({"error": "Failed to save code to file"}), 500
        try:
            ret = os.system(
                f"gcc -o {tmp_dir}/{EXECUTABLE_NAME} {tmp_dir}/{FILENAME} -no-pie"
            )
            if ret != 0:
                raise Exception(f"Error while compiling code: gcc returned {ret}")

        except Exception as e:
            error_exit_cleanup("Error while compiling code", e, tmp_dir)
            return ({"error": "Failed to compile code"}), 500

        try:
            # Run gdb and/or angr on the resulting binary
            input(f"Wait: {tmp_dir}")
            debug(tmp_dir)

        except Exception as e:
            error_exit_cleanup("Error while running gdb or angr", e, tmp_dir)
            return ({"error": "Failed to compile or analyze code"}), 500

        try:
            # TODO: Collect the output of gdb and angr and dumps

            # For now, just return the received code
            # [?] TODO: remove the tmp_dir (?)

            # count how many times the code will call the functions BREAK_FNS
            # consider also loops
            breakpoints = []
            for fn in BREAK_FNS:
                breakpoints.append(code.count(fn))
            cleanup(tmp_dir)
            return {"breakpoints": breakpoints}
        except:
            error_exit_cleanup("Error while collecting output", e, tmp_dir)
            return ({"error": "Failed to collect output"}), 500
    except:
        error_exit_cleanup("Internal server error", None, tmp_dir)
        return ({"error": "Internal server error"}), 500

# /memory/<bp_id>/<addr>
# TODO: put it in server.py and check if it works
# Idea is:
# - User will first have to compile code
# - Server will hold the latest compiled code in its own memory
# - User can call /memory/<bp_id>/<addr> to retrieve the exact bytes in memory 
#   in that address during that bp
def get_memory(bp_id: str, addr: str):
    # get memory addresses and their values
    if len(breakpoints) == 0:
        return {"error": "Compile code first"}, 400
    try:
        print(f"Getting memory at breakpoint {bp_id} and address {addr}")
        _bp_id = int(bp_id)
        if _bp_id < 0 or _bp_id >= len(breakpoints):
            return {"error": f"Invalid breakpoint id. Must be between 0 and {len(breakpoints)-1}"}, 400
        bp = breakpoints[_bp_id]
        if addr not in bp.memory:
            return {"error": f"Invalid address. Must be in {bp.memory.keys()}"}, 400
    except Exception as e:
        return {"error": f"Internal server error: {e}"}, 500
    return {addr: bp.memory[addr]}, 200


## TEST


def _proxy_http(fun, *args):
    try:
        res = fun(*args)
    except:
        return [{"error": "Internal server error"}, 500]
    # check if the result is a tuple
    if type(res) == tuple:
        return [res[0], res[1]]
    else:
        return [res, 200]

def proxy_http(fun, *args):
    [res, status] = _proxy_http(fun, *args)
    
    print(f"[{status}] {res}")

# Test the function
code = """
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *a = malloc(sizeof(int));
    free(a);
    return 0;
}
"""

proxy_http(get_memory, "0", "0x405000")

print("Compiling code")
proxy_http(compile, code)


print("Getting memory of first breakpoint at addr 0x405000")
proxy_http(get_memory, "0", "0x405000")
proxy_http(get_memory, "1", "0x405000")
proxy_http(get_memory, "2", "0x405000")

