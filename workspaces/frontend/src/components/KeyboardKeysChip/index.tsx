// imports
import React from "react";
import "./styles.css";
// ui
import { Chip, styled } from "@mui/material";
// types
import type { KeyboardKeysChipProps } from "./types";

const ThemedChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const KeyboardKeysChip: React.FC<KeyboardKeysChipProps> = (props) => {
  const chips = props.keys.map((key, index) => (
    <ThemedChip
      key={index + ".chip." + key}
      style={{ borderRadius: 4, margin: '1px' }}
      label={key}
      size="small"
    />
  ));
  return <>{chips}</>;
};

export default KeyboardKeysChip;
