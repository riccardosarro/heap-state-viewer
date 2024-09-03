export type HandlerFunctions = {
  success?: (_?: unknown) => void;
  error?: (_?: unknown) => void;
};

export type Chunk = {
  allocated: string;
  addr: string;
  prev_size: string;
  size: string;
  size_flagbits: string;
  fd: string;
  bk: string;
  fd_nextsize: string;
  bk_nextsize: string;
};

export type Breakpoint = {
  id: number;
  function: string;
  chunks: Chunk[];
};

export type BackendResponse<T> = T | ErrorResponse;

export type ErrorResponse = {
  error: string;
};

export type CompileResponse = {
  breakpoints: Breakpoint[];
};

export type MemoryResponse = {
  [addr: MemoryResponseWord]: MemoryResponseWord[];
};

export type MemoryResponseWord = `0x${string}`;

export type MemoryByte = number;

export type MemoryArray = MemoryByte[];

export const cleanChunk = (chunk: Chunk): Chunk => {
  return {
    allocated: chunk.allocated,
    addr: chunk.addr,
    prev_size: chunk.prev_size,
    size: chunk.size,
    size_flagbits: chunk.size_flagbits,
    fd: chunk.fd,
    bk: chunk.bk,
    fd_nextsize: chunk.fd_nextsize,
    bk_nextsize: chunk.bk_nextsize,
  };
};

export const isChunk = (data: unknown): data is Chunk => {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as Chunk).allocated === "string" &&
    typeof (data as Chunk).addr === "string" &&
    typeof (data as Chunk).prev_size === "string" &&
    typeof (data as Chunk).size === "string" &&
    typeof (data as Chunk).size_flagbits === "string" &&
    typeof (data as Chunk).fd === "string" &&
    typeof (data as Chunk).bk === "string" &&
    typeof (data as Chunk).fd_nextsize === "string" &&
    typeof (data as Chunk).bk_nextsize === "string"
  );
};

export const getChunk = (data: unknown): Chunk => {
  if (isChunk(data)) {
    return cleanChunk(data);
  } else {
    throw new Error("Invalid chunk data");
  }
};

export const cleanBreakpoint = (breakpoint: Breakpoint): Breakpoint => {
  return {
    id: breakpoint.id,
    function: breakpoint.function,
    chunks: breakpoint.chunks.map(cleanChunk),
  };
};

export const isBreakpoint = (data: unknown): data is Breakpoint => {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as Breakpoint).id === "number" &&
    typeof (data as Breakpoint).function === "string" &&
    Array.isArray((data as Breakpoint).chunks) &&
    (data as Breakpoint).chunks.every(isChunk)
  );
};

export const getBreakpoint = (data: unknown): Breakpoint => {
  if (isBreakpoint(data)) {
    return cleanBreakpoint(data);
  } else {
    throw new Error("Invalid breakpoint data");
  }
};

export const cleanMemory = (memory: MemoryResponseWord[]): MemoryArray => {
  const memoryArray: MemoryArray = [];
  for (const _word of memory) {
    let word = _word.replace("0x", "");
    while (word.length > 0) {
      memoryArray.push(parseInt(word.slice(word.length - 2, word.length), 16));
      word = word.slice(0, word.length - 2);
    }
  }
  return memoryArray;
};

export const getMemoryFromResponse = (data: MemoryResponse): MemoryArray => {
  const addresses = Object.keys(data);
  if (addresses.length !== 1) {
    throw new Error("Invalid memory addresses");
  }
  const memoryAddress = Object.keys(data)[0] as MemoryResponseWord;
  return cleanMemory(data[memoryAddress]);
};

export const isCompileResponse = (
  data: unknown
): data is BackendResponse<CompileResponse> => {
  // typeof data !== "object" || data === null || !("breakpoints" in data) || !Array.isArray(data.breakpoints)
  if (typeof data === "object" && data !== null) {
    if ("error" in data) {
      return true;
    }
    if ("breakpoints" in data && Array.isArray(data.breakpoints)) {
      return true;
    }
  }
  return false;
};

export const isMemoryResponse = (
  data: unknown
): data is BackendResponse<MemoryResponse> => {
  if (typeof data === "object" && data !== null) {
    if ("error" in data) {
      return true;
    }
    if (
      Object.keys(data).every(
        (key) =>
          key.startsWith("0x") &&
          Array.isArray(data[key as keyof typeof data]) &&
          (data[key as keyof typeof data] as Array<any>).every(
            (word) => typeof word === "string" && word.startsWith("0x")
          )
      )
    ) {
      return true;
    }
  }
  return false;
};
