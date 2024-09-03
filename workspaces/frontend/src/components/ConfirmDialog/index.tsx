// imports
import React from 'react';
import "./styles.css";
// ui
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// types
import type { ConfirmDialogProps } from './types';

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({open, title, content, handleCancel, handleConfirm}) => {
  return (
    <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title || "Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content || "This operation needs to be confirmed."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCancel}>No</Button>
          <Button onClick={handleConfirm} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default ConfirmDialog;
