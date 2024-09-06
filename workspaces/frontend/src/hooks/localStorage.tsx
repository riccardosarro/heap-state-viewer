import type { HandlerFunctions } from "./types";
import type { PaletteMode } from "@mui/material";
const isPaletteMode = (mode: unknown): mode is PaletteMode => typeof mode === "string" && (mode === "light" || mode === "dark");

const CODE_KEY = "code";
const THEME_KEY = "theme";

export const saveItem = (key: string, value: string, {success, error}: HandlerFunctions) => {
  try {
    localStorage.setItem(key, value);
    success && success();
  } catch (err) {
    console.error(err);
    error && error();
  }
}

export const loadItem = (key: string, {success, error}: HandlerFunctions) => {
  try {
    const item = localStorage.getItem(key);
    success && success();
    return item;
  } catch (err) {
    console.error(err);
    error && error();
  }
}

export const saveCode = (code_value: string, {success, error}: HandlerFunctions) => {
  return saveItem(CODE_KEY, code_value, {success, error});
}

export const loadCode = ({success, error}: HandlerFunctions) => {
  return loadItem(CODE_KEY, {success, error});
}

export const saveTheme = (theme_value: PaletteMode, {success, error}: HandlerFunctions) => {
  return saveItem(THEME_KEY, theme_value, {success, error});
}

export const loadTheme = ({success, error}: HandlerFunctions) => {
  const item = loadItem(THEME_KEY, {success, error});
  return isPaletteMode(item) ? item : "light";
}