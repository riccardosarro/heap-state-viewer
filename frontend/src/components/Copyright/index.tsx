// imports
import React from 'react';
import "./styles.css";
// ui
import { Link, Typography } from '@mui/material';
// types
import type { CopyrightProps } from './types';

const Copyright: React.FC<CopyrightProps> = (props) => {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props.props}>
        {'Copyright © '}
        <Link color="inherit" href="https://github.com/riccardosarro">
          Riccardo Sarro
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
        {props.themeButton}
      </Typography>
    );
}

export default Copyright;
