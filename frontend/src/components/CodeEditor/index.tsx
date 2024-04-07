// imports
import React from "react";
import "./styles.css";
// ui
import Editor from "@monaco-editor/react";
import type { OnChange } from "@monaco-editor/react";
// types
import type { CodeEditorProps } from "./types";
import { Divider } from "@mui/material";
import { useFlow } from "../../store/flow-context";

const CodeEditor: React.FC<CodeEditorProps> = (props) => {
  const [flowState, flowDispatch] = useFlow();

  const handleChange: OnChange = (value, ev) => {
    console.log("ev is", ev);
    flowDispatch({ type: "SET_CODE", payload: value || "" });
  };

  return (
    <>
      <div>Code Editor</div>
      <Divider style={{ padding: "4px" }} />
      <Editor
        theme={props.theme?.palette.mode === "dark" ? "vs-dark" : "light"}
        defaultLanguage="c"
        value={flowState.code}
        onChange={handleChange}
      />
    </>
  );
};

export default CodeEditor;
