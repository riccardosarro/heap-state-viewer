// imports
import React from "react";
import "./styles.css";
// ui
import { Link, Typography } from "@mui/material";
// types
import type { CopyrightProps } from "./types";
import ShortcutsHelpDialog from "../ShortcutsHelpDialog";

const Copyright: React.FC<CopyrightProps> = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      justifyContent={"center"}
      alignItems={"center"}
      display={"flex"}
      {...props.props}
    >
      <ShortcutsHelpDialog />
      <div style={{ height: "100%" }}>
        {"Copyright © "}
        <Link color="inherit" href="https://github.com/riccardosarro">
          Riccardo Sarro
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </div>
      {props.themeButton}
    </Typography>
  );
};

export default Copyright;
