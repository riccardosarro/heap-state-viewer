// imports

import { CompileResponse, HandlerFunctions } from "./types";

const backendUrl = "http://localhost:5000";

export const sendCompile = async (
  code: string,
  { success, error }: HandlerFunctions
) => {
  // const data = await fetch(`${backendUrl}/compile`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ code }),
  // })
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     success && success();
  //     // build a guard, type TBD
  //     const guardedData = data as CompileResponse;
  //     return guardedData;
  //   })
  //   .catch((err) => {
  //     error && error();
  //     let errorMessage: string = "Unknown error";
  //     if (typeof err === "string") {
  //       errorMessage = err;
  //     } else if (err instanceof Error) {
  //       errorMessage = err.message;
  //     }
  //     return { error: errorMessage};
  //   });

  const lines = code.split("\n");
  const breakpoints = lines.map((line, index) => {
    return index;
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const data: CompileResponse = {
    breakpoints,
  };
  return data;
};
