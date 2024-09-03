// imports
import React from 'react';
import "./styles.css";
// ui
import { Dialog } from '@mui/material';
// types
import type { DialogProps } from '@mui/material';

const CustomDialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog 
    sx={{ backgroundColor: "rgba(0, 0, 0, 0.3) !important" }}
    {...props} />
  );
}

export default CustomDialog;
