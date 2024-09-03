import React from 'react';

export type ConfirmDialogProps = {
  // props
  open: boolean;
  title?: string;
  content?: string;
  handleCancel: () => void;
  handleConfirm: () => void;
};

