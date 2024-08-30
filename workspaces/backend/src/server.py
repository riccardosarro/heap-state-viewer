from flask import Flask, request, jsonify
import os
import tempfile
from pwn import *
# from dotenv import load_dotenv

# classes and utils
from classes import Chunk, Breakpoint
from utils import recvuntil, error_exit_cleanup, cleanup

# load environment variables
# load_dotenv()

app = Flask(__name__)
# cors headers
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST")
    return response

PROJECT_PATH = os.environ.get("PROJECT_PATH", ".")
print(f"PROJECT_PATH: {PROJECT_PATH}")
print(f"Current directory: {os.getcwd()}")
gdb_script_template_path = f"{PROJECT_PATH}/workspaces/backend/scripts/script-template.gdb"
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


def debug(tmp_dir):
    """
    This function runs gdb with the script and populates the global breakpoints list.
    """
    global breakpoints

    # run gdb with the script
    p = process(["gdb", "-x", f"{tmp_dir}/{GDBSCRIPT_NAME}"])
    p.recvuntil(b"pwndbg> ")

    # initialize breakpoints
    breakpoints = []

    # populate breakpoints
    while True:
        # print("1")
        p.sendline(b"nextret")
        res = recvuntil(p, b"pwndbg> ")
        if "exited normally" in res or "The program is not being run." in res:
            # finished
            break
        res = res.split("BACKTRACE")[1]

        # retrieve function
        function = res.split("\n")[1].split(" ")[-1]
        # if function is "name+number" then remove the number
        if "+" in function:
            function = function.split("+")[0]
        
        # retrieve heap info
        p.sendline(b"heap -v")
        heap = recvuntil(p, b"pwndbg> ")
        chunks = heap.split("\n\n")[:-1]
        # retrieve chunks and their memory 
        chunks, memory = retrieve_chunks_and_memory(p, chunks)
        # print(f"Appending breakpoint #{len(breakpoints)} - {function} with {len(chunks)} chunks, memory addresses {memory.keys()}")

        # retrieve bins
        bins = {}
        
        # append breakpoint
        breakpoints.append(Breakpoint(chunks, bins, function, memory))

        # continue on next breakpoint
        p.sendline(b"c")
        p.recvuntil(b"pwndbg> ")
    p.kill()


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


def retrieve_chunks_and_memory(p: process, chunks: list[str]):
    """
    For each chunk in the list, retrieves the chunk info and memory.
    """
    # init local chunks and memory
    _chunks: list[Chunk] = [None] * len(chunks)
    _memory: dict[str, str] = {}
    for i, chunk in enumerate(chunks):
        # retrieve chunk info
        chunk = chunk.replace("\x01", "").replace("\x02", "")
        # input("Press Enter to continue...")
        values = chunk.split("\n")
        allocated = values[0]
        print(allocated.encode())
        values = values[1:]
        [addr, prev_size, size, fd, bk, fd_nextsize, bk_nextsize] = (
            value.split(": ", 1)[1] for value in values
        )
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
        size_b10 = int(size, 16) // 4 # size in bytes
        p.sendline(f"x/{str(size_b10)}x {addr}".encode())
        memory = recvuntil(p, b"pwndbg> ")
        _memory[addr] = []
        for mem in memory.split("\n")[:-1]:
            _memory[addr] += mem.split("\t")[1:]
            # print(_memory)
    return _chunks, _memory

@app.route("/compile", methods=["POST"])
def compile():
    global breakpoints
    code = request.json.get("code", "")
    try:
        if code == "":
            return jsonify({"error": "No code provided"}), 400
        tmp_dir = save_code_to_file(code)
        if tmp_dir is None:
            return jsonify({"error": "Failed to save code to file"}), 500
        try:
            ret = os.system(
                f"gcc -o {tmp_dir}/{EXECUTABLE_NAME} {tmp_dir}/{FILENAME} -no-pie"
            )
            if ret != 0:
                raise Exception(f"Error while compiling code: gcc returned {ret}")

        except Exception as e:
            error_exit_cleanup("Error while compiling code", e, tmp_dir)
            return jsonify({"error": "Failed to compile code"}), 500

        try:
            debug(tmp_dir)
            # from now on global breakpoints should be populated
            assert len(breakpoints) > 0, "No breakpoints found"
        except AssertionError as e:
            error_exit_cleanup("AssertError", e, tmp_dir)
            return jsonify({"error": e}), 500
        except Exception as e:
            error_exit_cleanup("Error while running gdb or angr", e, tmp_dir)
            return jsonify({"error": "Failed to compile or analyze code"}), 500

        try:
            result = []
            for i, bp in enumerate(breakpoints):
                result.append(
                    {
                        "id": i,
                        "function": bp.function,
                        "chunks": [chunk.to_dict() for chunk in bp.chunks],
                    }
                )
            cleanup(tmp_dir)
            return jsonify({"breakpoints": result})
        except Exception as e:
            error_exit_cleanup("Error while collecting output", e, tmp_dir)
            return jsonify({"error": "Failed to collect output"}), 500
    except Exception as e:
        error_exit_cleanup("Internal server error", e, tmp_dir)
        return jsonify({"error": "Internal server error"}), 500
    except:
        error_exit_cleanup("Internal server error", "unknown", tmp_dir)
        return jsonify({"error": "Internal server error"}), 500


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
        return jsonify({"error": "Compile code first"}), 400
    try:
        print(f"Getting memory at breakpoint {bp_id} and address {addr}")
        _bp_id = int(bp_id)
        if _bp_id < 0 or _bp_id >= len(breakpoints):
            return jsonify({"error": f"Invalid breakpoint id. Must be between 0 and {len(breakpoints)-1}"}), 400
        bp = breakpoints[_bp_id]
        if addr not in bp.memory:
            return jsonify({"error": f"Invalid address. Must be in {bp.memory.keys()}"}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {e}"}), 500
    return jsonify({addr: bp.memory[addr]}), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
