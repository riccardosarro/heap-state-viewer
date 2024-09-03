// imports
import React from "react";
import "./styles.scss";
// ui
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
} from "@mui/material";
// components
import { HexViewer } from "react-hexviewer-ts";
// types
import type { MemoryViewerDialogProps } from "./types";

const ThemedDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  // add background color
  backgroundColor: theme.palette.background.default,
}));

const MemoryViewerDialog: React.FC<MemoryViewerDialogProps> = (props) => {
  const [open, setOpen] = React.useState(false);
  // const chunkMemory = useChunkMemory();
  // fill 0x00
  const data = ((length) => {
    var array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return array;
  })(50);


  const fromHexString = (hexString: string): number =>  {
    const hexNumber = hexString.replace(/^0x/, '');
    return parseInt(hexNumber, 16);
  }



  const handleClickOpen = () => {
    // dispatch(fetchChunkMemory(props.addr));
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <ZoomInIcon />
      </IconButton>
      <ThemedDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Memory Viewer [{props.addr}]
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
          <HexViewer children={Array.from(data)} />
        </DialogContent>
      </ThemedDialog>
    </React.Fragment>
  );
};

export default MemoryViewerDialog;
