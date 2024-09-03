// imports
import React, { memo, useState } from "react";
import "./styles.scss";
// api
import { getMemory } from "../../hooks/backend";
// store
import { useFlow } from "../../store/flow-context";
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
import LoadingComponent from "../LoadingComponent";
import ConfirmDialog from "../ConfirmDialog";
import { HexViewer } from "react-hexviewer-ts";
// types
import type { MemoryViewerDialogProps } from "./types";
import type { MemoryArray } from "../../hooks/types";

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

const MemoryViewerDialog: React.FC<MemoryViewerDialogProps> = memo((props) => {
  const [open, setOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const flowState = useFlow();
  // const chunkMemory = useChunkMemory();
  // fill 0x00
  const [data, setData] = useState<MemoryArray>([]);

  const handleConfirmCancel = () => {
    setConfirmOpen(false);
  }

  const handleConfirmContinue = () => {
    setConfirmOpen(false);
    openDialog();
  }

  const openDialog = () => {
    setOpen(true);
    getMemory(flowState.bpIndex,props.addr, {}).then((res) => {
      if ("error" in res) {
        throw new Error(res.error);
      }
      setData(res);
    }
    ).catch((err) => {
      console.error(err);
      setOpen(false);
    });
  }
  
  const handleClickOpen = () => {
    const chunk = flowState.breakpoints[flowState.bpIndex].chunks.find((chunk) => chunk.addr === props.addr);
    if (chunk && parseInt(chunk.size) > 10000) {
      setConfirmOpen(true);
    } else {
      openDialog();
    }
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
          <HexViewer children={data} noData={<LoadingComponent title={"Loading data..."} />} />
        </DialogContent>
      </ThemedDialog>
      <ConfirmDialog
        open={confirmOpen}
        title={"Exceeding Memory Limit"}
        content={"The memory you are requesting is exceeding the limit of 10000 bytes. This may cause the application to slow down or crash. Do you still want to continue?"}
        handleCancel={handleConfirmCancel}
        handleConfirm={handleConfirmContinue}
      />
        </React.Fragment>
  );
});

export default MemoryViewerDialog;
