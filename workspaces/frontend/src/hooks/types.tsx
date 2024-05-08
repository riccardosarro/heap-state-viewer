export type HandlerFunctions = {
  success?: (_?: unknown) => void;
  error?: (_?: unknown) => void;
}

export type CompileResponse = {
  breakpoints: number[];
  // more to add... (chunk viewer)
}