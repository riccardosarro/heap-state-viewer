// imports
import React from "react";
import "./styles.css";
// ui
import { Divider } from "@mui/material";
import Editor from "@monaco-editor/react";
import type { OnChange } from "@monaco-editor/react";
// store
import { useFlow } from "../../store/flow-context";
// types
import type { CodeEditorProps } from "./types";

const CodeEditor: React.FC<CodeEditorProps> = (props) => {
  const [flowState, flowDispatch] = useFlow();

  const handleChange: OnChange = (value, ev) => {
    console.log("ev is", ev);
    console.log("value is", value);
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
      <Divider/>
    </>
  );
};

export default CodeEditor;
