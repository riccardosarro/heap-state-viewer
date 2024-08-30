// imports
import React from "react";
import "./styles.css";
// ui
import { Button, CircularProgress, IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
// types
import type { FlowControlButtonProps } from "./types";

const FlowControlButton: React.FC<FlowControlButtonProps> = (props) => {
  const { icon, children, isLoading } = props;
  const buttonProps = Object.assign({}, props);
  delete buttonProps.icon;
  delete buttonProps.children;
  delete buttonProps.isLoading;
  buttonProps.disabled = buttonProps.disabled || isLoading;

  if (icon) {
    return (
      <IconButton color="secondary" style={{ border: "1px solid" }} {...props}>
        {isLoading ? <CircularProgress size={"1rem"} /> : icon}
      </IconButton>
    );
  }
  return (
    <Button
      startIcon={isLoading ? <CircularProgress size={"1rem"} /> : undefined}
      variant="contained"
      color="secondary"
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

export default FlowControlButton;
