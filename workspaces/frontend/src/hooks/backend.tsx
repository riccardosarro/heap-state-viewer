// imports
import { getBreakpoint, HandlerFunctions, isCompileResponse } from "./types";

const backendUrl = "http://localhost:5000";

export const sendCompile = async (
  code: string,
  { success, error }: HandlerFunctions
) => {
  const data = await fetch(`${backendUrl}/compile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data: unknown) => {
      if (!isCompileResponse(data)) {
        throw new Error("Invalid response");
      }
      if ("error" in data) {
        throw new Error(data.error);
      }
      const breakpoints = data.breakpoints;
      const guardedBreakpoints = breakpoints.map((breakpoint, i) => {
        try {
          return getBreakpoint(breakpoint);
        } catch (e) {
          throw new Error(`Invalid breakpoint #${i} data`);
        }
      });
      success && success();
      return { breakpoints: guardedBreakpoints.filter((b) => b !== null) };
    })
    .catch((err) => {
      error && error();
      let errorMessage: string = "Unknown error";
      if (typeof err === "string") {
        errorMessage = err;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      return { error: errorMessage};
    });

  // const lines = code.split("\n");
  // if ("error" in data) {
  //   console.error(data.error);
  //   return { breakpoints: []};
  // }
  return data;
};
