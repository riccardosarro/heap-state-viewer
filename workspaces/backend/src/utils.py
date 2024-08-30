from pwn import process
import os
import re

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

