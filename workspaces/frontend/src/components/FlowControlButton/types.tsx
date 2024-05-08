import React from 'react';
import type { ButtonProps } from '@mui/material';

export interface FlowControlButtonProps extends ButtonProps {
  // props
  icon?: React.ReactNode; // default undefined -> no icon
  isLoading?: boolean;
};

