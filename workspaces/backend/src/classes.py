
class Chunk:
    """
    Represents a memory chunk in the heap.

    Attributes:
        `allocated` (str): The allocation status of the chunk.
        `addr` (str): The address of the chunk.
        `prev_size` (str): The size of the previous chunk.
        `size` (str): The size of the chunk.
        `size_flagbits` (str): The flag bits associated with the size.
        `fd` (str): The forward pointer of the chunk.
        `bk` (str): The backward pointer of the chunk.
        `fd_nextsize` (str): The forward pointer of the next chunk.
        `bk_nextsize` (str): The backward pointer of the next chunk.
    """

    def __init__(
        self,
        allocated,
        addr,
        prev_size,
        size,
        size_flagbits,
        fd,
        bk,
        fd_nextsize,
        bk_nextsize,
    ):
        self.allocated = allocated
        self.addr = addr
        self.prev_size = prev_size
        self.size = size
        self.size_flagbits = size_flagbits
        self.fd = fd
        self.bk = bk
        self.fd_nextsize = fd_nextsize
        self.bk_nextsize = bk_nextsize

    def __str__(self):
        return f"allocated: {self.allocated}\naddr: {self.addr}\nprev_size: {self.prev_size}\nsize: {self.size} (flagbits: {self.size_flagbits})\nfd: {self.fd}\nbk: {self.bk}\nfd_nextsize: {self.fd_nextsize}\nbk_nextsize: {self.bk_nextsize}\n"

    def __repr__(self):
        return f"allocated: {self.allocated}\naddr: {self.addr}\nprev_size: {self.prev_size}\nsize: {self.size} (flagbits: {self.size_flagbits})\nfd: {self.fd}\nbk: {self.bk}\nfd_nextsize: {self.fd_nextsize}\nbk_nextsize: {self.bk_nextsize}\n"



class Breakpoint:
    """
    Represents a breakpoint in the program execution.

    Attributes:
        `chunks` (list[Chunk]): A list of chunks in the heap after the execution of the breakpoint function.
        `function` (str): The name of the function where the breakpoint is set.
        `memory` (dict[str, str]): A dictionary of memory addresses and their values after the execution of the breakpoint function.
    """

    _chunks: list[Chunk]
    _function: str
    _memory: dict[str, str]

    def __init__(self, chunks, function, memory):
        self._chunks = chunks
        self._function = function
        self._memory = memory
    
    @property
    def chunks(self):
        return self._chunks

    @property
    def function(self):
        return self._function

    @property
    def memory(self):
        return self._memory