import { HandlerFunctions } from "./types";

const CODE_KEY = "code";

export const saveCode = (code_value: string, {success, error}: HandlerFunctions) => {
  try {
    localStorage.setItem(CODE_KEY, code_value);
    success && success();
  } catch (err) {
    console.error(err);
    error && error();
  }
}

export const loadCode = ({success, error}: HandlerFunctions) => {
  try {
    const code = localStorage.getItem(CODE_KEY);
    success && success();
    return code;
  } catch (err) {
    console.error(err);
    error && error();
  }
}