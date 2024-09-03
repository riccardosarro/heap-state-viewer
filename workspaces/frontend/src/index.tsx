import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// store
import { FlowProvider } from "./store/flow-context";
// toasts
import { SnackbarProvider } from "notistack";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <FlowProvider>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </FlowProvider>
  </React.StrictMode>
);
