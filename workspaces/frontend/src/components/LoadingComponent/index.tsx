// imports
import React from 'react';
import "./styles.css";
// ui
import { LinearProgress } from '@mui/material';
// types
import type { LoadingComponentProps } from './types';

const LoadingComponent: React.FC<LoadingComponentProps> = (props) => {
  return (<>
  {props.title}
  <LinearProgress color="secondary" />
  </>
  );
}

export default LoadingComponent;
