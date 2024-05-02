from flask import Flask, request, jsonify
import os
import tempfile
from pwn import *

app = Flask(__name__)

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


def error_exit_cleanup(errorMessage, e, tmp_dir):
    # assert type of tmp_dir must be string
    assert type(tmp_dir) == str, "tmp_dir must be string"
    os.system(f"rm -rf {tmp_dir}")
    print(f"{errorMessage}: {e}")
    return jsonify({"error": errorMessage}), 500


def debug(tmp_dir):
    # TODO: Run gdb and/or angr on the resulting binary
    # gdb_output = os.system(f"gdb -x {tmp_dir}/{GDBSCRIPT_NAME}")
    p = process(f"gdb -x {tmp_dir}/{GDBSCRIPT_NAME}")


# TODO: Check if code is escaped correctly (see '' and "")
def save_code_to_file(code):
    global FILENAME
    tmp_dir = None
    try:
        # make tmp directory in /tmp
        tmp_dir = tempfile.mkdtemp()
        # save code to file
        tmp_file = os.path.join(tmp_dir, FILENAME)
        with open(tmp_file, "w") as f:
            f.write(code)
        # save gdb script to file
    except Exception as e:
        if tmp_dir:
            error_exit_cleanup("Error during save code to file", e, tmp_dir)
        else:
            print(f"Error during save code to file: {e}")
        return None
    try:
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


@app.route("/compile", methods=["POST"])
def compile_code():
    code = request.json.get("code", "")
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
            raise Exception("Error while compiling code")

    except Exception as e:
        error_exit_cleanup("Error while compiling code", e, tmp_dir)
        return jsonify({"error": "Failed to compile code"}), 500

    try:
        debug(tmp_dir)

    except Exception as e:
        error_exit_cleanup("Error while running gdb or angr", e, tmp_dir)
        return jsonify({"error": "Failed to compile or analyze code"}), 500

    try:
        # TODO: Collect the output of gdb and angr and dumps

        # For now, just return the received code
        # [?] TODO: remove the tmp_dir (?)

        # count how many times the code will call the functions BREAK_FNS
        # consider also loops
        breakpoints = []
        for fn in BREAK_FNS:
            breakpoints.append(code.count(fn))

        return jsonify({"breakpoints": breakpoints})
    except:
        error_exit_cleanup("Error while collecting output", e, tmp_dir)
        return jsonify({"error": "Failed to collect output"}), 500

# route for retrieving memory addresses and their values
# as /memory/<bp_id>/<addr>
@app.route("/memory/<bp_id>/<addr>", methods=["GET"])
def get_memory(bp_id, addr):
    # get memory addresses and their values
    print(f"Getting memory at breakpoint {bp_id} and address {addr}")
    return jsonify({"memory": {addr: "value"}})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
