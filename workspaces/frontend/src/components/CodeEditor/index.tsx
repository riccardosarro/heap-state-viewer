// imports
import React, { useEffect } from "react";
import "./styles.css";
// ui
import { Box, Button, Divider } from "@mui/material";
import Editor from "@monaco-editor/react";
// store
import { useSnackbar } from "notistack";
import { useFlow, useFlowDispatch } from "../../store/flow-context";
import { loadCode, saveCode } from "../../hooks/localStorage";
// types
import type { OnChange } from "@monaco-editor/react";
import type { CodeEditorProps } from "./types";

const DEFAULT_CODES = [
  "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n\tint *a = malloc(sizeof(int));\n\tfree(a);\n\treturn 0;\n}",
  `#include <stdio.h>
#include <stdlib.h>

int main() {
  int* ptr1 = malloc(460);
  int* ptr2 = malloc(432);
  int* ptr3 = malloc(464);
  int* ptr4 = malloc(428);

  printf("Allocated memory blocks:\\n");
  printf("ptr1: %p\\n", ptr1);
  printf("ptr2: %p\\n", ptr2);
  printf("ptr3: %p\\n", ptr3);
  printf("ptr4: %p\\n", ptr4);

  free(ptr2);
  free(ptr3);

  printf("\\nFreed memory blocks:\\n");
  printf("ptr2: %p\\n", ptr2);
  printf("ptr3: %p\\n", ptr3);

  int* ptr5 = malloc(2400);
  int* ptr6 = malloc(400);

  printf("\\nAllocated memory blocks after freeing some:\\n");
  printf("ptr5: %p\\n", ptr5);
  printf("ptr6: %p\\n", ptr6);

  free(ptr1);
  free(ptr4);
  free(ptr5);
  free(ptr6);

  return 0;
}`,
  `#include <stdio.h>
#include <stdlib.h>

int main() {
  for (int i = 0; i < 5; i++) {
    int* ptr = malloc(100);
    int* ptr2 = malloc(300);
    printf("Allocated memory block: %p\\n", ptr);
    free(ptr);
    free(ptr2);
  }
}`,
];

const CodeEditor: React.FC<CodeEditorProps> = (props) => {
  const flowState = useFlow();
  const flowDispatch = useFlowDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const errorHandler = () => {
      enqueueSnackbar("Failed to load code from Local Storage", {variant: "error"});
    }
    const code = loadCode({error: errorHandler});
    if (code) {
      flowDispatch({ type: "SET_CODE", payload: code });
    }
  }, [enqueueSnackbar, flowDispatch]);

  const handleCodeChange = (code: string) => {
    const errorHandler = () => {
      enqueueSnackbar("Failed to save code to Local Storage", {variant: "error"});
    }
    saveCode(code, {error:errorHandler});
    flowDispatch({ type: "SET_CODE", payload: code });
  }

  const handleChange: OnChange = (value, ev) => {
    handleCodeChange(value || "" );
  };

  const setDefaultCodeHandler = (idx: number) => {
    return () => {
      if (flowState.code === DEFAULT_CODES[idx]) {
        return;
      }
      handleCodeChange(DEFAULT_CODES[idx]);
    };
  };

  return (
    <div style={{ height: "100%" }}>
      <div>Code Editor</div>
      <Divider style={{ padding: "4px" }} />
      <Box sx={{ height: "250px" }}>
        <Editor
          theme={props.theme?.palette.mode === "dark" ? "vs-dark" : "light"}
          defaultLanguage="c"
          value={flowState.code}
          onChange={handleChange}
        />
      </Box>
      <Divider sx={{ padding: 0, marginBottom: 2 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        {DEFAULT_CODES.map((_, idx) => (
          <Button
            onClick={setDefaultCodeHandler(idx)}
            color="secondary"
            variant={
              flowState.code === DEFAULT_CODES[idx] ? "contained" : "outlined"
            }
          >
            Example {idx + 1}
          </Button>
        ))}
      </Box>
    </div>
  );
};

export default CodeEditor;
