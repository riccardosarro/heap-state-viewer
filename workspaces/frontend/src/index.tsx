import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { FlowProvider } from "./store/flow-context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <FlowProvider>
      <App />
    </FlowProvider>
  </React.StrictMode>
);
