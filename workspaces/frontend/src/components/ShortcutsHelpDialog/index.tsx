// imports
import React from "react";
import "./styles.css";
// ui
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CloseIcon from "@mui/icons-material/Close";
import {
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  styled,
  Typography,
} from "@mui/material";
import CustomDialog from "../CustomDialog";
// types
import type { ShortcutsHelpDialogProps } from "./types";
import KeyboardKeysChip from "../KeyboardKeysChip";

const ThemedDialog = styled(CustomDialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  // add background color
  backgroundColor: theme.palette.background.default,
}));

const ShortcutsHelpDialog: React.FC<ShortcutsHelpDialogProps> = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <QuestionMarkIcon />
      </IconButton>
      <ThemedDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Shortcuts Guide
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {/* CTRL+s is for compiling code, when you have compiled correctly and have breakpoints you can
          move between breakpoints with the arrows CTRL+ArrowLeft and CTRL+ArrowRight */}
          <Typography gutterBottom>
            <b>Code Editor</b>
            <Divider sx={{ marginBottom: "4px" }} />
            <KeyboardKeysChip keys={["CTRL", "S"]} /> - Compile code
          </Typography>
          <br />
          <Typography gutterBottom>
            <b>Flow Control</b>
            <Divider sx={{ marginBottom: "4px" }} />
            <Typography gutterBottom>
              <KeyboardKeysChip keys={["CTRL", "ArrowLeft"]} /> - Move to
              previous breakpoint
            </Typography>
            <Typography gutterBottom>
              <KeyboardKeysChip keys={["CTRL", "ArrowRight"]} /> - Move to next
              breakpoint
            </Typography>
          </Typography>
        </DialogContent>
      </ThemedDialog>
    </React.Fragment>
  );
};

export default ShortcutsHelpDialog;
